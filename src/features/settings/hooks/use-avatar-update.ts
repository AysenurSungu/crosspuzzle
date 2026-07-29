import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { ProfileError, updateAvatar } from '@/src/features/auth/api/profile';
import { useProfileStore } from '@/src/stores/profile-store';

export interface UseAvatarUpdateResult {
  avatarId: string | null;
  saving: boolean;
  changeAvatar: (nextId: string | null) => Promise<void>;
}

/**
 * Ayarlar ekranından avatar değişimi. Store'u önce günceller (optimistic),
 * DB yazımı başarısızsa eski değere geri döner ve uyarı gösterir.
 */
export function useAvatarUpdate(): UseAvatarUpdateResult {
  const avatarId = useProfileStore((state) => state.avatarId);
  const setAvatarId = useProfileStore((state) => state.setAvatarId);
  const [saving, setSaving] = useState(false);

  const changeAvatar = useCallback(async (nextId: string | null) => {
    const previous = useProfileStore.getState().avatarId;
    if (nextId === previous) return;

    setAvatarId(nextId);
    setSaving(true);
    try {
      await updateAvatar(nextId);
    } catch (err) {
      setAvatarId(previous);
      Alert.alert('Hata', err instanceof ProfileError ? err.message : 'Avatar güncellenemedi.');
    } finally {
      setSaving(false);
    }
  }, [setAvatarId]);

  return { avatarId, saving, changeAvatar };
}
