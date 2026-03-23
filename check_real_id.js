const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://swmwqnfhpsihtfeyklvp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3bXdxbmZocHNpaHRmZXlrbHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0ODU5NzQsImV4cCI6MjA4MjA2MTk3NH0.bo3A_aJogABdxF0mmZ6hF_gYtNvrkoIYy-yGW-TWjkU";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkRealId() {
    // Search for the order with phone 09090909090 (from screenshot)
    const { data, error } = await supabase
        .from('orders')
        .select('id, contact_name, contact_phone')
        .eq('contact_phone', '09090909090');

    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Found Orders:", data);
    }
}

checkRealId();
