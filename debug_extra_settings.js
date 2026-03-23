const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'user-app/.env.local' });

const supabaseUrl = "https://swmwqnfhpsihtfeyklvp.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3bXdxbmZocHNpaHRmZXlrbHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0ODU5NzQsImV4cCI6MjA4MjA2MTk3NH0.bo3A_aJogABdxF0mmZ6hF_gYtNvrkoIYy-yGW-TWjkU";
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Checking extra_settings...");
    const { data, error } = await supabase.from('extra_settings').select('*');
    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Rows:", data);
    }
}
check();
