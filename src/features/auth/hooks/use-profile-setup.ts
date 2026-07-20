import { useCallback, useState } from 'react';
import { router } from 'expo-router';
import { validateUsername } from '../validation';

// TODO: replace with a mutation that writes to the `profiles` table
// via an Edge Function (SUPABASE-RLS.md forbids client-side skor/xp,
// but a profile create is safe under RLS if the row belongs to auth.uid()).
function saveProfileRequest(_input: {
  username: string;
  avatarId: string | null;
}): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
}

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
      await saveProfileRequest({
        username: username.trim(),
        avatarId,
      });
      router.replace({
        pathname: '/',
        params: { name: username.trim(), avatarId: avatarId ?? '' },
      });
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
