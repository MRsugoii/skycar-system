const { createClient } = require('@supabase/supabase-js');

// Config
const supabaseUrl = "https://swmwqnfhpsihtfeyklvp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3bXdxbmZocHNpaHRmZXlrbHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0ODU5NzQsImV4cCI6MjA4MjA2MTk3NH0.bo3A_aJogABdxF0mmZ6hF_gYtNvrkoIYy-yGW-TWjkU";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixAirportNames() {
    console.log("Fixing Airport Names in Database...");

    // 1. Rename '桃園國際機場' -> '桃園機場'
    const { error: err1 } = await supabase
        .from('airport_prices')
        .update({ airport: '桃園機場' })
        .eq('airport', '桃園國際機場');

    if (err1) console.error("Error renaming TPE:", err1);
    else console.log("Renamed '桃園國際機場' -> '桃園機場'");

    // 2. Rename '臺北松山機場' -> '松山機場'
    const { error: err2 } = await supabase
        .from('airport_prices')
        .update({ airport: '松山機場' })
        .eq('airport', '臺北松山機場');

    if (err2) console.error("Error renaming TSA:", err2);
    else console.log("Renamed '臺北松山機場' -> '松山機場'");

    // 3. Rename '台中清泉崗機場' -> '台中清泉崗機場' (Checks out, line 103 user app)
    // 4. Rename '高雄小港機場' -> '高雄小港機場' (Checks out, line 104 user app)
}

fixAirportNames();
