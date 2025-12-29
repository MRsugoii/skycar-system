
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env.local');
const env = fs.readFileSync(envPath, 'utf8');
const getVal = (key) => env.split('\n').find(l => l.startsWith(key))?.split('=')[1]?.trim().replace(/['"]/g, '');

const supabase = createClient(getVal('NEXT_PUBLIC_SUPABASE_URL'), getVal('NEXT_PUBLIC_SUPABASE_ANON_KEY'));

async function run() {
    console.log('Generating demo orders for all tabs...');

    const { data: user } = await supabase.from('users').select('id').eq('national_id', 'A123456789').single();
    if (!user) {
        console.error('User A123456789 not found');
        return;
    }

    const demoOrders = [
        {
            user_id: user.id,
            contact_name: '示範用戶',
            contact_phone: '0912345678',
            pickup_address: '台北 101',
            dropoff_address: '桃園機場',
            pickup_time: new Date().toISOString(),
            status: 'pending',
            price: 1500,
            note: '測試: 未確認訂單 [ID: CH-TAB-PEND]'
        },
        {
            user_id: user.id,
            contact_name: '示範用戶',
            contact_phone: '0912345678',
            pickup_address: '台北車站',
            dropoff_address: '松山機場',
            pickup_time: new Date().toISOString(),
            status: 'confirmed',
            price: 1200,
            note: '測試: 已確認訂單 [ID: CH-TAB-CONF]'
        },
        {
            user_id: user.id,
            contact_name: '示範用戶',
            contact_phone: '0912345678',
            pickup_address: '故宮博物院',
            dropoff_address: '桃園機場',
            pickup_time: new Date().toISOString(),
            status: 'completed',
            price: 1800,
            note: '測試: 已完成訂單 [ID: CH-TAB-DONE]'
        },
        {
            user_id: user.id,
            contact_name: '示範用戶',
            contact_phone: '0912345678',
            pickup_address: '信義區',
            dropoff_address: '松山機場',
            pickup_time: new Date().toISOString(),
            status: 'refund',
            price: 500,
            note: '測試: 退費審核訂單 [ID: CH-TAB-REFU]'
        },
        {
            user_id: user.id,
            contact_name: '示範用戶',
            contact_phone: '0912345678',
            pickup_address: '北投溫泉',
            dropoff_address: '台北車站',
            pickup_time: new Date().toISOString(),
            status: 'trash',
            price: 800,
            note: '測試: 垃圾桶訂單 [ID: CH-TAB-TRAS]'
        }
    ];

    for (const order of demoOrders) {
        const { error } = await supabase.from('orders').insert(order);
        if (error) console.error(`Error inserting ${order.status}:`, error.message);
        else console.log(`Successfully added demo order for tab: ${order.status}`);
    }

    console.log('All demo orders generated.');
}
run();
