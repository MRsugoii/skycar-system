
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env.local');
const env = fs.readFileSync(envPath, 'utf8');
const getVal = (key) => env.split('\n').find(l => l.startsWith(key))?.split('=')[1]?.trim().replace(/['"]/g, '');

const supabase = createClient(getVal('NEXT_PUBLIC_SUPABASE_URL'), getVal('NEXT_PUBLIC_SUPABASE_ANON_KEY'));

async function run() {
    console.log("Checking Sun Xiao-mei status...");
    const { data, error } = await supabase.from('drivers').select('*').eq('national_id', 'C123456789').single();
    if (error || !data) {
        console.error('Error or Sun Xiao-mei not found', error);
        return;
    }
    console.log('Current Status:', data.status);
    if (data.status !== '審核中') {
        const { error: updateError } = await supabase.from('drivers').update({ status: '審核中' }).eq('national_id', 'C123456789');
        if (updateError) console.error('Update error', updateError);
        else console.log('Successfully reset Sun Xiao-mei to 審核中 for Phase 1 testing.');
    } else {
        console.log('Sun Xiao-mei is already in 審核中 status.');
    }
}
run();
