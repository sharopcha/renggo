'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // server-only
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function createOrganisationAndInvite(formData: {
  organisationName: string;
  taxRegisterNumber?: string;
  inviteEmail: string;
  firstName?: string;
  lastName?: string;
}) {
  // 1) create org in DB (server can use RLS-bypassing service key, or rely on your RLS)
  const { data: org, error: orgErr } = await supabaseAdmin
    .schema('public')
    .from('organizations')
    .insert({
      name: formData.organisationName,
      tax_register_number: formData.taxRegisterNumber ?? null,
      settings: {},
    })
    .select('*')
    .single();

  if (orgErr) throw orgErr;

  // 2) send invite with metadata
  const { error: inviteErr } = await supabaseAdmin.auth.admin.inviteUserByEmail(
    formData.inviteEmail,
    {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/accept-invite`,
      data: {
        role: 'owner',
        organisationId: org.id,
        firstName: formData.firstName ?? '',
        lastName: formData.lastName ?? '',
      },
    }
  );

  if (inviteErr) throw inviteErr;

  return { orgId: org.id };
}