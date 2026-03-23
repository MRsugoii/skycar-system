const { createClient } = require('@supabase/supabase-js');

// Config
const supabaseUrl = "https://swmwqnfhpsihtfeyklvp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3bXdxbmZocHNpaHRmZXlrbHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0ODU5NzQsImV4cCI6MjA4MjA2MTk3NH0.bo3A_aJogABdxF0mmZ6hF_gYtNvrkoIYy-yGW-TWjkU";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkPrices() {
    console.log("Checking ALL distinct airports in airport_prices table...");

    // Fetch all rows to analyze distinct airport names (since .distinct() isn't standard in client lib easily without rpc)
    const { data, error } = await supabase
        .from('airport_prices')
        .select('airport')
        .limit(100);

    if (error) {
        console.error("Error fetching prices:", error);
    } else {
        const uniqueAirports = [...new Set(data.map(item => item.airport))];
        console.log(`Found ${data.length} total rows.`);
        console.log("Distinct Airports found:", uniqueAirports);

        // Check Specific Mismatch
        const tpeRows = data.filter(d => d.airport === '桃園機場').length;
        const tpeIntlRows = data.filter(d => d.airport === '桃園國際機場').length;

        console.log(`Rows for '桃園機場': ${tpeRows}`);
        console.log(`Rows for '桃園國際機場': ${tpeIntlRows}`);
    }
}

checkPrices();
