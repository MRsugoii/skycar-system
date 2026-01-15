const { createClient } = require('@supabase/supabase-js');

// Helper to deduce schema from a row
async function checkTable(tableName) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`\n--- Inspecting [${tableName}] ---`);

    // 1. Try to fetch one row
    const { data, error } = await supabase.from(tableName).select('*').limit(1);

    if (error) {
        console.error(`Error fetching ${tableName}:`, error.message);
        return;
    }

    if (data && data.length > 0) {
        const row = data[0];
        console.log("Columns found:");
        Object.keys(row).forEach(key => {
            console.log(` - ${key}: ${typeof row[key]} (Value: ${row[key]})`);
        });
    } else {
        console.log("Table is empty. Cannot deduce columns from row.");
        // Try inserting a dummy verify validation if needed, but let's stick to read first.
    }
}

async function run() {
    await checkTable('extra_settings');
    await checkTable('vehicle_types');
}

run();
