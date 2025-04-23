import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

// Use import.meta.env instead of process.env for Vite applications
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

// Create a single supabase client for the entire app
export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || ''
); 