// Cloudflare Pages Function: securely initialize a Paystack transaction.
// Required environment variables:
// PAYSTACK_SECRET_KEY
// SUPABASE_URL
// SUPABASE_ANON_KEY

const PLANS = {
    monthly: { amount: 200000, days: 30 },
    termly: { amount: 500000, days: 90 },
    yearly: { amount: 1500000, days: 365 }
};

export async function onRequestPost(context) {
    const { request, env } = context;

    if (!env.PAYSTACK_SECRET_KEY || !env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
        return Response.json({ error: 'Payment service is not configured' }, { status: 500 });
    }

    const auth = request.headers.get('authorization') || '';
    if (!auth.toLowerCase().startsWith('bearer ')) {
        return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Validate the user's Supabase access token through Supabase Auth.
    const userResponse = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
        headers: {
            apikey: env.SUPABASE_ANON_KEY,
            Authorization: auth
        }
    });

    if (!userResponse.ok) {
        return Response.json({ error: 'Invalid authentication session' }, { status: 401 });
    }

    const user = await userResponse.json();
    const body = await request.json().catch(() => ({}));
    const plan = body.plan;
    const selected = PLANS[plan];

    if (!selected) return Response.json({ error: 'Invalid subscription plan' }, { status: 400 });

    const reference = `TM-${user.id}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    const callbackUrl = body.callback_url || new URL('/', request.url).toString();

    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: user.email,
            amount: String(selected.amount),
            currency: 'NGN',
            reference,
            callback_url: callbackUrl,
            metadata: {
                user_id: user.id,
                plan,
                email: user.email
            }
        })
    });

    const result = await paystackResponse.json();
    if (!paystackResponse.ok || !result.status) {
        return Response.json({ error: 'Unable to initialize payment' }, { status: 502 });
    }

    return Response.json({
        authorization_url: result.data.authorization_url,
        access_code: result.data.access_code,
        reference: result.data.reference
    });
}
