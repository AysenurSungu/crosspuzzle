import { useCallback, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { initialsFromName, validateDisplayName, validateUsername } from '../validation';

export type AppLanguage = 'tr' | 'en';

// TODO: replace with a mutation that writes to the `profiles` table
// via an Edge Function (SUPABASE-RLS.md forbids client-side skor/xp,
// but a profile create is safe under RLS if the row belongs to auth.uid()).
function saveProfileRequest(_input: {
  username: string;
  displayName: string;
  language: AppLanguage;
}): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
}

export interface UseProfileSetupResult {
  username: string;
  displayName: string;
  language: AppLanguage;
  initials: string;
  usernameError: string | null;
  displayNameError: string | null;
  submitting: boolean;
  setUsername: (value: string) => void;
  setDisplayName: (value: string) => void;
  setLanguage: (value: AppLanguage) => void;
  submit: () => Promise<void>;
}

export function useProfileSetup(): UseProfileSetupResult {
  const [username, setUsernameState] = useState('');
  const [displayName, setDisplayNameState] = useState('');
  const [language, setLanguage] = useState<AppLanguage>('tr');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [displayNameError, setDisplayNameError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const setUsername = useCallback((value: string) => {
    setUsernameState(value);
    if (usernameError !== null) setUsernameError(null);
  }, [usernameError]);

  const setDisplayName = useCallback((value: string) => {
    setDisplayNameState(value);
    if (displayNameError !== null) setDisplayNameError(null);
  }, [displayNameError]);

  const initials = useMemo(() => initialsFromName(displayName), [displayName]);

  const submit = useCallback(async () => {
    const uErr = validateUsername(username);
    const dErr = validateDisplayName(displayName);
    setUsernameError(uErr);
    setDisplayNameError(dErr);
    if (uErr !== null || dErr !== null) return;

    setSubmitting(true);
    try {
      await saveProfileRequest({
        username: username.trim(),
        displayName: displayName.trim(),
        language,
      });
      router.replace('/(tabs)');
    } finally {
      setSubmitting(false);
    }
  }, [displayName, language, username]);

  return {
    username,
    displayName,
    language,
    initials,
    usernameError,
    displayNameError,
    submitting,
    setUsername,
    setDisplayName,
    setLanguage,
    submit,
  };
}
