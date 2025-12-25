const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function verify() {
    console.log("Starting Supabase Verification...");

    // 1. Read .env.local
    const envPath = path.join(__dirname, '.env.local');
    if (!fs.existsSync(envPath)) {
        console.error("❌ Error: .env.local file not found.");
        return;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
    const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

    if (!urlMatch || !keyMatch) {
        console.error("❌ Error: Supabase keys missing in .env.local");
        return;
    }

    const supabaseUrl = urlMatch[1].trim();
    const supabaseKey = keyMatch[1].trim();

    if (!supabaseUrl.startsWith('http')) {
        console.error("❌ Error: Invalid Supabase URL format.");
        return;
    }

    console.log("✅ API Keys found.");

    // 2. Initialize Client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 3. Check Tables
    const tables = ['vehicle_types', 'drivers', 'orders', 'users'];
    let allPassed = true;

    for (const table of tables) {
        try {
            // Just try to fetch one row or count to verify existence/permission
            const { error } = await supabase.from(table).select('*').limit(1);

            if (error) {
                // If table doesn't exist, Supabase typically returns code '42P01' (undefined_table) or similar 404/400 error
                console.error(`❌ Table Check Failed: '${table}' - ${error.message} (${error.code})`);
                allPassed = false;
            } else {
                console.log(`✅ Table Check Passed: '${table}'`);
            }
        } catch (err) {
            console.error(`❌ Connection Error for '${table}': ${err.message}`);
            allPassed = false;
        }
    }

    if (allPassed) {
        console.log("\n🎉 SUCCESS: All Supabase tables are accessible!");
        console.log("Remote database is correctly configured.");
    } else {
        console.log("\n⚠️ WARNING: Some checks failed.");
        console.log("Please ensure you have run the SQL script in Supabase SQL Editor.");
    }
}

verify();
