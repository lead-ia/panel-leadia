import { useState, useMemo } from 'react';
import { Settings } from '@/types/settings';
import { useUser } from '@/components/auth/user-context';

export function useSettings() {
  const { dbUser, updateSettings: userUpdateSettings, loading: userLoading, error: userError } = useUser();
  const [upsertStatus, setUpsertStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const settings = dbUser?.settings || null;

  const updateSettings = async (updates: Partial<Settings>) => {
    setUpsertStatus('loading');
    try {
      await userUpdateSettings(updates);
      setUpsertStatus('success');
      // Reset success status after a few seconds
      setTimeout(() => setUpsertStatus('idle'), 3000);
    } catch (err) {
      setUpsertStatus('error');
      console.error(err);
      throw err;
    }
  };

  return {
    settings,
    loading: userLoading,
    error: userError,
    updateSettings,
    upsertStatus
  };
}
