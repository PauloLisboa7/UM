import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bxeaiydwsdoeujvcdxru.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4ZWFpeWR3c2RvZXVqdmNkeHJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODI4NDIsImV4cCI6MjA4MDg1ODg0Mn0.yGaVYdT_3KzP6rrXLTOQ3dUsYbmrHkDowMk2bqryM7I';

export const supabase = createClient(supabaseUrl, supabaseKey);
