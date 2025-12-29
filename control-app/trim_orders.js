
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

const envPath = path.resolve(__dirname, '.env.local');

// Manual env parsing
let envConfig = {};
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, val] = line.split('=');
        if (key && val) envConfig[key.trim()] = val.trim();
    });
} catch (e) {
    console.error("Could not load env file from", envPath);
    process.exit(1);
}

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function trimOrders() {
    console.log("Starting Order Trimming...");

    // 1. Fetch ALL orders first to decide which ones to keep/delete
    const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false }); // Newest first

    if (error) {
        console.error("Error fetching orders:", error);
        return;
    }

    console.log(`Total orders found: ${orders.length}`);

    // Filter by status
    const completedOrders = orders.filter(o => o.status === 'completed');
    const confirmedOrders = orders.filter(o => o.status === 'confirmed');

    // Define limits (Keep 3 newest of each, delete the rest)
    const KEEP_COUNT = 3;

    const toDeleteIds = [];

    // Process Completed
    if (completedOrders.length > KEEP_COUNT) {
        const remove = completedOrders.slice(KEEP_COUNT); // Skip the first 3
        console.log(`Marking ${remove.length} 'completed' orders for deletion...`);
        remove.forEach(o => toDeleteIds.push(o.id));
    }

    // Process Confirmed
    if (confirmedOrders.length > KEEP_COUNT) {
        const remove = confirmedOrders.slice(KEEP_COUNT); // Skip the first 3
        console.log(`Marking ${remove.length} 'confirmed' orders for deletion...`);
        remove.forEach(o => toDeleteIds.push(o.id));
    }

    if (toDeleteIds.length === 0) {
        console.log("No orders need deletion.");
        return;
    }

    console.log(`Deleting ${toDeleteIds.length} orders from database...`);

    // Perform Deletion
    const { error: deleteError } = await supabase
        .from('orders')
        .delete()
        .in('id', toDeleteIds);

    if (deleteError) {
        console.error("Deletion failed:", deleteError);
    } else {
        console.log("Deletion successful!");
    }
}

trimOrders();
