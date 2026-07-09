import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { router } from 'expo-router';
import { validateOtp } from '../validation';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 42;

// TODO: replace with `supabase.auth.verifyOtp({ email, token, type: 'email' })`
function verifyOtpRequest(_email: string, _code: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 600);
  });
}

// TODO: replace with `supabase.auth.signInWithOtp({ email })`
function resendOtpRequest(_email: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 400);
  });
}

export interface UseOtpVerifyResult {
  digits: readonly string[];
  setDigit: (index: number, value: string) => void;
  handleBackspace: (index: number) => void;
  error: string | null;
  submitting: boolean;
  submit: () => Promise<void>;
  secondsLeft: number;
  canResend: boolean;
  resend: () => Promise<void>;
}

export function useOtpVerify(email: string): UseOtpVerifyResult {
  const [digits, setDigits] = useState<string[]>(() => Array<string>(OTP_LENGTH).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = useCallback(() => {
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
    setSecondsLeft(RESEND_SECONDS);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return current - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startCountdown();
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [startCountdown]);

  const setDigit = useCallback((index: number, value: string) => {
    if (index < 0 || index >= OTP_LENGTH) return;
    const sanitized = value.replace(/\D/g, '').slice(0, 1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = sanitized;
      return next;
    });
    if (error !== null) setError(null);
  }, [error]);

  const handleBackspace = useCallback((index: number) => {
    setDigits((prev) => {
      const next = [...prev];
      if (next[index] !== undefined && next[index] !== '') {
        next[index] = '';
      } else if (index > 0) {
        next[index - 1] = '';
      }
      return next;
    });
  }, []);

  const submit = useCallback(async () => {
    const validationError = validateOtp(digits);
    if (validationError !== null) {
      setError(validationError);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await verifyOtpRequest(email, digits.join(''));
      router.replace('/(auth)/profile-setup');
    } finally {
      setSubmitting(false);
    }
  }, [digits, email]);

  const resend = useCallback(async () => {
    if (secondsLeft > 0) return;
    await resendOtpRequest(email);
    setDigits(Array<string>(OTP_LENGTH).fill(''));
    startCountdown();
  }, [email, secondsLeft, startCountdown]);

  const canResend = useMemo(() => secondsLeft === 0, [secondsLeft]);

  return {
    digits,
    setDigit,
    handleBackspace,
    error,
    submitting,
    submit,
    secondsLeft,
    canResend,
    resend,
  };
}

export function formatCountdown(seconds: number): string {
  const mm = Math.floor(seconds / 60).toString().padStart(1, '0');
  const ss = (seconds % 60).toString().padStart(2, '0');
  return `${mm}:${ss}`;
}
