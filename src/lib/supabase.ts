import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Will be empty strings if env vars not set — client will be created but all
// calls will fail gracefully, falling back to static data.
export const supabase = createClient(
  supabaseUrl || 'http://localhost',
  supabaseAnonKey || 'placeholder'
)

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)
