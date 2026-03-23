const { createClient } = require('@supabase/supabase-js');

// Config
const supabaseUrl = "https://swmwqnfhpsihtfeyklvp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3bXdxbmZocHNpaHRmZXlrbHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0ODU5NzQsImV4cCI6MjA4MjA2MTk3NH0.bo3A_aJogABdxF0mmZ6hF_gYtNvrkoIYy-yGW-TWjkU";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
    // 0. Get Valid User
    const { data: users } = await supabase.from('users').select('id').limit(1);
    if (!users || users.length === 0) {
        console.error("No users found to test with.");
        return;
    }
    const userId = users[0].id;
    console.log("Using User ID:", userId);

    // 1. Insert Test Row
    const fakeId = `CH${new Date().getFullYear()}TEST${Math.floor(Math.random() * 1000)}`;
    console.log(`Inserting Order with ID: ${fakeId}`);

    const { data, error } = await supabase.from('orders').insert({
        id: fakeId,
        user_id: userId,
        contact_name: 'Schema Check',
        contact_phone: '0900000000',
        pickup_address: 'Test',
        dropoff_address: 'Test',
        pickup_time: new Date().toISOString(),
        passenger_count: 1,
        luggage_count: 0,
        price: 100
    }).select().single();

    if (error) {
        console.error("Insert Error:", error);
    } else {
        console.log("Insert Success!");
        console.log("Returned Data ID:", data.id);
        if (data.id !== fakeId) {
            console.log("⚠️ ID CHANGED! Database Trigger detected.");
            console.log(`Sent: ${fakeId} -> Stored: ${data.id}`);
        } else {
            console.log("✅ ID Matched (No overriding trigger).");
        }
    }
}

checkSchema();
