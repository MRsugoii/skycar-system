
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

console.log("URL:", url);
console.log("Key Length:", key ? key.length : 0);

const supabase = createClient(url, key);

async function check() {
    console.log("Checking vehicle_types...");
    const { data: vData, error: vError } = await supabase.from('vehicle_types').select('*').limit(1);
    if (vError) console.error("vehicle_types error:", vError);
    else console.log("vehicle_types success, count:", vData.length);

    console.log("Checking airport_prices...");
    const { data: aData, error: aError } = await supabase.from('airport_prices').select('*').limit(1);
    if (aError) console.error("airport_prices error:", aError);
    else {
        console.log("airport_prices success, count:", aData.length);
        if (aData.length > 0) console.log("Sample Row:", JSON.stringify(aData[0], null, 2));
    }
}

check();
