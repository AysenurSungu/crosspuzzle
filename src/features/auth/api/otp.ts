import { supabase } from '@/src/lib/api/supabase';

/**
 * Kullanıcı yoksa oluşturur (ilk kayıt), varsa mevcut kullanıcıya giriş kodu
 * gönderir. Supabase, panelde tanımlı Custom SMTP (gönderici Gmail hesabı)
 * üzerinden e-posta şablonundaki {{ .Token }} ile 6 haneli kodu iletir.
 */
export async function sendOtp(email: string): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });
  if (error) throw new AuthError(mapAuthError(error.message), error.status);
}

/** 6 haneli kodu doğrular; başarılıysa session storage'a otomatik yazılır. */
export async function verifyOtp(email: string, token: string): Promise<void> {
  const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
  if (error) throw new AuthError(mapAuthError(error.message), error.status);
}

export class AuthError extends Error {
  readonly status: number | undefined;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

function mapAuthError(raw: string): string {
  const message = raw.toLowerCase();
  if (message.includes('rate') || message.includes('too many') || message.includes('seconds')) {
    return 'Çok fazla deneme. Lütfen biraz sonra tekrar dene.';
  }
  if (message.includes('expired')) {
    return 'Kodun süresi doldu. Yeni bir kod iste.';
  }
  if (message.includes('invalid') || message.includes('token')) {
    return 'Kod hatalı. Tekrar dene.';
  }
  return 'Bir şeyler ters gitti. Lütfen tekrar dene.';
}
