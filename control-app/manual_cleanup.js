
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env.local');
let envContent = fs.readFileSync(envPath, 'utf8');

const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch[1].trim().replace(/['"]/g, '');
const supabaseKey = keyMatch[1].trim().replace(/['"]/g, '');
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanup() {
    console.log("Connecting to Supabase...");

    // 1. Fetch Drivers
    const { data: drivers } = await supabase.from('drivers').select('id, national_id');
    const keepDriverIds = drivers.filter(d => ['A123456789', 'C123456789'].includes(d.national_id)).map(d => d.id);
    const deleteDriverIds = drivers.filter(d => !['A123456789', 'C123456789'].includes(d.national_id)).map(d => d.id);

    // 2. Fetch Users
    const { data: users } = await supabase.from('users').select('id, national_id');
    const keepUserIds = users.filter(u => u.national_id === 'A123456789').map(u => u.id);
    const deleteUserIds = users.filter(u => u.national_id !== 'A123456789').map(u => u.id);

    // 3. Fetch Orders
    const { data: orders } = await supabase.from('orders').select('id, driver_id, user_id');
    const ordersToDelete = orders.filter(o =>
        !keepDriverIds.includes(o.driver_id) && !keepUserIds.includes(o.user_id)
    ).map(o => o.id);

    // Deletion order matters to avoid foreign key issues (though not usually strict in Supabase depending on config)
    console.log(`Starting deletions: ${ordersToDelete.length} orders, ${deleteUserIds.length} users, ${deleteDriverIds.length} drivers`);

    if (ordersToDelete.length > 0) {
        await supabase.from('orders').delete().in('id', ordersToDelete);
    }
    if (deleteUserIds.length > 0) {
        await supabase.from('users').delete().in('id', deleteUserIds);
    }
    if (deleteDriverIds.length > 0) {
        await supabase.from('drivers').delete().in('id', deleteDriverIds);
    }

    console.log("Cleanup Success.");
}

cleanup();
