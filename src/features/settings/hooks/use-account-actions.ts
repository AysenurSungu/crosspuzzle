import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { SessionError, deleteAccount, signOut } from '@/src/features/auth/api/session';
import { useProfileStore } from '@/src/stores/profile-store';

type Busy = 'logout' | 'delete' | null;

export interface UseAccountActionsResult {
  busy: Busy;
  logout: () => void;
  deleteAccount: () => void;
}

/**
 * Ayarlardaki oturum işlemleri. Her ikisi de onay ister; başarıda profil
 * store'u temizlenir ve login'e dönülür.
 */
export function useAccountActions(): UseAccountActionsResult {
  const [busy, setBusy] = useState<Busy>(null);

  const run = useCallback(async (kind: Exclude<Busy, null>, action: () => Promise<void>) => {
    setBusy(kind);
    try {
      await action();
      useProfileStore.getState().clear();
      router.replace('/(auth)/login');
    } catch (err) {
      Alert.alert('Hata', err instanceof SessionError ? err.message : 'İşlem başarısız oldu.');
    } finally {
      setBusy(null);
    }
  }, []);

  const logout = useCallback(() => {
    Alert.alert('Çıkış yap', 'Oturumu kapatmak istiyor musun?', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Çıkış yap', style: 'destructive', onPress: () => { void run('logout', signOut); } },
    ]);
  }, [run]);

  const removeAccount = useCallback(() => {
    Alert.alert(
      'Hesabı sil',
      'Hesabın ve tüm verilerin kalıcı olarak silinecek. Bu işlem geri alınamaz.',
      [
        { text: 'Vazgeç', style: 'cancel' },
        { text: 'Hesabı sil', style: 'destructive', onPress: () => { void run('delete', deleteAccount); } },
      ],
    );
  }, [run]);

  return { busy, logout, deleteAccount: removeAccount };
}
