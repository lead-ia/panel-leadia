import { useState, useEffect } from 'react';
import { Settings } from '@/types/settings';
import { SettingsRepository } from '@/lib/settings-repository';

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upsertStatus, setUpsertStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const repository = new SettingsRepository();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await repository.readSettings();
      setSettings(data);
      setError(null);
    } catch (err) {
      setError('Failed to load settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Settings) => {
    setUpsertStatus('loading');
    try {
      await repository.upsertSettings(newSettings);
      setSettings(newSettings);
      setUpsertStatus('success');
      // Reset success status after a few seconds
      setTimeout(() => setUpsertStatus('idle'), 3000);
    } catch (err) {
      setUpsertStatus('error');
      console.error(err);
    }
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
    upsertStatus
  };
}
