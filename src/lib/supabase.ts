import { createClient } from '@supabase/supabase-js'

// Credentials come exclusively from environment variables — never hardcode them.
// Locally: set them in a `.env` file (see `.env.example`). It is gitignored.
// In production (Cloudflare): set them as project environment variables.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set. ' +
    'The site will render with static fallback data; the admin panel and contact form will be inactive.',
  )
}

// Always create a client so imports never crash. If the env vars are missing,
// the placeholder client simply fails every request and the app falls back to
// static data (guarded by `isSupabaseConfigured`).
export const supabase = createClient(
  supabaseUrl || 'http://localhost',
  supabaseAnonKey || 'placeholder',
)
