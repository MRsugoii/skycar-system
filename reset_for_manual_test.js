
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, 'control-app/.env.local');
const env = fs.readFileSync(envPath, 'utf8');
const getVal = (key) => env.split('\n').find(l => l.startsWith(key))?.split('=')[1]?.trim().replace(/['"]/g, '');

const supabase = createClient(getVal('NEXT_PUBLIC_SUPABASE_URL'), getVal('NEXT_PUBLIC_SUPABASE_ANON_KEY'));

async function run() {
    console.log('Resetting orders for manual testing...');

    // 1. Move CH202512252011 back to Unconfirmed (pending) and remove driver
    const { error: e1 } = await supabase.from('orders')
        .update({ status: 'pending', driver_id: null })
        .eq('note', '測試訂單 [ID: CH202512252011]');

    // 2. Fix CH9999 status to 'confirmed' so it shows in the tab
    const { error: e2 } = await supabase.from('orders')
        .update({ status: 'confirmed' })
        .eq('note', '[ID: CH9999]');

    if (e1 || e2) console.error('Error resetting:', e1, e2);
    else console.log('Successfully reset orders. CH202512252011 is now in "Unconfirmed".');
}
run();
