// /lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

// Create a singleton Supabase client for use throughout the app
// This ensures we have only one connection instance
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.')
}

// Create one Supabase client for the whole app:
export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || ''
)