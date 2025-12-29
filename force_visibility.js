
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, 'control-app/.env.local');
const env = fs.readFileSync(envPath, 'utf8');
const getVal = (key) => env.split('\n').find(l => l.startsWith(key))?.split('=')[1]?.trim().replace(/['"]/g, '');

const supabase = createClient(getVal('NEXT_PUBLIC_SUPABASE_URL'), getVal('NEXT_PUBLIC_SUPABASE_ANON_KEY'));

async function run() {
    console.log('Force updating orders for visibility...');

    // 1. Find the test order and user
    const { data: user } = await supabase.from('users').select('id').eq('national_id', 'A123456789').single();

    // 2. Update all 'pending' or 'unconfirmed' orders to 'confirmed' status
    // Why? Because 'confirmed' is a status both apps currently recognize and display.
    // 'pending' is being filtered out by the old code's strict filters.
    const { error } = await supabase.from('orders')
        .update({ status: 'confirmed' })
        .in('status', ['pending', 'unconfirmed'])
        .eq('user_id', user.id);

    if (error) {
        console.error('Error updating orders:', error);
    } else {
        console.log('Successfully updated orders to "confirmed" status for demo visibility.');
    }

    // 3. Log the current state of orders for this user
    const { data: orders } = await supabase.from('orders').select('*').eq('user_id', user.id);
    console.log('Current user orders:', JSON.stringify(orders.map(o => ({ id: o.id, note: o.note, status: o.status })), null, 2));
}
run();
