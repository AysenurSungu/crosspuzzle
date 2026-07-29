import { create } from 'zustand';

/**
 * Oturumdaki kullanıcının profili (username + avatar). Login'de doldurulur,
 * ekranlar buradan okur; ayarlardan avatar değişince tüm ekranlar anında
 * güncellenir. Async logic store'a gömülmez (STATE-API.md) — yazma işlemi
 * profile API'sinde, store yalnız durumu tutar.
 */
export interface ProfileState {
  username: string | null;
  avatarId: string | null;
  setProfile: (profile: { username: string; avatarId: string | null }) => void;
  setAvatarId: (avatarId: string | null) => void;
  clear: () => void;
}

export const useProfileStore = create<ProfileState>()((set) => ({
  username: null,
  avatarId: null,
  setProfile: ({ username, avatarId }) => set({ username, avatarId }),
  setAvatarId: (avatarId) => set({ avatarId }),
  clear: () => set({ username: null, avatarId: null }),
}));
