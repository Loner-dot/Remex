import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jtqypasnkllpcgzfspcd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0cXlwYXNua2xscGNnemZzcGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MDE0NDUsImV4cCI6MjA5NTI3NzQ0NX0.lSzIZ9STYx3cQBv3VJlpsXyzO-82FAo6Upd1_EaP80A'

export const supabase = createClient(supabaseUrl, supabaseKey)