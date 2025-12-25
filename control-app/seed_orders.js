const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function getEnv(key) {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const file = fs.readFileSync(envPath, 'utf8');
            const lines = file.split('\n');
            for (const line of lines) {
                if (line.startsWith(key + '=')) {
                    let val = line.split('=')[1].trim();
                    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                        val = val.slice(1, -1);
                    }
                    return val;
                }
            }
        }
    } catch (e) { }
    return process.env[key];
}

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Error: Could not find Supabase env vars in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
    console.log("Starting seed of 5 demo orders...");

    // 1. Get or Create Driver "王小明"
    const driverData = {
        name: "王小明",
        phone: "0912-345-678",
        status: "active"
    };

    let { data: driver, error: findDriverError } = await supabase
        .from('drivers')
        .select('id, name')
        .eq('name', '王小明')
        .single();

    if (!driver) {
        console.log("Driver not found, creating...");
        const { data: newDriver, error: createError } = await supabase
            .from('drivers')
            .insert(driverData)
            .select()
            .single();

        if (createError) {
            console.error("Error creating driver:", createError);
            return;
        }
        driver = newDriver;
    }

    if (!driver || !driver.id) {
        console.error("Could not get accessible driver ID.");
        return;
    }

    console.log(`Using Driver: ${driver.name} (UUID: ${driver.id})`);


    // 2. Get or Create User "Demo User"
    // Check columns for users table. Usually: name, phone, email?
    // I'll try minimal fields.
    const userData = {
        name: "Demo User",
        phone: "0900-000-000",
        email: "demo@example.com"
    };

    let { data: user, error: findUserError } = await supabase
        .from('users')
        .select('id, name')
        .eq('email', 'demo@example.com')
        .single();

    if (!user) {
        console.log("User not found, creating...");
        const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert(userData)
            .select()
            .single();

        if (createError) {
            console.error("Error creating user:", createError);
            // If error is about missing columns, we might need adjustments
            return;
        }
        user = newUser;
    }

    if (!user || !user.id) {
        console.error("Could not get accessible user ID.");
        return;
    }
    console.log(`Using User: ${user.name} (UUID: ${user.id})`);


    // 3. 5 Demo Orders
    const orders = [
        {
            user_id: user.id,
            contact_name: "張先生",
            contact_phone: "0912-111-222",
            pickup_address: "桃園國際機場 (TTE) - 第二航廈",
            dropoff_address: "台北市信義區君悅酒店",
            pickup_time: new Date(Date.now() + 3600 * 1000 * 2).toISOString(),
            passenger_count: 2,
            luggage_count: 2,
            vehicle_type: "Tesla Model 3",
            price: 1500,
            status: "confirmed",
            driver_id: driver.id,
            note: "客人有大件行李"
        },
        {
            user_id: user.id,
            contact_name: "林小姐",
            contact_phone: "0922-333-444",
            pickup_address: "台北车站东三门",
            dropoff_address: "新北市板橋區凱撒大飯店",
            pickup_time: new Date(Date.now() + 3600 * 1000 * 5).toISOString(),
            passenger_count: 1,
            luggage_count: 1,
            vehicle_type: "Toyota Camry",
            price: 800,
            status: "confirmed",
            driver_id: driver.id,
            note: "請準時"
        },
        {
            user_id: user.id,
            contact_name: "陳經理",
            contact_phone: "0933-555-666",
            pickup_address: "台北市內湖科學園區",
            dropoff_address: "新竹科學園區台積電",
            pickup_time: new Date(Date.now() + 86400 * 1000 * 1).toISOString(),
            passenger_count: 3,
            luggage_count: 0,
            vehicle_type: "Benz S-Class",
            price: 3500,
            status: "confirmed",
            driver_id: driver.id
        },
        {
            user_id: user.id,
            contact_name: "王太太",
            contact_phone: "0944-777-888",
            pickup_address: "台北市大安森林公園",
            dropoff_address: "宜蘭礁溪老爺酒店",
            pickup_time: new Date(Date.now() + 86400 * 1000 * 2).toISOString(),
            passenger_count: 5,
            luggage_count: 4,
            vehicle_type: "Toyota Sienna",
            price: 2800,
            status: "confirmed",
            driver_id: driver.id,
            note: "有兒童座椅需求"
        },
        {
            user_id: user.id,
            contact_name: "李先生",
            contact_phone: "0955-999-000",
            pickup_address: "台北市中山區林森北路",
            dropoff_address: "新北市三重區",
            pickup_time: new Date(Date.now() + 3600 * 1000 * 24 * 3).toISOString(),
            passenger_count: 1,
            luggage_count: 0,
            vehicle_type: "Toyota Camry",
            price: 600,
            status: "confirmed",
            driver_id: driver.id
        }
    ];

    const { data, error } = await supabase.from('orders').insert(orders).select();

    if (error) {
        console.error("Error inserting orders:", error);
    } else {
        console.log(`Successfully added ${data.length} orders for driver ${driver.name}.`);
    }
}

seed();
