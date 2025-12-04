import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uchivgxbextwgbbqkpsl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjaGl2Z3hiZXh0d2diYnFrcHNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNjY5NDksImV4cCI6MjA3OTk0Mjk0OX0.VdTPKH0nDmncAE_9d0KtPCGrJMJiN3efMihm_wzoFuo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);