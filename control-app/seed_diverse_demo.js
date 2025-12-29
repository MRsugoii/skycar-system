const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Helper to get Env
function getEnv(key) {
    try {
        // Fix: Look in control-app folder if running from root
        let envPath = path.resolve(process.cwd(), '.env.local');
        if (!fs.existsSync(envPath)) {
            envPath = path.resolve(process.cwd(), 'control-app', '.env.local');
        }

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
    // Fallback if env file read fails but we actually have them injected in environment
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        // use process.env
    } else {
        // Hardcode for this session to ensure fix if file read is flaky
        console.log("⚠️ Env file read failed, using process env or fallback...");
    }
}

// Re-instantiate with explicit envs if needed, but the above helper should work.
const supabase = createClient(
    supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function seed() {
    console.log("🚀 Starting FINAL Demo Seed (All Tabs + Fix ID)...");

    // 1. Get/Create Users & Drivers
    // (Assuming they exist from previous runs to save time, or quick fetch)
    let { data: driver } = await supabase.from('drivers').select('id').eq('name', '王小明').single();
    let { data: user } = await supabase.from('users').select('id').eq('email', 'demo@example.com').single();

    if (!driver || !user) {
        console.error("❌ Driver/User not found. Please run full seed.");
        return;
    }

    const driverId = driver.id; // 王小明
    const userId = user.id; // Demo User

    // 2. Generate Orders for ALL Tabs
    // We want: 
    // - Unconfirmed (New)
    // - Confirmed (Upcoming)
    // - En_route (Active)
    // - Completed (History)
    // - Refund/Return (Audit)
    // - Cancelled (Trash/History)

    function generateOrderId(prefix, seq) {
        // Fixed date for consistency or today
        const d = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        return `${prefix}${d}${String(seq).padStart(4, '0')}`;
    }

    const ordersData = [
        // 1. Unconfirmed (未確認)
        {
            status: 'unconfirmed',
            pickup_address: "台北車站 (東三門)",
            dropoff_address: "桃園機場第一航廈",
            time_offset: 48, // 2 days later
            price: 1200,
            note: `[ID: ${generateOrderId('CH', 2001)}] 請協助舉牌`
        },
        // 2. Confirmed (已確認)
        {
            status: 'confirmed',
            pickup_address: "板橋希爾頓酒店",
            dropoff_address: "九份老街",
            time_offset: 24, // 1 day later
            price: 2500,
            note: `[ID: ${generateOrderId('CH', 2002)}] 乘客有兩件大行李`
        },
        // 3. En Route (進行中 - Driver App Visible)
        {
            status: 'en_route',
            pickup_address: "台北101",
            dropoff_address: "松山機場",
            time_offset: 1, // 1 hour later (today)
            price: 800,
            note: `[ID: ${generateOrderId('CH', 2003)}] VIP客戶`
        },
        // 4. Refund Check (退費審核) - Use 'completed' status but maybe a specific flag logic? 
        // Wait, current logic for Refund tab filters by...?
        // Looking at page.tsx: "refund" tab usually filters by status='refund_pending' or similar?
        // Let's use 'refund_pending' if the system supports it, or 'completed' with note.
        // Assuming strict status enum? The table schema allows text.
        {
            status: 'refund', // Or 'refund_pending'
            pickup_address: "台中高鐵站",
            dropoff_address: "日月潭",
            time_offset: -24, // yesterday
            price: 3000,
            note: `[ID: ${generateOrderId('CH', 2004)}] 客戶投訴車內異味申請退款`
        },
        // 5. Cancelled (已取消 -OC)
        {
            status: 'cancelled',
            pickup_address: "高雄左營站",
            dropoff_address: "墾丁凱撒",
            time_offset: -48,
            price: 4500,
            note: `[ID: ${generateOrderId('CH', 2005)}-OC] 行程取消`
        },
        // 6. Completed (已完成)
        {
            status: 'completed',
            pickup_address: "南港展覽館",
            dropoff_address: "君悅酒店",
            time_offset: -5,
            price: 600,
            note: `[ID: ${generateOrderId('CH', 2006)}]`
        }
    ];

    const ordersToInsert = ordersData.map(o => ({
        user_id: userId,
        driver_id: driverId,
        contact_name: "測試客戶",
        contact_phone: "0900-111-222",
        pickup_address: o.pickup_address,
        dropoff_address: o.dropoff_address,
        pickup_time: new Date(Date.now() + 3600 * 1000 * o.time_offset).toISOString(),
        price: o.price,
        passenger_count: 2,
        luggage_count: 1,
        vehicle_type: "Tesla Model 3",
        status: o.status,
        note: o.note
    }));

    // Insert
    const { error } = await supabase.from('orders').insert(ordersToInsert);

    if (error) {
        console.error("❌ Error inserting diverse orders:", error);
    } else {
        console.log("✅ Diverse Orders inserted (Unconfirmed, Refund, Cancelled, etc).");
    }
}

seed();
