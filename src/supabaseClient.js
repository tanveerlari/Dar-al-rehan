import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://fxmyoxstqguhogrrqgha.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4bXlveHN0cWd1aG9ncnJxZ2hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NDE5NDcsImV4cCI6MjA3MzIxNzk0N30.RllyL8bSPpHFRCHPFoNFRbJMbFa5GfpbTrsSG6hPkYM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
