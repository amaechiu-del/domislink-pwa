// Secure bootstrap wrapper.
// The original application core is preserved as app-core.js; this wrapper
// prevents the legacy localStorage identity from becoming authoritative and
// then loads the Supabase authentication bridge.

(async () => {
    const load = (src) => new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
    });

    try {
        await load('app-core.js');

        // Preserve the complete legacy application while disabling its
        // browser-only identity as an authority.
        if (typeof CONFIG !== 'undefined') CONFIG.adminEmail = 'domislinkint@gmail.com';
        if (typeof currentUser !== 'undefined') currentUser = null;
        if (typeof DB !== 'undefined') DB.remove('currentUser');

        await load('runtime-config.js');
        await load('auth.js');
    } catch (error) {
        console.error('Application bootstrap failed:', error);
    }
})();
