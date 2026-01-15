const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const DRIVER_ID = '85482549-363e-4bcd-af77-64e123d35ce7';
const USER_ID = '1fa33e6e-15cc-4091-94f2-468925886257';
const USER_PHONE = '0912345678';
const USER_NAME = '示範用戶';

async function main() {
    console.log('Validating environment...');
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=['"]?([^'"\n]+)['"]?/);
    const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=['"]?([^'"\n]+)['"]?/);

    if (!urlMatch || !keyMatch) {
        console.error('Missing Supabase env vars');
        process.exit(1);
    }

    const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

    console.log('Fetching all orders...');
    const { data: allOrders, error } = await supabase.from('orders').select('*');
    if (error) {
        console.error('Fetch error:', error);
        return;
    }
    console.log(`Fetched ${allOrders.length} orders.`);

    // Sort descending by creation date
    allOrders.sort((a, b) => b.created_at.localeCompare(a.created_at));

    // Identify target orders
    const completed = allOrders.filter(o => o.status === 'completed' || o.status === 'unpaid');
    const cancelled = allOrders.filter(o => o.status === 'cancelled');

    // Logic: Keep 349 + 3 other completed
    let targetCompleted = completed.filter(o => o.id.includes('349'));
    const otherCompleted = completed.filter(o => !o.id.includes('349'));
    // If we have 349, take 3 others. If not, take 4 others.
    const needed = 4 - targetCompleted.length;
    targetCompleted = targetCompleted.concat(otherCompleted.slice(0, needed));

    // Logic: Keep latest 2 cancelled
    const targetCancelled = cancelled.slice(0, 2);

    const keepIds = new Set([
        ...targetCompleted.map(o => o.id),
        ...targetCancelled.map(o => o.id)
    ]);

    console.log(`Plan: Keep ${keepIds.size} orders (${targetCompleted.length} Completed, ${targetCancelled.length} Cancelled).`);

    // Execute Updates
    for (const o of allOrders) {
        if (keepIds.has(o.id)) {
            console.log(`Updating ${o.id}...`);
            let newNote = o.note || '';
            const isCancelled = targetCancelled.find(c => c.id === o.id);

            if (isCancelled) {
                if (!newNote.toUpperCase().includes('-OC')) {
                    newNote = newNote.includes('[ID:')
                        ? newNote.replace(/\[ID:\s?(CH[A-Z0-9-]+)\]/, (match, p1) => `[ID: ${p1}-OC]`)
                        : `${newNote} [ID: ${o.id}-OC]`;
                }
            } else {
                // Remove administrative suffixes for completed orders so they are clean
                newNote = newNote.replace(/-RF/g, '').replace(/-NA/g, '').replace(/-OC/g, '');
                // Clean up double spaces if any
                newNote = newNote.trim();
            }

            const { error: updErr } = await supabase.from('orders').update({
                driver_id: DRIVER_ID,
                user_id: USER_ID,
                contact_name: USER_NAME,
                contact_phone: USER_PHONE,
                note: newNote,
                status: isCancelled ? 'cancelled' : 'completed'
            }).eq('id', o.id);

            if (updErr) console.error(`Error updating ${o.id}:`, updErr);
        } else {
            console.log(`Deleting ${o.id}...`);
            const { error: delErr } = await supabase.from('orders').delete().eq('id', o.id);
            if (delErr) console.error(`Error deleting ${o.id}:`, delErr);
        }
    }

    console.log('Sanitization Complete.');
}

main().catch(console.error);
