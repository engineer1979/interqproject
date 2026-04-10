import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lenltzlsnlbzwlizmijc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxlbmx0emxzbmxiendsaXptaWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMzQxNDgsImV4cCI6MjA3OTkxMDE0OH0.O0y6JNNuUo9WOdd-Yq12M9sTwTc8YduaY1p_AG3NpCE'

export { supabase } from './supabaseClient';
