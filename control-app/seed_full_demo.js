const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Helper to get Env
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
    console.log("🚀 Starting Full Demo Seed (Corrected Status & ID logic)...");

    // 1. VEHICLE TYPES 
    console.log("Step 1: Vehicle Types...");
    const vehicleTypes = [
        { name: "經濟四人座", model: "Toyota Camry", quantity: 10, seats: 4, dispatch_price: 1000, status: true },
        { name: "豪華轎車", model: "Lexus ES", quantity: 5, seats: 4, dispatch_price: 1500, status: true },
        { name: "電動專車", model: "Tesla Model 3", quantity: 8, seats: 4, dispatch_price: 1400, status: true },
        { name: "商務七人座", model: "Mercedes-Benz V-Class", quantity: 4, seats: 7, dispatch_price: 2000, status: true }
    ];

    for (const v of vehicleTypes) {
        const { data: existing } = await supabase.from('vehicle_types').select('id').eq('name', v.name).single();
        if (!existing) await supabase.from('vehicle_types').insert(v);
    }

    // 2. DRIVERS
    console.log("Step 2: Drivers...");
    const driversList = [
        { name: "王小明", phone: "0912-345-678", status: "active" },
        { name: "李大華", phone: "0922-333-444", status: "active" },
        { name: "陳志豪", phone: "0933-555-666", status: "active" },
        { name: "林美玲", phone: "0944-777-888", status: "active" }
    ];
    const driverIds = [];
    for (const d of driversList) {
        let { data: driver } = await supabase.from('drivers').select('id').eq('name', d.name).single();
        if (!driver) {
            const { data: newDriver } = await supabase.from('drivers').insert(d).select().single();
            driver = newDriver;
        }
        if (driver) driverIds.push(driver.id);
    }

    // 3. USERS
    console.log("Step 3: Users...");
    const usersList = [
        { name: "Demo User", email: "demo@example.com", phone: "0900-000-000" },
        { name: "Alice Wu", email: "alice@example.com", phone: "0911-111-111" }
    ];
    const userIds = [];
    for (const u of usersList) {
        let { data: user } = await supabase.from('users').select('id').eq('email', u.email).single();
        if (!user) {
            const { data: newUser } = await supabase.from('users').insert(u).select().single();
            user = newUser;
        }
        if (user) userIds.push(user.id);
    }

    // 4. ORDERS
    console.log("Step 4: Orders...");

    function generateOrderId(index) {
        const today = new Date();
        const y = today.getFullYear();
        const m = String(today.getMonth() + 1).padStart(2, '0');
        const d = String(today.getDate()).padStart(2, '0');
        const seq = String(1001 + index).padStart(4, '0');
        return `CH${y}${m}${d}${seq}`;
    }

    const locations = [
        ["桃園國際機場 (TTE)", "台北君悅酒店"],
        ["台北車站", "新竹科學園區"],
        ["台中高鐵站", "日月潭雲品酒店"],
        ["松山機場", "宜蘭礁溪寒沐酒店"]
    ];

    const ordersToInsert = [];
    const mainUser = userIds[0];
    const mainDriver = driverIds[0];

    // Delete existing orders to clean up "ing" mess if possible
    // (Only those we created essentially, but keeping it simple: just insert new ones)

    for (let i = 0; i < 8; i++) {
        const isMainDemo = i < 4;
        const driverId = isMainDemo ? mainDriver : driverIds[Math.floor(Math.random() * driverIds.length)];
        const userId = isMainDemo ? mainUser : userIds[Math.floor(Math.random() * userIds.length)];
        const loc = locations[i % locations.length];
        const hoursOffset = i * 6;
        const pickupTime = new Date(Date.now() + 3600 * 1000 * hoursOffset).toISOString();

        // Correct Status Logic for Demo
        // i=0: Active (en_route) -> display "進行中"
        // i=1..3: Confirmed -> display "已確認"
        // i>3: Completed -> display "已完成"
        let status = 'confirmed';
        if (i === 0) status = 'en_route'; // Was 'ing', now 'en_route'
        if (i >= 4) status = 'completed';

        const customId = generateOrderId(i);

        ordersToInsert.push({
            user_id: userId,
            driver_id: driverId,
            contact_name: "貴賓客戶",
            contact_phone: "0900-123-456",
            pickup_address: loc[0],
            dropoff_address: loc[1],
            pickup_time: pickupTime,
            price: 1000 + (i * 200),
            passenger_count: 2,
            luggage_count: 2,
            vehicle_type: vehicleTypes[i % vehicleTypes.length].model,
            status: status,
            // Store Custom ID in Note so UI can parse it!
            note: `[ID: ${customId}] Demo Order ${i + 1}`
        });
    }

    const { error } = await supabase.from('orders').insert(ordersToInsert);

    if (error) {
        console.error("❌ Error inserting orders:", error);
    } else {
        console.log("✅ Orders inserted successfully (IDs in notes).");
    }

    console.log("🎉 Seed Complete!");
}

seed();
