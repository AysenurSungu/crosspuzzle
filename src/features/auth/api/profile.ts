import { supabase } from '@/src/lib/api/supabase';

export interface Profile {
  username: string;
  avatarId: string | null;
}

interface ProfileRow {
  username: string;
  avatar_id: string | null;
}

/** Oturumdaki kullanıcının profili; henüz oluşturmadıysa null. */
export async function getMyProfile(): Promise<Profile | null> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (userId === undefined) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('username, avatar_id')
    .eq('id', userId)
    .returns<ProfileRow[]>()
    .maybeSingle();

  if (error !== null) throw new ProfileError('Profil bilgisi alınamadı.');
  if (data === null) return null;
  return { username: data.username, avatarId: data.avatar_id };
}

/** İlk kayıt sonrası profili oluşturur. Kullanıcı adı alınmışsa hata fırlatır. */
export async function createProfile(input: Profile): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (userId === undefined) throw new ProfileError('Oturum bulunamadı. Tekrar giriş yap.');

  const { error } = await supabase.from('profiles').insert({
    id: userId,
    username: input.username,
    avatar_id: input.avatarId,
  });

  if (error !== null) {
    if (error.code === '23505') throw new UsernameTakenError();
    throw new ProfileError('Profil kaydedilemedi. Tekrar dene.');
  }
}

/** Oturumdaki kullanıcının avatarını günceller (login sonrası ayarlardan). */
export async function updateAvatar(avatarId: string | null): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (userId === undefined) throw new ProfileError('Oturum bulunamadı. Tekrar giriş yap.');

  const { error } = await supabase
    .from('profiles')
    .update({ avatar_id: avatarId })
    .eq('id', userId);

  if (error !== null) throw new ProfileError('Avatar güncellenemedi. Tekrar dene.');
}

export class ProfileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProfileError';
  }
}

export class UsernameTakenError extends ProfileError {
  constructor() {
    super('Bu kullanıcı adı zaten alınmış.');
    this.name = 'UsernameTakenError';
  }
}
