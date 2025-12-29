
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// Load env vars
const envPath = path.resolve(__dirname, '.env.local');
// Manual env parsing
const envContent = fs.readFileSync(envPath, 'utf8');
const envConfig = {};
envContent.split('\n').forEach(line => {
    const [key, val] = line.split('=');
    if (key && val) envConfig[key.trim()] = val.trim();
});

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixOrders() {
    console.log("Starting DB Repair...");
    const { data: orders, error } = await supabase.from('orders').select('*');

    if (error) {
        console.error("Error fetching", error);
        return;
    }

    console.log(`Found ${orders.length} orders. Processing...`);

    for (const order of orders) {
        let needsUpdate = false;
        let updateData = {};

        // 1. Generate CH ID if missing in note
        const currentNote = order.note || "";
        const idMatch = currentNote.match(/\[ID: (CH\d+(?:-[A-Z]+)?)\]/);

        if (!idMatch) {
            const d = new Date(order.created_at);
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            const suffix = order.id.substring(0, 4).toUpperCase();
            const newId = `CH${yyyy}${mm}${dd}${suffix}`; // Simple fallback

            updateData.note = `[ID: ${newId}] ${currentNote}`.trim();
            needsUpdate = true;
            console.log(` -> Assigning ID ${newId} to ${order.id}`);
        }

        // 2. Normalize Status
        let status = (order.status || "").toLowerCase();
        let newStatus = status;

        if (status === 'cancel' || status === 'canceled') newStatus = 'cancelled';
        if (status === 'route' || status === 'enroute') newStatus = 'en_route';

        if (newStatus !== status) {
            updateData.status = newStatus;
            needsUpdate = true;
            console.log(` -> Fixing status ${status} to ${newStatus}`);
        }

        if (needsUpdate) {
            const { error: updateError } = await supabase
                .from('orders')
                .update(updateData)
                .eq('id', order.id);

            if (updateError) console.error("Update failed:", updateError);
        }
    }
    console.log("DB Repair Complete.");
}

fixOrders();
