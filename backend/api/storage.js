
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE;
const bucket = process.env.INVOICE_STORAGE_BUCKET || 'invoices';

export const supa = createClient(supabaseUrl, serviceRole);

export async function getInvoiceSignedUrl(path){
  const { data, error } = await supa.storage.from(bucket).createSignedUrl(path, 60); // 60s
  if (error) throw error;
  return data.signedUrl;
}
