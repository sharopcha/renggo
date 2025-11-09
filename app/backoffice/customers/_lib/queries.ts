import { createClient } from '@/lib/supabase/server';
import { Customer } from '@/types/supabase-utils';
import 'server-only';

export async function getCustomers() {
  const supabase = await createClient();

  const { data, error } = await supabase.from('customers').select('*');

  if(error) {
    console.error('Error fetching customers:', error);
  }

  return data as Customer[];
}
