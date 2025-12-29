const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

function getEnv(key) {
    let envPath = path.resolve(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
        envPath = path.resolve(process.cwd(), 'control-app', '.env.local');
    }
    if (fs.existsSync(envPath)) {
        const file = fs.readFileSync(envPath, 'utf8');
        for (const line of lines = file.split('\n')) {
            if (line.startsWith(key + '=')) return line.split('=')[1].trim().replace(/^["']|["']$/g, '');
        }
    }
    return process.env[key];
}

const supabase = createClient(
    getEnv('NEXT_PUBLIC_SUPABASE_URL') || process.env.NEXT_PUBLIC_SUPABASE_URL,
    getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function inspect() {
    console.log("🔍 Inspecting one order...");
    const { data, error } = await supabase.from('orders').select('*').limit(1);
    if (error) console.error(error);
    else console.log(data[0]);
}

inspect();
