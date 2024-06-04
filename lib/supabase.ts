import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qlxuuujyognznbqonrjj.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFseHV1dWp5b2duem5icW9ucmpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc0NzYxNTIsImV4cCI6MjAzMzA1MjE1Mn0.aL3CG86q42NRnjmJMHznxYUogomPaYN8MO8V8eHdK9I";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
