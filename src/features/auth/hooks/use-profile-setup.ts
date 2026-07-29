import { useCallback, useState } from 'react';
import { router } from 'expo-router';
import { validateUsername } from '../validation';
import { ProfileError, UsernameTakenError, createProfile } from '../api/profile';
import { useProfileStore } from '@/src/stores/profile-store';

export interface UseProfileSetupResult {
  username: string;
  avatarId: string | null;
  usernameError: string | null;
  submitting: boolean;
  setUsername: (value: string) => void;
  setAvatarId: (value: string | null) => void;
  submit: () => Promise<void>;
}

export function useProfileSetup(): UseProfileSetupResult {
  const [username, setUsernameState] = useState('');
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const setUsername = useCallback((value: string) => {
    setUsernameState(value);
    if (usernameError !== null) setUsernameError(null);
  }, [usernameError]);

  const submit = useCallback(async () => {
    const uErr = validateUsername(username);
    setUsernameError(uErr);
    if (uErr !== null) return;

    setSubmitting(true);
    try {
      const trimmed = username.trim();
      await createProfile({ username: trimmed, avatarId });
      useProfileStore.getState().setProfile({ username: trimmed, avatarId });
      router.replace({
        pathname: '/',
        params: { name: trimmed, avatarId: avatarId ?? '' },
      });
    } catch (err) {
      if (err instanceof UsernameTakenError) {
        setUsernameError(err.message);
      } else if (err instanceof ProfileError) {
        setUsernameError(err.message);
      } else {
        setUsernameError('Profil kaydedilemedi. Tekrar dene.');
      }
    } finally {
      setSubmitting(false);
    }
  }, [avatarId, username]);

  return {
    username,
    avatarId,
    usernameError,
    submitting,
    setUsername,
    setAvatarId,
    submit,
  };
}
