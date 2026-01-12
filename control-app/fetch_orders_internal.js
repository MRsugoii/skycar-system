
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local
const envPath = path.resolve(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=["']?([^"'\n]+)["']?/);
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=["']?([^"'\n]+)["']?/);

if (!urlMatch || !keyMatch) process.exit(1);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("Fetching competing orders...");

    // Select minimal valid columns
    const { data: orders, error } = await supabase
        .from('orders')
        .select('id, status, driver_id, note')
        .or('note.ilike.%CH202601061748%,note.ilike.%CH202601064349%'); // Focus on finding these specific orders

    if (error) console.error(error);
    else {
        console.table(orders.map(o => ({
            ID: (o.note && o.note.match(/CH\d+/)) ? o.note.match(/CH\d+/)[0] : o.id.slice(0, 8),
            Status: o.status,
            DriverUUID: o.driver_id,
            Note: o.note ? o.note.substring(0, 20) + "..." : "No Note"
        })));
    }
}

main();
