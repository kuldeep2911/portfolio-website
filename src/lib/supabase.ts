import { createClient } from '@supabase/supabase-js'

// ─────────────────────────────────────────────────────────────────────────────
// Public Supabase project credentials.
//
// The anon key is a *public* client key — it is designed to ship in the browser
// bundle and is protected by Row-Level Security (only authenticated admins can
// write). Providing it as a built-in fallback guarantees the DEPLOYED build
// connects to Supabase even when the host's env vars aren't configured.
// Without this, production falls back to static data and every deploy "resets"
// the live content. Env vars still take precedence for local overrides.
// ─────────────────────────────────────────────────────────────────────────────
const FALLBACK_SUPABASE_URL = 'https://ehmpotxlhgxjfadcgzox.supabase.co'
const FALLBACK_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVobXBvdHhsaGd4amZhZGNnem94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTE2MDQsImV4cCI6MjA5NTM4NzYwNH0.Im3ccwpSpoKahHDnoTOfPRbI9Plqr3g8YxGXqxPc8Q0'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || FALLBACK_SUPABASE_URL
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || FALLBACK_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// With the fallback above this is effectively always true, but we still report
// false if someone deliberately blanks both the env var and the fallback.
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)
