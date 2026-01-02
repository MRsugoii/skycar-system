
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env.local');
const env = fs.readFileSync(envPath, 'utf8');
const getVal = (key) => {
    const line = env.split('\n').find(l => l.trim().startsWith(key));
    if (!line) return null;
    const val = line.split('=')[1];
    return val ? val.trim().replace(/['"]/g, '') : null;
};

const url = getVal('NEXT_PUBLIC_SUPABASE_URL');
const key = getVal('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const supabase = createClient(url, key);

async function check() {
    console.log("--- Checking airport_prices ---");

    // Test 1: HEAD
    console.log("1. HEAD request:");
    const { count, error: headError } = await supabase.from('airport_prices').select('*', { count: 'exact', head: true });
    if (headError) console.log("HEAD Error:", headError);
    else console.log("HEAD Success. Count:", count);

    // Test 2: SELECT
    console.log("2. SELECT request:");
    const { data, error: selectError } = await supabase.from('airport_prices').select('*').limit(1);
    if (selectError) console.log("SELECT Error:", selectError);
    else console.log("SELECT Success. Data:", data);

    // Test 3: vehicle_types (Control)
    console.log("--- Control: vehicle_types ---");
    const { error: vError } = await supabase.from('vehicle_types').select('*').limit(1);
    console.log("Vehicle Types SELECT:", vError ? "Error" : "Success");
}

check();
