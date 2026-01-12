
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a variable to hold the client
let supabaseClient: any = null;

try {
    if (supabaseUrl && supabaseUrl.length > 0 && supabaseAnonKey && supabaseAnonKey.length > 0) {
        supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    } else {
        console.warn('Supabase URL or Key is missing in User App. Client will be null.');
    }
} catch (error) {
    console.error('Failed to initialize Supabase client:', error);
}

// Export the safety-checked client (can be null)
export const supabase = supabaseClient;
