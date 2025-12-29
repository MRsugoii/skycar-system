
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env.local');
const env = fs.readFileSync(envPath, 'utf8');
const getVal = (key) => env.split('\n').find(l => l.startsWith(key))?.split('=')[1]?.trim().replace(/['"]/g, '');

const supabase = createClient(getVal('NEXT_PUBLIC_SUPABASE_URL'), getVal('NEXT_PUBLIC_SUPABASE_ANON_KEY'));

async function run() {
    console.log('🚀 Preparing FINAL Demo Environment (including Test 1 & 2)...');

    // 1. Get User and Driver IDs
    const { data: user } = await supabase.from('users').select('id').eq('national_id', 'A123456789').single();
    const { data: wang } = await supabase.from('drivers').select('id').eq('name', '王小明').single();
    const { data: sun } = await supabase.from('drivers').select('id').eq('name', '孫小美').single();

    if (!user || !wang || !sun) {
        console.error('❌ User or Drivers not found.');
        return;
    }

    // 2. Set Sun Xiao-mei to "審核中" for Test 1 (Driver Verification Demo)
    console.log('📝 Setting Sun Xiao-mei to "審核中" for Test 1...');
    await supabase.from('drivers').update({ status: '審核中' }).eq('id', sun.id);

    // 3. Clear and Reset Orders
    console.log('🧹 Clearing old orders...');
    await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    const now = new Date();
    const dateStr = now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');

    // 4. Create Curated Demo Orders
    const demoOrders = [
        {
            status: 'pending',
            note: `[ID: CH202512252011]`, // Restoring the one user was testing
            price: 1500,
            v: '豪華轎車',
            addr: ['台北 101', '桃園機場'],
            driver: null
        },
        {
            status: 'confirmed',
            note: `[ID: CH9999]`, // Restoring Sun's order
            price: 1200,
            v: '經濟四人座',
            addr: ['台北車站', '松山機場'],
            driver: sun.id
        },
        {
            status: 'confirmed',
            note: `[ID: CH${dateStr}002]`,
            price: 1300,
            v: '豪華轎車',
            addr: ['台北車站', '桃園機場'],
            driver: wang.id
        },
        {
            status: 'completed',
            note: `[ID: CH${dateStr}003]`,
            price: 2500,
            v: '商務七人座',
            addr: ['北投溫泉', '桃園機場'],
            driver: wang.id
        },
        {
            status: 'refund',
            note: `[ID: CH${dateStr}004]`,
            price: 800,
            v: '電動專車',
            addr: ['信義區', '西門町'],
            driver: null
        },
        {
            status: 'cancelled',
            note: `[ID: CH${dateStr}005-OC]`,
            price: 0,
            v: '豪華轎車',
            addr: ['故宮博物院', '台北車站'],
            driver: null
        }
    ];

    console.log('📦 Inserting curated demo orders...');
    for (const o of demoOrders) {
        await supabase.from('orders').insert({
            user_id: user.id,
            driver_id: o.driver,
            contact_name: '演示會員',
            contact_phone: '0912345678',
            pickup_address: o.addr[0],
            dropoff_address: o.addr[1],
            pickup_time: new Date(now.getTime() + 3600000).toISOString(),
            status: o.status,
            price: o.price,
            note: o.note,
            vehicle_type: o.v
        });
    }

    console.log('✨ Demo environment is ready!');
    console.log('✅ TEST 1: Sun Xiao-mei status is "審核中". User can "Approve" her in Control App.');
    console.log('✅ TEST 2: User A123456789 can see CH202512252011 (Pending).');
    console.log('✅ TEST 2: Driver Wang can see CH${dateStr}002 (Assigned).');
    console.log('✅ TEST 2: Driver Sun can see CH9999 (Assigned).');
}

run();
