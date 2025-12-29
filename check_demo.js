
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

const envPath = path.resolve(__dirname, 'control-app/.env.local');
let envConfig = {};
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, val] = line.split('=');
        if (key && val) envConfig[key.trim()] = val.trim();
    });
} catch (e) { console.log(e); }

if (!envConfig.NEXT_PUBLIC_SUPABASE_URL) {
    // If failed to read from control-app, try current dir just in case
    const envPath2 = path.resolve(__dirname, '.env.local');
    try {
        const envContent = fs.readFileSync(envPath2, 'utf8');
        envContent.split('\n').forEach(line => {
            const [key, val] = line.split('=');
            if (key && val) envConfig[key.trim()] = val.trim();
        });
    } catch (e) { }
}

const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkDemoData() {
    console.log("Checking Demo Data...");

    // 1. Check Driver "王小明"
    const { data: driver, error: de } = await supabase
        .from('drivers')
        .select('*')
        .eq('name', '王小明')
        .single();

    if (driver) {
        console.log("✅ Driver '王小明' found:", driver.id);
    } else {
        console.log("❌ Driver '王小明' NOT found. Creating...");
        await supabase.from('drivers').insert({
            name: "王小明",
            phone: "0912-345-678",
            status: "active",
            rating: 4.8,
            total_trips: 15
        });
        console.log("Created Driver '王小明'");
    }

    // 2. Check User "示範用戶" (Phone: 0912345678) matching User App Demo
    // User App demo uses account A123456789 / phone 0912345678
    const { data: user, error: ue } = await supabase
        .from('users')
        .select('*')
        .eq('phone', '0912345678')
        .single();

    if (user) {
        console.log("✅ User '示範用戶' found:", user.id);
    } else {
        console.log("❌ User '示範用戶' NOT found. Creating...");
        await supabase.from('users').insert({
            name: "示範用戶",
            phone: '0912345678',
            email: 'demo@mail.com', // Matching User App demo
            role: 'user'
        });
        console.log("Created User '示範用戶'");
    }
}

checkDemoData();
