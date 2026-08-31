-- TeachMaster / DomisLink authentication foundation
-- Run this in Supabase SQL Editor after creating the project.

create extension if not exists pgcrypto;

do $$ begin
  create type public.app_role as enum (
    'user','student','business','agent','publisher','moderator','admin','super_admin'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null check (plan in ('monthly','termly','yearly','school')),
  status text not null default 'inactive' check (status in ('inactive','active','expired','cancelled')),
  paystack_reference text unique,
  amount_kobo bigint,
  currency text not null default 'NGN',
  starts_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists subscriptions_reference_idx on public.subscriptions(paystack_reference);

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;

-- SECURITY DEFINER helper avoids recursive RLS checks when preserving a role.
create or replace function public.current_user_role()
returns public.app_role
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

revoke all on function public.current_user_role() from public;
grant execute on function public.current_user_role() to authenticated;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
on public.profiles for select
to authenticated
using (id = auth.uid());

-- A user may edit profile details but cannot change their role.
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid() and role = public.current_user_role());

drop policy if exists subscriptions_select_own on public.subscriptions;
create policy subscriptions_select_own
on public.subscriptions for select
to authenticated
using (user_id = auth.uid());

-- No client INSERT/UPDATE/DELETE policies for subscriptions.
-- A trusted server/webhook creates entitlements after Paystack verification.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Bootstrap the named administrator after the account has been created.
-- This does NOT create an account or a password.
update public.profiles
set role = 'admin', updated_at = now()
where lower(email) = lower('domislinkint@gmail.com');
