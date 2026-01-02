const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
    // Query information_schema to check table existence
    const { data, error } = await supabase
        .from('information_schema.tables') // This might not work directly via client if permissions are tight, but let's try RPC or indirect check.
        // Actually, simple way is to check the error message when selecting.
        // Let's rely on standard error catching on simple select.
        .select('*')
        .fail();
}

async function debugTables() {
    console.log("Checking tables...");
    const tables = ['holidays', 'route_prices', 'airport_prices', 'vehicle_types'];
    for (let t of tables) {
        const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true });
        if (error) console.log(`${t}: ERROR - ${error.message}`);
        else console.log(`${t}: OK - ${count} rows`);
    }
}

debugTables();
