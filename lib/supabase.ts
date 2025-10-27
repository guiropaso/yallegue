import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://siubjifylsujovtjwogk.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdWJqaWZ5bHN1am92dGp3b2drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNzg1MzMsImV4cCI6MjA2MTk1NDUzM30.Q_lbykZAPlgacB3zinazJLw67d_YqjdMlRRParLr6lE'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Admin client for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database types
export interface Provider {
  id: string
  first_name: string | null
  last_name: string | null
  dui: string | null
  whatsapp: string | null
  has_fixed_job: boolean | null
  registration_step: number | null
  first_reminder_email_sent: string | null
  second_reminder_email_sent: string | null
  created_at: string | null
  updated_at: string | null
  is_approved: boolean
}

export interface ProviderExperience {
  id: string
  provider_id: string
  area: string
  years_experience: number
  description: string | null
  created_at: string
}

export interface ProviderDocument {
  id: string
  provider_id: string
  dui_front_url: string | null
  dui_back_url: string | null
  police_record_url: string | null
  verified: boolean
  created_at: string
}
