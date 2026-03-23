
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local
const envPath = path.resolve(__dirname, 'control-app/.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=["']?([^"'\n]+)["']?/);
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=["']?([^"'\n]+)["']?/);

if (!urlMatch || !keyMatch) process.exit(1);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function main() {
    console.log("Checking status of order 349...");

    const { data: orders, error } = await supabase
        .from('orders')
        .select('id, status, status_history, note')
        .ilike('note', '%CH202601064349%'); // Order 349

    if (error) console.error(error);
    else {
        console.table(orders.map(o => ({
            ID: (o.note && o.note.match(/CH\d+/)) ? o.note.match(/CH\d+/)[0] : o.id.slice(0, 8),
            Status: o.status,
            Note: o.note ? o.note.substring(0, 20) : "N/A"
        })));
    }
}

main();
