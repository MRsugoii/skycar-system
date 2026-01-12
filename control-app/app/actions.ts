'use server';

import { createClient } from '@supabase/supabase-js';

// Hardcoded for Vercel CORS Bypass (Server-Side)
const supabaseUrl = "https://swmwqnfhpsihtfeyklvp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3bXdxbmZocHNpaHRmZXlrbHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0ODU5NzQsImV4cCI6MjA4MjA2MTk3NH0.bo3A_aJogABdxF0mmZ6hF_gYtNvrkoIYy-yGW-TWjkU";

export async function updateExtraSettingsAction(payload: any, accessToken: string) {
    console.log("Server Action (Auth): Updating Extra Settings...", payload);

    // Create Authenticated Client using User's Token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    });

    try {
        const { data, error } = await supabase
            .from('extra_settings')
            .update(payload)
            .eq('id', 0)
            .select();

        if (error) {
            console.error("Server Action DB Error:", error);
            return { success: false, error: `${error.message} (${error.details || ''})` };
        }

        return { success: true, data };
    } catch (err: any) {
        console.error("Server Action Unexpected Error:", err);
        return { success: false, error: err.message };
    }
}
