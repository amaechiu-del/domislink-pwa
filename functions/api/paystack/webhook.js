// Cloudflare Pages Function: Paystack webhook
// Required server-side environment variables:
// PAYSTACK_SECRET_KEY
// SUPABASE_URL
// SUPABASE_SERVICE_ROLE_KEY

function toHex(buffer) {
    return [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hmacSha512(secret, body) {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        enc.encode(secret),
        { name: 'HMAC', hash: 'SHA-512' },
        false,
        ['sign']
    );
    return toHex(await crypto.subtle.sign('HMAC', key, enc.encode(body)));
}

function constantTimeEqual(a, b) {
    if (!a || !b || a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return result === 0;
}

export async function onRequestPost(context) {
    const { request, env } = context;
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature') || '';

    if (!env.PAYSTACK_SECRET_KEY || !env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
        return new Response('Server payment configuration is incomplete', { status: 500 });
    }

    const expected = await hmacSha512(env.PAYSTACK_SECRET_KEY, body);
    if (!constantTimeEqual(signature.toLowerCase(), expected.toLowerCase())) {
        return new Response('Invalid signature', { status: 401 });
    }

    let event;
    try {
        event = JSON.parse(body);
    } catch {
        return new Response('Invalid JSON', { status: 400 });
    }

    if (event.event !== 'charge.success') {
        return new Response('Ignored', { status: 200 });
    }

    const payment = event.data || {};
    const reference = payment.reference;
    const amount = Number(payment.amount);
    const currency = payment.currency;
    const email = payment.customer?.email?.toLowerCase();
    const plan = payment.metadata?.plan;
    const userId = payment.metadata?.user_id;

    const allowedPlans = {
        monthly: { amount: 200000, days: 30 },
        termly: { amount: 500000, days: 90 },
        yearly: { amount: 1500000, days: 365 }
    };

    if (!reference || !email || currency !== 'NGN' || !userId || !allowedPlans[plan]) {
        return new Response('Invalid payment metadata', { status: 400 });
    }

    // Verify the transaction directly with Paystack before granting entitlement.
    const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
        headers: { Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}` }
    });

    if (!verifyResponse.ok) return new Response('Paystack verification failed', { status: 400 });

    const verification = await verifyResponse.json();
    const verified = verification?.data;
    const expectedPlan = allowedPlans[plan];

    if (
        !verified ||
        verified.status !== 'success' ||
        verified.reference !== reference ||
        verified.currency !== 'NGN' ||
        Number(verified.amount) !== expectedPlan.amount ||
        verified.customer?.email?.toLowerCase() !== email
    ) {
        return new Response('Payment verification failed', { status: 400 });
    }

    const now = new Date();
    const expires = new Date(now.getTime() + expectedPlan.days * 24 * 60 * 60 * 1000);

    const supabaseResponse = await fetch(`${env.SUPABASE_URL}/rest/v1/subscriptions?on_conflict=paystack_reference`, {
        method: 'POST',
        headers: {
            apikey: env.SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates,return=minimal'
        },
        body: JSON.stringify({
            user_id: userId,
            plan,
            status: 'active',
            paystack_reference: reference,
            amount_kobo: verified.amount,
            currency: 'NGN',
            starts_at: now.toISOString(),
            expires_at: expires.toISOString(),
            updated_at: now.toISOString()
        })
    });

    if (!supabaseResponse.ok) {
        console.error('Supabase subscription write failed:', await supabaseResponse.text());
        return new Response('Subscription update failed', { status: 500 });
    }

    return new Response('OK', { status: 200 });
}
