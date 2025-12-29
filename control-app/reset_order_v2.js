
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Try current directory first (since we run inside control-app)
let envPath = path.resolve(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
    // Try parent if not found (fallback)
    envPath = path.resolve(__dirname, '../control-app/.env.local');
}

let envConfig = {};
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, val] = line.split('=');
        if (key && val) envConfig[key.trim()] = val.trim();
    });
} catch (e) {
    console.error("Failed to load env:", e);
}

if (!envConfig.NEXT_PUBLIC_SUPABASE_URL) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL");
    process.exit(1);
}

const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function resetOrder() {
    console.log("Resetting order status...");

    // Target the specific order that is 'en_route' (CH202512252003)
    const orderId = '29846812-d203-4e9b-84e4-c642bb5f3c6a';

    const { error } = await supabase
        .from('orders')
        .update({ status: 'confirmed' }) // Reset to confirmed
        .eq('id', orderId);

    if (error) {
        console.error("Error resetting order:", error);
    } else {
        console.log(`Order ${orderId} reset to 'confirmed'.`);
    }
}

resetOrder();
