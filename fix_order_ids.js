
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, 'control-app/.env.local');
const env = fs.readFileSync(envPath, 'utf8');
const getVal = (key) => env.split('\n').find(l => l.startsWith(key))?.split('=')[1]?.trim().replace(/['"]/g, '');

const supabase = createClient(getVal('NEXT_PUBLIC_SUPABASE_URL'), getVal('NEXT_PUBLIC_SUPABASE_ANON_KEY'));

async function run() {
    console.log('Starting data fix...');
    const { data: drivers } = await supabase.from('drivers').select('id, national_id');

    // Fix Sun Xiao-mei (C123456789)
    const sun = drivers.find(d => d.national_id === 'C123456789');
    if (sun) {
        const { data: orders } = await supabase.from('orders').select('*').eq('driver_id', sun.id);
        for (const o of orders) {
            if (!o.note || !o.note.includes('[ID:')) {
                const orderId = 'CH20251226001';
                const newNote = (o.note ? o.note + ' ' : '') + `[ID: ${orderId}]`;
                await supabase.from('orders').update({ note: newNote }).eq('id', o.id);
                console.log(`Updated Order ${o.id} with ID ${orderId}`);
            }
        }
    }

    // Also fix Wang Xiao-ming (A123456789)
    const wang = drivers.find(d => d.national_id === 'A123456789');
    if (wang) {
        const { data: orders } = await supabase.from('orders').select('*').eq('driver_id', wang.id);
        for (const o of orders) {
            if (!o.note || !o.note.includes('[ID:')) {
                const orderId = 'CH20251225888';
                const newNote = (o.note ? o.note + ' ' : '') + `[ID: ${orderId}]`;
                await supabase.from('orders').update({ note: newNote }).eq('id', o.id);
                console.log(`Updated Order ${o.id} with ID ${orderId}`);
            }
        }
    }
    console.log('Data fix complete.');
}
run();
