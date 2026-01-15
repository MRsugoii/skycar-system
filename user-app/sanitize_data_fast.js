const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const DRIVER_ID = '85482549-363e-4bcd-af77-64e123d35ce7';
const USER_ID = '1fa33e6e-15cc-4091-94f2-468925886257';
const USER_PHONE = '0912345678';
const USER_NAME = '示範用戶';

async function main() {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const url = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=['"]?([^'"\n]+)['"]?/)[1].trim();
    const key = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=['"]?([^'"\n]+)['"]?/)[1].trim();
    const supabase = createClient(url, key);

    console.log('Fetching orders...');
    const { data: allOrders } = await supabase.from('orders').select('*');

    // Sort Newest First
    allOrders.sort((a, b) => b.created_at.localeCompare(a.created_at));

    const completed = allOrders.filter(o => o.status === 'completed' || o.status === 'unpaid');
    const cancelled = allOrders.filter(o => o.status === 'cancelled');

    // Select Target 4 Completed
    let targetCompleted = completed.filter(o => o.id.includes('349'));
    const otherCompleted = completed.filter(o => !o.id.includes('349'));
    const needed = 4 - targetCompleted.length;
    targetCompleted = targetCompleted.concat(otherCompleted.slice(0, needed));

    // Select Target 2 Cancelled
    const targetCancelled = cancelled.slice(0, 2);

    const keepIds = new Set([
        ...targetCompleted.map(o => o.id),
        ...targetCancelled.map(o => o.id)
    ]);

    const deleteIds = allOrders.filter(o => !keepIds.has(o.id)).map(o => o.id);

    console.log(`Plan: Keep ${keepIds.size}, Delete ${deleteIds.length}`);

    // Batch Delete
    if (deleteIds.length > 0) {
        console.log('Batch deleting...');
        const { error } = await supabase.from('orders').delete().in('id', deleteIds);
        if (error) console.error('Delete failed:', error);
        else console.log('Delete successful.');
    }

    // Parallel Update
    const updates = Array.from(keepIds).map(async (id) => {
        const o = allOrders.find(x => x.id === id);
        let newNote = o.note || '';
        const isCancelled = targetCancelled.find(c => c.id === id);

        if (isCancelled) {
            if (!newNote.toUpperCase().includes('-OC')) {
                newNote = newNote.includes('[ID:')
                    ? newNote.replace(/\[ID:\s?(CH[A-Z0-9-]+)\]/, (match, p1) => `[ID: ${p1}-OC]`)
                    : `${newNote} [ID: ${o.id}-OC]`;
            }
        } else {
            // Clean completed
            newNote = newNote.replace(/-RF|-NA|-OC/g, '').trim();
        }

        return supabase.from('orders').update({
            driver_id: DRIVER_ID,
            user_id: USER_ID,
            contact_name: USER_NAME,
            contact_phone: USER_PHONE,
            note: newNote,
            status: isCancelled ? 'cancelled' : 'completed'
        }).eq('id', id);
    });

    console.log('Updating records...');
    await Promise.all(updates);
    console.log('Sanitization Complete.');
}

main().catch(console.error);
