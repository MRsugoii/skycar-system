const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'user-app/.env.local' });

// Use explicit hardcoded keys to avoid env var issues, matching previous successful debug script
const supabaseUrl = "https://swmwqnfhpsihtfeyklvp.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3bXdxbmZocHNpaHRmZXlrbHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0ODU5NzQsImV4cCI6MjA4MjA2MTk3NH0.bo3A_aJogABdxF0mmZ6hF_gYtNvrkoIYy-yGW-TWjkU";
const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdate() {
    console.log("Testing UPDATE on extra_settings (id=0)...");

    // Try to update signboard_price to a random value
    const randomPrice = Math.floor(Math.random() * 100);
    console.log(`Attempting to set signboard_price to ${randomPrice}`);

    const { data, error } = await supabase
        .from('extra_settings')
        .update({ signboard_price: randomPrice })
        .eq('id', 0)
        .select();

    if (error) {
        console.error("UPDATE FAILED:", error);
    } else {
        console.log("UPDATE SUCCESS:", data);
    }
}

testUpdate();
