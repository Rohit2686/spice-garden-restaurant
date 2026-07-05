import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

export type Reservation = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  guests: number;
  reservation_date: string;
  reservation_time: string;
  message?: string | null;
  status?: string;
  created_at?: string;
};

export type OrderItem = {
  name: string;
  price: number;
  qty: number;
};

export type Order = {
  id?: string;
  order_type: 'dine_in' | 'takeaway';
  customer_name: string;
  customer_phone: string;
  table_number?: string | null;
  items: OrderItem[];
  total: number;
  notes?: string | null;
  status?: string;
  created_at?: string;
};
