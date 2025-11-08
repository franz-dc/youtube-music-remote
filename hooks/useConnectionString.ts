import { useEffect } from 'react';

import {
  API_VERSION,
  settingAtomFamily,
  store,
  useSettingAtom,
} from '@/configs';
import { DEFAULT_SETTINGS, MIN_CONNECTION_PROFILES } from '@/constants';
import { SettingsSchema } from '@/schemas';

const DEFAULT_CONNECTION_PROFILE: SettingsSchema['connectionProfiles'][0] = {
  ipAddress: '',
  port: DEFAULT_SETTINGS.port,
};

/**
 * Hook to get the connection string from settings.
 *
 * Also syncs and initializes connection profiles based on the current
 * ipAddress and port settings.
 */
export const useConnectionString = (protocol: 'http' | 'ws' = 'http') => {
  const [, setConnectionProfiles] = useSettingAtom('connectionProfiles');
  const [connectionProfile, setConnectionProfile] =
    useSettingAtom('connectionProfile');
  const [ipAddress] = useSettingAtom('ipAddress');
  const [port] = useSettingAtom('port');

  // Initialize and sync connection profiles
  useEffect(() => {
    const connectionProfiles = store.get(
      settingAtomFamily('connectionProfiles')
    ) as SettingsSchema['connectionProfiles'];

    if (connectionProfiles.length > 0) {
      // Failsafe: reset to first profile if out of bounds
      if (connectionProfiles.length <= connectionProfile) {
        setConnectionProfile(0);
      }

      // Ensure the array has min length by adding default profiles
      if (connectionProfiles.length < MIN_CONNECTION_PROFILES) {
        for (
          let i = connectionProfiles.length;
          i < MIN_CONNECTION_PROFILES;
          i++
        ) {
          connectionProfiles.push({ ...DEFAULT_CONNECTION_PROFILE });
        }
      }

      store.set(settingAtomFamily('connectionProfiles'), connectionProfiles);
    } else {
      // If coming from an update, set up connection profiles as these do not
      // exist prior to v0.8.0. Otherwise, this will be the same as initializing
      // everything to default.
      const ipAddress = store.get(settingAtomFamily('ipAddress')) as string;
      const port = store.get(settingAtomFamily('port')) as string;

      setConnectionProfiles([
        { ipAddress, port },
        ...Array.from({ length: MIN_CONNECTION_PROFILES - 1 }, () => ({
          ...DEFAULT_CONNECTION_PROFILE,
        })),
      ]);
    }
  }, [connectionProfile, setConnectionProfiles, setConnectionProfile]);

  return `${protocol}://${ipAddress || '0.0.0.0'}:${port || DEFAULT_SETTINGS.port}/api/${API_VERSION}`;
};
