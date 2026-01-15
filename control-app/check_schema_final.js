const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema(tableName) {
    console.log(`\n--- ${tableName} ---`);
    const { data, error } = await supabase.from(tableName).select('*').limit(1);
    if (error) {
        console.log(`Error: ${error.message}`);
    } else if (data && data.length > 0) {
        console.log("Columns:", Object.keys(data[0]).join(", "));
        console.log("Sample Data:", JSON.stringify(data[0], null, 2));
    } else {
        console.log("Table empty. Cannot deduce schema.");
        // Try insert dummy to trigger error about missing column?
    }
}

async function run() {
    await checkSchema('extra_settings');
    await checkSchema('vehicle_types');
}

run();
