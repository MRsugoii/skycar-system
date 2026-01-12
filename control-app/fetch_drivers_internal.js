
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local to get Supabase credentials from CURRENT directory
const envPath = path.resolve(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

// More robust regex to handle quotes and whitespace
const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=["']?([^"'\n]+)["']?/);
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=["']?([^"'\n]+)["']?/);

if (!urlMatch || !keyMatch) {
    console.error("Could not read credentials from .env.local");
    process.exit(1);
}

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();

console.log("Supabase URL extracted:", supabaseUrl);
// console.log("Supabase Key extracted:", supabaseKey); // Don't log secret

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
            Username: d.username
        })));
    }
}

main();
