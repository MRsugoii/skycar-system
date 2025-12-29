
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, 'control-app/.env.local');
const env = fs.readFileSync(envPath, 'utf8');
const getVal = (key) => env.split('\n').find(l => l.startsWith(key))?.split('=')[1]?.trim().replace(/['"]/g, '');

const supabase = createClient(getVal('NEXT_PUBLIC_SUPABASE_URL'), getVal('NEXT_PUBLIC_SUPABASE_ANON_KEY'));

async function run() {
    const { data: driver } = await supabase.from('drivers').select('id, name').eq('national_id', 'C123456789').single();
    if (!driver) {
        console.log('Driver Sun Xiao-mei not found');
        return;
    }
    console.log('Driver found:', driver.name, driver.id);
    const { data: orders, error } = await supabase.from('orders').select('*').eq('driver_id', driver.id);
    if (error) {
        console.error('Error fetching orders:', error);
        return;
    }
    console.log('Orders found:', orders.length);
    orders.forEach(o => {
        console.log(`Order ID: ${o.id}`);
        console.log(`Note: ${o.note}`);
    });
}
run();
