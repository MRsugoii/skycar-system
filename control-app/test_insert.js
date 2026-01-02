const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    console.log("Testing insert into holidays...");
    const { data, error } = await supabase.from('holidays').insert([
        { name: "Test Holiday", startDate: "2024-01-01", endDate: "2024-01-01", status: false }
    ]).select();

    if (error) {
        console.error("Insert Error:", error.message);
        if (error.code) console.error("Error Code:", error.code);
    } else {
        console.log("Insert Success:", data);
    }
}

testInsert();
