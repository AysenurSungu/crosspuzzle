// Lightweight validators used until Zod + react-hook-form are added
// (STATE-API.md mandates Zod once the packages are installed).
// yerel@alan.tld — uzantı (tld) en az 2 harf olmalı ("a@b.c" gibi yazımları eler).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
// Büyük/küçük harf serbest; sadece harf, rakam ve alt tire (3-20).
const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;

export function validateEmail(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'E-posta boş olamaz';
  if (!EMAIL_RE.test(trimmed)) return 'Geçerli bir e-posta gir';
  return null;
}

export function validateOtp(digits: readonly string[]): string | null {
  if (digits.length !== 6) return 'Kod 6 haneli olmalı';
  const joined = digits.join('');
  if (!/^\d{6}$/.test(joined)) return 'Kod sadece rakamlardan oluşmalı';
  return null;
}

export function validateUsername(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'Kullanıcı adı boş olamaz';
  if (!USERNAME_RE.test(trimmed)) return 'Harf, rakam, alt tire — 3-20 karakter';
  return null;
}

export function validateDisplayName(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'Görünen isim boş olamaz';
  if (trimmed.length > 40) return 'En fazla 40 karakter';
  return null;
}

export function initialsFromName(displayName: string): string {
  const trimmed = displayName.trim();
  if (trimmed.length === 0) return '?';
  const parts = trimmed.split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const second = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + second).toUpperCase();
}
