const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const initialHolidays = [
    { name: "2024 春節", startDate: "2024-02-08", endDate: "2024-02-14", status: true },
    { name: "228 紀念日", startDate: "2024-02-28", endDate: "2024-02-28", status: true },
    { name: "清明節", startDate: "2024-04-04", endDate: "2024-04-07", status: true },
    { name: "勞動節", startDate: "2024-05-01", endDate: "2024-05-01", status: false },
    { name: "端午節", startDate: "2024-06-08", endDate: "2024-06-10", status: true }
];

const initialRoutes = [
    { name: "台北 -> 桃園機場", start: "台北市", end: "桃園機場", fixedPrice: 1200, status: true },
    { name: "新北 -> 桃園機場", start: "新北市", end: "桃園機場", fixedPrice: 1300, status: true },
    { name: "台中 -> 桃園機場", start: "台中市", end: "桃園機場", fixedPrice: 2500, status: true },
    { name: "高雄 -> 桃園機場", start: "高雄市", end: "桃園機場", fixedPrice: 5500, status: false }
];

const vehicles = [
    { id: 1, name: "經濟四人座" },
    { id: 2, name: "豪華轎車" },
    { id: 3, name: "電動專車" },
    { id: 4, name: "商務七人座" }
];

// Sample Airport Data (subset for demo)
const initialAirportPrices = [
    { airport: "桃園機場 第一航廈", region: "中正區", category: "weekday", prices: { 1: 1000, 2: 1400, 3: 1600, 4: 2000 }, status: true },
    { airport: "桃園機場 第一航廈", region: "大安區", category: "weekday", prices: { 1: 1100, 2: 1500, 3: 1700, 4: 2100 }, status: true },
    { airport: "松山機場", region: "中正區", category: "weekday", prices: { 1: 800, 2: 1200, 3: 1400, 4: 1800 }, status: true }
];


async function seed() {
    console.log("Seeding Holidays...");
    const { error: hError } = await supabase.from('holidays').insert(initialHolidays);
    if (hError) console.error("Error seeding holidays:", hError.message);
    else console.log("Holidays seeded.");

    console.log("Seeding Routes...");
    const { error: rError } = await supabase.from('route_prices').insert(initialRoutes);
    if (rError) console.error("Error seeding routes:", rError.message);
    else console.log("Routes seeded.");

    // Only seed if empty to avoid dups for now
    console.log("Seeding Sample Airport Prices...");
    const { error: aError } = await supabase.from('airport_prices').insert(initialAirportPrices);
    if (aError) console.error("Error seeding airport prices:", aError.message);
    else console.log("Airport prices seeded.");

}

seed();
