
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

const envPath = path.resolve(__dirname, 'control-app/.env.local');
let envConfig = {};
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, val] = line.split('=');
        if (key && val) envConfig[key.trim()] = val.trim();
    });
} catch (e) {
    // Fallback to Driver App env if Control App fails (unlikely given previous success)
    try {
        const envPath2 = path.resolve(__dirname, 'driver-app/.env.local');
        const envContent2 = fs.readFileSync(envPath2, 'utf8');
        envContent2.split('\n').forEach(line => {
            const [key, val] = line.split('=');
            if (key && val) envConfig[key.trim()] = val.trim();
        });
    } catch (e2) { }
}

const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function resetOrder() {
    console.log("Resetting order status...");

    // Target the specific order that is 'en_route' (CH202512252003)
    // ID from previous check: 29846812-d203-4e9b-84e4-c642bb5f3c6a
    const orderId = '29846812-d203-4e9b-84e4-c642bb5f3c6a';

    const { error } = await supabase
        .from('orders')
        .update({ status: 'confirmed' }) // Reset to confirmed (Active, but not started)
        .eq('id', orderId);

    if (error) {
        console.error("Error resetting order:", error);
    } else {
        console.log(`Order ${orderId} reset to 'confirmed'.`);
    }
}

resetOrder();
