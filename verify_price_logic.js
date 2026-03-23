const { createClient } = require('@supabase/supabase-js');

// Config (Reusing credentials from check_prices.js)
const supabaseUrl = "https://swmwqnfhpsihtfeyklvp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3bXdxbmZocHNpaHRmZXlrbHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0ODU5NzQsImV4cCI6MjA4MjA2MTk3NH0.bo3A_aJogABdxF0mmZ6hF_gYtNvrkoIYy-yGW-TWjkU";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Mock Configuration ---
const HOLIDAY_RULES = [
    { name: "Spring Festival", start_date: "2026-02-10", end_date: "2026-02-15", type: "MULTIPLIER", value: 1.2 }
];

const NIGHT_RULES = { start_time: "23:00", end_time: "06:00", surcharge: 200, type: "FIXED" };

const ADDON_PRICES = {
    signage: 200,
    seat: 0 // Mocking 0 based on user design default, but logic handles it
};

// --- Helper Functions ---
function isNightTime(pickupTimeStr) {
    const date = new Date(pickupTimeStr);
    const hour = date.getHours();
    const startHour = parseInt(NIGHT_RULES.start_time.split(':')[0]);
    const endHour = parseInt(NIGHT_RULES.end_time.split(':')[0]);
    if (startHour > endHour) return hour >= startHour || hour < endHour;
    return hour >= startHour && hour < endHour;
}

function getHolidayMultiplier(pickupTimeStr) {
    const dateStr = pickupTimeStr.split(' ')[0];
    return HOLIDAY_RULES.find(r => dateStr >= r.start_date && dateStr <= r.end_date) || null;
}

async function calculatePrice(airport, region, carTypeId, pickupTimeStr, addOns = {}) {
    console.log(`\n--- [${airport} -> ${region}] Car: ${carTypeId}, Time: ${pickupTimeStr} ---`);
    console.log(`Add-ons: ${JSON.stringify(addOns)}`);

    // 1. Fetch Base Price
    const { data, error } = await supabase.from('airport_prices').select('*').eq('airport', airport).eq('region', region).single();
    if (error || !data) { console.error("Error base price:", error); return; }

    const basePrice = data.prices[carTypeId] || 0;
    console.log(`Base Price: ${basePrice}`);

    // 2. Nighttime
    let nightFee = 0;
    if (isNightTime(pickupTimeStr)) {
        nightFee = NIGHT_RULES.surcharge;
        console.log(`Nighttime: +${nightFee}`);
    }

    // 3. Holiday
    let holidayFee = 0;
    const holidayRule = getHolidayMultiplier(pickupTimeStr);
    if (holidayRule) {
        holidayFee = Math.round(basePrice * (holidayRule.value - 1));
        console.log(`Holiday (${holidayRule.name}): +${holidayFee}`);
    }

    // 4. Add-ons
    const signageFee = addOns.signage ? ADDON_PRICES.signage : 0;
    if (signageFee > 0) console.log(`Signage: +${signageFee}`);

    // Seat Fee (assuming addOns.seats is count or detail array, here simplifying to count * unit)
    const seatCount = addOns.seats || 0;
    const seatFee = seatCount * ADDON_PRICES.seat; // Currently 0 based on mockup default logic? Or should verify.
    if (seatFee > 0) console.log(`Seats (${seatCount}): +${seatFee}`);

    // 5. Total
    const total = basePrice + nightFee + holidayFee + (data.remote_surcharge || 0) + signageFee + seatFee;
    console.log(`Total Price: ${total}`);
    return total;
}

// --- Main Execution ---
async function runTests() {
    // 1. Standard
    await calculatePrice("桃園機場", "中山區", "2", "2026-02-09 10:00");

    // 2. Full Add-ons (Signage + 2 Seats)
    await calculatePrice("桃園機場", "中山區", "2", "2026-02-09 10:00", { signage: true, seats: 2 });

    // 3. Night + Holiday + Signage
    await calculatePrice("桃園機場", "中山區", "2", "2026-02-10 23:30", { signage: true });
}

runTests();
