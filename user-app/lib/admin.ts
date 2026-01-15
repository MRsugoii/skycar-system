import { createClient } from '@supabase/supabase-js';

// NOTE: This client should ONLY be used in Server Actions or API Routes.
// NEVER use this in Client Components.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const adminAuthClient = serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
    : null;
