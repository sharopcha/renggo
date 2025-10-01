import { createClient } from '@/lib/supabase/server';
import { Vehicle } from '@/types/supabase-utils';
import 'server-only';

export async function getVehiles() {
  const supabase = await createClient();

  const { data, error } = await supabase.from('vehicles').select('*');

  if(error) {
    console.error('Error fetching vehicles:', error);
  }

  return data as Vehicle[];
}