import { useCallback, useState } from 'react';
import { router } from 'expo-router';
import { validateEmail } from '../validation';

// TODO: swap the fake delay with `supabase.auth.signInWithOtp({ email })`
// via TanStack Query mutation once the API layer lands (STATE-API.md).
function sendOtpRequest(_email: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 600);
  });
}

export interface UseEmailLoginResult {
  email: string;
  setEmail: (value: string) => void;
  error: string | null;
  submitting: boolean;
  submit: () => Promise<void>;
}

export function useEmailLogin(): UseEmailLoginResult {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = useCallback(async () => {
    const validationError = validateEmail(email);
    if (validationError !== null) {
      setError(validationError);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await sendOtpRequest(email.trim());
      router.push({ pathname: '/(auth)/verify', params: { email: email.trim() } });
    } finally {
      setSubmitting(false);
    }
  }, [email]);

  const setEmailAndClear = useCallback((value: string) => {
    setEmail(value);
    if (error !== null) setError(null);
  }, [error]);

  return { email, setEmail: setEmailAndClear, error, submitting, submit };
}
