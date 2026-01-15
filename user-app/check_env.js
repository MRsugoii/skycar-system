
const fs = require('fs');
if (fs.existsSync('.env.local')) {
    const envConfig = require('dotenv').parse(fs.readFileSync('.env.local'));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log("Service Role Key EXISTS");
} else {
    console.log("Service Role Key MISSING");
}
