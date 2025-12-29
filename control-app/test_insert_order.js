
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env.local');
const env = fs.readFileSync(envPath, 'utf8');
const getVal = (key) => env.split('\n').find(l => l.startsWith(key))?.split('=')[1]?.trim().replace(/['"]/g, '');

const supabase = createClient(getVal('NEXT_PUBLIC_SUPABASE_URL'), getVal('NEXT_PUBLIC_SUPABASE_ANON_KEY'));

async function run() {
    console.log('Fetching user A123456789...');
    const { data: user, error: uError } = await supabase.from('users').select('id').eq('national_id', 'A123456789').single();
    if (uError || !user) {
        console.error('User not found', uError);
        return;
    }

    const orderId = 'CH' + new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 12);
    console.log('Inserting test order:', orderId);

    const { error } = await supabase.from('orders').insert({
        user_id: user.id,
        contact_name: '示範用戶',
        contact_phone: '0912345678',
        pickup_address: '台北 101',
        dropoff_address: '桃園機場',
        pickup_time: new Date().toISOString(),
        passenger_count: 1,
        luggage_count: 1,
        vehicle_type: '尊榮轎車',
        price: 1500,
        status: 'pending',
        note: `測試訂單 [ID: ${orderId}]`
    });

    if (error) {
        console.error('Insert Error:', error.message);
    } else {
        console.log('Successfully inserted test order:', orderId);
    }
}
run();
