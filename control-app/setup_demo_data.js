
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim().replace(/['"]/g, '');
const supabaseKey = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim().replace(/['"]/g, '');
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log("Setting up demo data in Supabase...");

    // 1. Upsert 王小明
    const { data: d1, error: e1 } = await supabase.from('drivers').upsert({
        national_id: 'A123456789',
        name: '王小明',
        phone: '0912345678',
        email: 'wang@example.com',
        status: '正常'
    }, { onConflict: 'national_id' }).select();
    if (e1) console.error("Error 王小明:", e1);
    else console.log('Upserted 王小明:', d1[0].name);

    // 2. Upsert 孫小美
    const { data: d2, error: e2 } = await supabase.from('drivers').upsert({
        national_id: 'C123456789',
        name: '孫小美',
        phone: '0987-654-321', // Use original format if preferred
        email: 'sun@example.com',
        status: '審核中'
    }, { onConflict: 'national_id' }).select();
    if (e2) console.error("Error 孫小美:", e2);
    else console.log('Upserted 孫小美:', d2[0].name);

    // 3. Upsert User A123456789
    const { data: u1, error: e3 } = await supabase.from('users').upsert({
        national_id: 'A123456789',
        name: '示範用戶',
        phone: '0912345678'
    }, { onConflict: 'national_id' }).select();
    if (e3) console.error("Error User:", e3);
    else console.log('Upserted User:', u1[0].name);

    console.log("Setup Complete.");
}

run();
