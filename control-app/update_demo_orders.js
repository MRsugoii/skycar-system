
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env.local');
const env = fs.readFileSync(envPath, 'utf8');
const getVal = (key) => env.split('\n').find(l => l.startsWith(key))?.split('=')[1]?.trim().replace(/['"]/g, '');

const supabase = createClient(getVal('NEXT_PUBLIC_SUPABASE_URL'), getVal('NEXT_PUBLIC_SUPABASE_ANON_KEY'));

async function run() {
    console.log('Cleaning up and generating correct demo orders with accurate car types...');

    const { data: user } = await supabase.from('users').select('id').eq('national_id', 'A123456789').single();
    if (!user) return console.error('User not found');

    // Delete existing test orders
    await supabase.from('orders').delete().ilike('note', '%測試%');

    const now = new Date();
    const datePrefix = '20251226';
    const carTypes = ['經濟四人座', '豪華轎車', '電動專車', '商務七人座'];

    const demoOrders = [
        { status: 'pending', price: 1000, note: `測試: 未確認 [ID: CH${datePrefix}001]`, v: carTypes[0] },
        { status: 'confirmed', price: 1200, note: `測試: 已確認 [ID: CH${datePrefix}002]`, v: carTypes[1] },
        { status: 'assigned', price: 1500, note: `測試: 已指派 [ID: CH${datePrefix}003]`, v: carTypes[2] },
        { status: 'pickedup', price: 1800, note: `測試: 進行中 [ID: CH${datePrefix}004]`, v: carTypes[3] },
        { status: 'completed', price: 2000, note: `測試: 已完成 [ID: CH${datePrefix}005]`, v: carTypes[1] },
        { status: 'refund', price: 500, note: `測試: 退費審核 [ID: CH${datePrefix}006]`, v: carTypes[0] },
        { status: 'completed', price: 900, note: `測試: 已退費 [ID: CH${datePrefix}007-RF]`, v: carTypes[1] },
        { status: 'completed', price: 300, note: `測試: 不予退費 [ID: CH${datePrefix}008-NA]`, v: carTypes[2] },
        { status: 'cancelled', price: 0, note: `測試: 已取消 [ID: CH${datePrefix}009-OC]`, v: carTypes[3] },
        { status: 'trash', price: 888, note: `測試: 垃圾桶訂單 [ID: CH${datePrefix}010]`, v: carTypes[0] }
    ];

    for (const order of demoOrders) {
        await supabase.from('orders').insert({
            user_id: user.id,
            contact_name: '示範用戶',
            contact_phone: '0912345678',
            pickup_address: '台北 101',
            dropoff_address: '桃園機場',
            pickup_time: now.toISOString(),
            status: order.status,
            price: order.price,
            note: order.note,
            vehicle_type: order.v
        });
    }

    console.log('Successfully generated 10 demo orders with correct car types and status mapping.');
}
run();
