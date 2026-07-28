import { useCallback, useState } from 'react';
import { router } from 'expo-router';
import { validateEmail } from '../validation';
import { AuthError, sendOtp } from '../api/otp';

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

    const trimmed = email.trim();
    setError(null);
    setSubmitting(true);
    try {
      await sendOtp(trimmed);
      router.push({ pathname: '/(auth)/verify', params: { email: trimmed } });
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Kod gönderilemedi. Tekrar dene.');
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
