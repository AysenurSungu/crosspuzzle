// Hesap silme — yalnızca oturum sahibi kendi hesabını siler.
// Kullanıcıyı silmek service_role gerektirir (client anon key ile yapılamaz);
// bu yüzden yıkıcı işlem burada, Edge Function'da (bkz. SUPABASE-RLS.md).
// profiles.id -> auth.users(id) ON DELETE CASCADE olduğu için auth kullanıcısı
// silinince profil satırı da otomatik gider.
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const authHeader = req.headers.get('Authorization');
  if (authHeader === null) return json({ error: 'unauthorized' }, 401);

  // SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY Edge Function ortamında
  // Supabase tarafından otomatik sağlanır — ayrıca secret eklemeye gerek yok.
  const url = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (url === undefined || serviceKey === undefined) {
    return json({ error: 'server_misconfigured' }, 500);
  }

  const admin = createClient(url, serviceKey);
  const token = authHeader.replace('Bearer ', '');

  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr !== null || userData.user === null) {
    return json({ error: 'unauthorized' }, 401);
  }

  const { error: delErr } = await admin.auth.admin.deleteUser(userData.user.id);
  if (delErr !== null) return json({ error: 'delete_failed' }, 500);

  return json({ ok: true }, 200);
});
