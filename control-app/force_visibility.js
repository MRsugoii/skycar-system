
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env.local');
const env = fs.readFileSync(envPath, 'utf8');
const getVal = (key) => env.split('\n').find(l => l.startsWith(key))?.split('=')[1]?.trim().replace(/['"]/g, '');

const supabase = createClient(getVal('NEXT_PUBLIC_SUPABASE_URL'), getVal('NEXT_PUBLIC_SUPABASE_ANON_KEY'));

async function run() {
    console.log('Force updating orders for visibility...');
    const { data: user } = await supabase.from('users').select('id').eq('national_id', 'A123456789').single();
    if (!user) { console.log('User not found'); return; }

    const { error } = await supabase.from('orders')
        .update({ status: 'confirmed' })
        .in('status', ['pending', 'unconfirmed'])
        .eq('user_id', user.id);

    if (error) console.error('Error updating orders:', error);
    else console.log('Successfully updated orders to "confirmed" status.');

    const { data: orders } = await supabase.from('orders').select('*').eq('user_id', user.id);
    console.log('Current status of orders:', orders.map(o => ({ id: o.id, note: o.note, status: o.status })));
}
run();
