import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { SiteSettings } from '../types';

interface UseSiteSettingsReturn {
  settings: SiteSettings;
  loading: boolean;
  error: string | null;
}

export const useSiteSettings = (): UseSiteSettingsReturn => {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const readCache = () => {
    if (typeof window === 'undefined') return null;
    try {
      const cachedSettings = localStorage.getItem('site_settings_cache');
      const cachedLastUpdate = localStorage.getItem('site_settings_last_update');
      if (!cachedSettings || !cachedLastUpdate) return null;
      return {
        settings: JSON.parse(cachedSettings) as SiteSettings,
        lastUpdate: cachedLastUpdate,
      };
    } catch (e) {
      console.warn('Failed to read site settings cache', e);
      return null;
    }
  };

  const writeCache = (data: SiteSettings, lastUpdate?: string | null) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('site_settings_cache', JSON.stringify(data));
      if (lastUpdate) {
        localStorage.setItem('site_settings_last_update', lastUpdate);
      }
    } catch (e) {
      console.warn('Failed to write site settings cache', e);
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      const cached = readCache();
      if (cached) {
        setSettings(cached.settings);
        setLoading(false);
      }

      try {
        // Check if remote data changed
        const { data: lastUpdateRow, error: lastUpdateError } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'last_update')
          .maybeSingle();

        if (lastUpdateError) {
          throw lastUpdateError;
        }

        const remoteLastUpdate =
          typeof lastUpdateRow?.value === 'string' ? lastUpdateRow.value : null;

        // If cache is fresh, stop early
        if (cached && remoteLastUpdate && cached.lastUpdate === remoteLastUpdate) {
          return;
        }

        const { data, error: dbError } = await supabase
          .from('site_settings')
          .select('*');

        if (dbError) {
          throw dbError;
        }

        if (data) {
          const parsedSettings: SiteSettings = {};

          data.forEach((row) => {
            let value = row.value;

            // Attempt to parse JSON if it looks like a JSON string or array
            if (typeof value === 'string' && (value.trim().startsWith('{') || value.trim().startsWith('['))) {
              try {
                value = JSON.parse(value);
              } catch (e) {
                // If parse fails, keep original string value
                console.warn(`Failed to parse JSON for key ${row.key}`, e);
              }
            }

            parsedSettings[row.key] = value;
          });

          setSettings(parsedSettings);
          writeCache(parsedSettings, remoteLastUpdate);
        }
      } catch (err: any) {
        console.error('Error fetching site settings:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
};
