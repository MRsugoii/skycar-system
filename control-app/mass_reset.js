
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

const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function resetAllDriverOrders() {
    console.log("Resetting ALL active orders for driver '王小明'...");

    // 1. Get Driver ID
    const { data: driver } = await supabase.from('drivers').select('id').eq('name', '王小明').single();
    if (!driver) {
        console.error("Driver not found");
        return;
    }
    console.log("Driver ID:", driver.id);

    // 2. Find all non-completed/non-cancelled orders for this driver
    const { data: orders } = await supabase
        .from('orders')
        .select('id, status, note')
        .eq('driver_id', driver.id)
        .in('status', ['en_route', 'pickedUp', 'picking_up']); // Include any 'in progress' statuses

    console.log(`Found ${orders.length} orders to reset:`, orders);

    if (orders.length === 0) {
        console.log("No partial orders found. Checking if there are 'confirmed' orders...");
        const { data: confirmed } = await supabase
            .from('orders')
            .select('id, status')
            .eq('driver_id', driver.id)
            .eq('status', 'confirmed');
        console.log(`Driver has ${confirmed.length} confirmed orders.`);
        return;
    }

    const ids = orders.map(o => o.id);

    // 3. Update them all to 'confirmed'
    const { error } = await supabase
        .from('orders')
        .update({ status: 'confirmed' })
        .in('id', ids);

    if (error) {
        console.error("Error updating:", error);
    } else {
        console.log("✅ Successfully reset orders to 'confirmed'.");
    }
}

resetAllDriverOrders();
