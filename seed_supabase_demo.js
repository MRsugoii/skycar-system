const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jmgdbeurlktyjbxexpxj.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedData() {
    console.log('Seeding demo data...');

    // 1. Ensure Demo Driver exists
    const driverData = {
        name: '王小明',
        idno: 'A123456789',
        phone: '0912-345-678',
        status: 'active',
        vehicle_type: 'Sedan',
    };

    const { data: driver, error: driverError } = await supabase
        .from('drivers')
        .select('id')
        .eq('name', driverData.name)
        .single();

    if (!driver && !driverError) {
        console.log("Driver not found (or error), attempting insert...");
    }

    // Upsert driver
    const { error: upsertError } = await supabase
        .from('drivers')
        .upsert(driverData, { onConflict: 'idno' });

    if (upsertError) console.error('Error upserting driver:', upsertError);
    else console.log('Driver synced.');

    // 2. Insert Demo Order
    // Order ID: CH20251208999
    const orderData = {
        user_id: 'DEMO_USER', // simplified
        pickup_address: '台北市信義區信義路五段7號 (台北101)',
        dropoff_address: '桃園國際機場 (TTE)',
        pickup_time: new Date('2025-12-25T14:00:00').toISOString(),
        passenger_count: 2,
        luggage_count: 2,
        vehicle_type: 'Sedan',
        status: 'confirmed',
        price: 1200,
        contact_name: '陳大文',
        contact_phone: '0900-000-000',
        driver_id: '王小明', // Must match driver name for the fetch query
        flight_number: 'BR123',
        note: 'Demo Order from Supabase'
    };

    const { error: orderError } = await supabase
        .from('orders')
        .insert(orderData);

    if (orderError) console.error('Error inserting order:', orderError);
    else console.log('Demo order created successfully.');

}

seedData();
