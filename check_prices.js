const { createClient } = require('@supabase/supabase-js');

// Config
const supabaseUrl = "https://swmwqnfhpsihtfeyklvp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3bXdxbmZocHNpaHRmZXlrbHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0ODU5NzQsImV4cCI6MjA4MjA2MTk3NH0.bo3A_aJogABdxF0mmZ6hF_gYtNvrkoIYy-yGW-TWjkU";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkPrices() {
    console.log("Checking airport_prices table for '桃園機場'...");

    const { data, error } = await supabase
        .from('airport_prices')
        .select('*')
        .eq('airport', '桃園機場')
        .limit(5);

    if (error) {
        console.error("Error fetching prices:", error);
    } else {
        console.log(`Found ${data.length} rows for 桃園機場.`);
        if (data.length > 0) {
            console.log("Sample Row:", JSON.stringify(data[0], null, 2));
        } else {
            // Check if ANY prices exist
            const { count } = await supabase.from('airport_prices').select('*', { count: 'exact', head: true });
            console.log(`Total rows in airport_prices table: ${count}`);
        }
    }
}

checkPrices();
