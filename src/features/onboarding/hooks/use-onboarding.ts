import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@crosspuzzle/hasSeenOnboarding';

export type OnboardingStatus = 'loading' | 'unseen' | 'seen';

export interface UseOnboardingResult {
  status: OnboardingStatus;
  markSeen: () => Promise<void>;
  reset: () => Promise<void>;
}

export function useOnboarding(): UseOnboardingResult {
  const [status, setStatus] = useState<OnboardingStatus>('loading');

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(ONBOARDING_KEY)
      .then((value) => {
        if (cancelled) return;
        setStatus(value === '1' ? 'seen' : 'unseen');
      })
      .catch(() => {
        if (cancelled) return;
        setStatus('unseen');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const markSeen = useCallback(async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, '1');
    setStatus('seen');
  }, []);

  const reset = useCallback(async () => {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
    setStatus('unseen');
  }, []);

  return { status, markSeen, reset };
}
