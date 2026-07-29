import { supabase } from '@/src/lib/api/supabase';

/** Oturumu kapatır; SecureStore'daki session adaptör üzerinden temizlenir. */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error !== null) throw new SessionError('Çıkış yapılamadı. Tekrar dene.');
}

/**
 * Hesabı kalıcı olarak siler. Yıkıcı işlem service_role gerektirdiği için
 * `delete-account` Edge Function'ına gider; başarılıysa yerel oturum da kapanır.
 */
export async function deleteAccount(): Promise<void> {
  const { error } = await supabase.functions.invoke('delete-account', { method: 'POST' });
  if (error !== null) throw new SessionError('Hesap silinemedi. Tekrar dene.');
  // Silinen kullanıcının session'ı artık geçersiz — yereli de temizle.
  await supabase.auth.signOut();
}

export class SessionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SessionError';
  }
}
