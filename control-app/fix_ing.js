
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

const envPath = path.resolve(__dirname, '.env.local');

let envConfig = {};
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, val] = line.split('=');
        if (key && val) envConfig[key.trim()] = val.trim();
    });
} catch (e) { console.log(e); }

const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function fixIngStatus() {
    console.log("Checking for 'ing' status...");

    const { data: orders } = await supabase
        .from('orders')
        .select('id, status')
        .eq('status', 'ing');

    if (!orders || orders.length === 0) {
        console.log("No 'ing' orders found.");
        return;
    }

    console.log(`Found ${orders.length} orders with status 'ing'. Fixing...`);

    for (const order of orders) {
        const { error } = await supabase
            .from('orders')
            .update({ status: 'en_route' })
            .eq('id', order.id);

        if (!error) console.log(`Fixed order ${order.id}`);
    }
}

fixIngStatus();
