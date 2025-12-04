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

  useEffect(() => {
    const fetchSettings = async () => {
      try {
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