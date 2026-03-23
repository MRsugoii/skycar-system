const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://swmwqnfhpsihtfeyklvp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3bXdxbmZocHNpaHRmZXlrbHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0ODU5NzQsImV4cCI6MjA4MjA2MTk3NH0.bo3A_aJogABdxF0mmZ6hF_gYtNvrkoIYy-yGW-TWjkU";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function deleteTestOrder() {
    const { error } = await supabase.from('orders').delete().eq('id', 'CH2026TEST213');
    if (error) console.error("Error deleting:", error);
    else console.log("Deleted test order CH2026TEST213");
}

deleteTestOrder();
