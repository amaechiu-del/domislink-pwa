// Production authentication bridge for the existing TeachMaster UI.
// This file is loaded after app.js so it can replace the prototype's
// localStorage login handlers without removing the existing UI.

(() => {
    const SUPABASE_URL = window.DOMISLINK_SUPABASE_URL || '';
    const SUPABASE_ANON_KEY = window.DOMISLINK_SUPABASE_ANON_KEY || '';
    const ADMIN_EMAIL = 'domislinkint@gmail.com';

    let client = null;
    let subscriptionActive = false;
    let profileRole = 'user';

    function loadSupabaseSdk() {
        return new Promise((resolve, reject) => {
            if (window.supabase?.createClient) return resolve();
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
            script.onload = resolve;
            script.onerror = () => reject(new Error('Unable to load authentication library'));
            document.head.appendChild(script);
        });
    }

    function configured() {
        return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
    }

    async function loadProfile(user) {
        if (!client || !user) return null;
        const { data, error } = await client
            .from('profiles')
            .select('id,email,full_name,role')
            .eq('id', user.id)
            .maybeSingle();

        if (error) {
            console.error('Profile lookup failed:', error);
            return null;
        }

        profileRole = data?.role || 'user';
        return data;
    }

    async function loadSubscription(user) {
        if (!client || !user) {
            subscriptionActive = false;
            return;
        }

        const { data, error } = await client
            .from('subscriptions')
            .select('status,expires_at')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .gt('expires_at', new Date().toISOString())
            .order('expires_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) console.error('Subscription lookup failed:', error);
        subscriptionActive = Boolean(data && !error);
    }

    async function applySession(session) {
        if (!session?.user) {
            currentUser = null;
            profileRole = 'user';
            subscriptionActive = false;
            updateUI();
            return;
        }

        const user = session.user;
        const profile = await loadProfile(user);

        currentUser = {
            id: user.id,
            email: user.email,
            name: profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            role: profileRole
        };

        await loadSubscription(user);

        const savedStats = DB.get(`stats_${user.id}`);
        if (savedStats) userStats = savedStats;

        updateUI();
    }

    window.handleAuth = async function handleAuth() {
        if (!configured()) {
            showToast('Authentication is not configured yet. Add the Supabase project URL and publishable/anon key.');
            return;
        }

        const email = document.getElementById('authEmail').value.trim().toLowerCase();
        const password = document.getElementById('authPassword').value;
        const name = document.getElementById('authName').value.trim();

        if (!email || !password) {
            showToast('Please fill all fields!');
            return;
        }
        if (isSignUp && !name) {
            showToast('Please enter your name!');
            return;
        }
        if (password.length < 8) {
            showToast('Password must be at least 8 characters.');
            return;
        }

        if (isSignUp) {
            const { data, error } = await client.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: name },
                    emailRedirectTo: window.location.origin + window.location.pathname
                }
            });

            if (error) {
                showToast(error.message);
                return;
            }

            closeModal('authModal');
            showToast(data.session ? 'Account created! 🎉' : 'Account created. Check your email to confirm your account.');
            return;
        }

        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) {
            showToast('Login failed. Check your email and password.');
            return;
        }

        closeModal('authModal');
        showToast('Welcome back! 👋');
    };

    window.onLogin = async function onLogin() {
        // Login is now controlled by Supabase auth-state events.
        const { data } = await client?.auth.getSession();
        await applySession(data?.session || null);
    };

    window.logout = async function logout() {
        if (currentUser?.id) DB.remove(`stats_${currentUser.id}`);
        if (client) await client.auth.signOut();
        currentUser = null;
        profileRole = 'user';
        subscriptionActive = false;
        updateUI();
        showToast('Logged out successfully');
    };

    window.isSubscribed = function isSubscribed() {
        return Boolean(currentUser && subscriptionActive);
    };

    window.isAdministrator = function isAdministrator() {
        return Boolean(currentUser && ['admin', 'super_admin'].includes(profileRole));
    };

    window.requireAdministrator = function requireAdministrator() {
        if (!currentUser) {
            showToast('Please login first.');
            showModal('authModal');
            return false;
        }
        if (!['admin', 'super_admin'].includes(profileRole)) {
            showToast('Administrator authorization required.');
            return false;
        }
        return true;
    };

    window.processSubscription = async function processSubscription() {
        if (!currentUser) {
            showToast('Please login first!');
            closeModal('subscribeModal');
            showModal('authModal');
            return;
        }

        const plan = document.getElementById('subPlan').value;
        if (!['monthly', 'termly', 'yearly'].includes(plan)) {
            showToast('Please select a valid subscription plan.');
            return;
        }

        const { data: { session } } = await client.auth.getSession();
        if (!session?.access_token) {
            showToast('Your login session has expired. Please login again.');
            return;
        }

        const response = await fetch('/api/paystack/initialize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`
            },
            body: JSON.stringify({
                plan,
                callback_url: window.location.origin + window.location.pathname
            })
        });

        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.authorization_url) {
            showToast(result.error || 'Unable to start payment.');
            return;
        }

        window.location.href = result.authorization_url;
    };

    window.loadAdminStats = async function loadAdminStats() {
        if (!window.requireAdministrator()) return;
        const { count: users } = await client.from('profiles').select('*', { count: 'exact', head: true });
        const { count: subscribers } = await client
            .from('subscriptions')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active')
            .gt('expires_at', new Date().toISOString());

        const usersEl = document.getElementById('adminUsers');
        const subscribersEl = document.getElementById('adminSubscribers');
        if (usersEl) usersEl.textContent = users ?? 0;
        if (subscribersEl) subscribersEl.textContent = subscribers ?? 0;
    };

    document.addEventListener('DOMContentLoaded', async () => {
        if (!configured()) {
            console.warn('Supabase is not configured. The app will not treat localStorage as authentication.');
            return;
        }

        try {
            await loadSupabaseSdk();
            client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            window.domislinkSupabase = client;

            client.auth.onAuthStateChange((_event, session) => {
                // Defer database work so auth callbacks stay lightweight.
                setTimeout(() => applySession(session), 0);
            });

            const { data } = await client.auth.getSession();
            await applySession(data.session);
        } catch (error) {
            console.error('Authentication initialization failed:', error);
            showToast('Authentication service could not be initialized.');
        }
    });
})();
