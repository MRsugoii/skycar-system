
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local to get Supabase credentials
const envPath = path.resolve(__dirname, 'control-app/.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=([^\n]+)/);
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=([^\n]+)/);

if (!urlMatch || !keyMatch) {
    console.error("Could not read credentials from control-app/.env.local");
    process.exit(1);
}

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log("Fetching drivers...");
    const { data: drivers, error } = await supabase
        .from('drivers')
        .select('*');

    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Drivers List:");
        console.table(drivers.map(d => ({
            ID: d.id,
            Name: d.name,
            Username: d.username,
            Phone: d.phone
        })));
    }
}

main();
