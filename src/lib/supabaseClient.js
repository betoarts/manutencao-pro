
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czlvufisseoaanhnqtet.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6bHZ1Zmlzc2VvYWFuaG5xdGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MzM3MjYsImV4cCI6MjA2MjMwOTcyNn0.qGwd3HiNMFYwUyQ56WugEa-9HdOF_5cSutgYuVofpzI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
  