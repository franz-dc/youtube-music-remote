import { useEffect, useState } from 'react';

import { nativeApplicationVersion as currentVersion } from 'expo-application';
import {
  getLastNotificationResponseAsync,
  scheduleNotificationAsync,
} from 'expo-notifications';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { gt } from 'semver';

import { useSettingAtom } from '@/configs';
import { APP_FILE_EXTENSION } from '@/constants';

import { useGetLatestRelease } from './useGetLatestRelease';

export const useStartupUpdateChecker = (isInitialized: boolean) => {
  const { t } = useTranslation('translation', { keyPrefix: 'about' });

  const [checkForUpdatesOnAppStart] = useSettingAtom(
    'checkForUpdatesOnAppStart'
  );

  const [isNotificationSent, setIsNotificationSent] = useState(false);

  // Get the latest release from the GitHub API.
  // If there is an error, nothing will happen.
  const { data: latestRelease } = useGetLatestRelease({
    enabled:
      Platform.OS !== 'web' && checkForUpdatesOnAppStart && isInitialized,
  });

  // get latest version number without the 'v' prefix
  const latestVersion = latestRelease?.tag_name.slice(1);

  const asset =
    APP_FILE_EXTENSION && latestRelease
      ? latestRelease.assets.find((asset) =>
          asset.name.endsWith(APP_FILE_EXTENSION!)
        )
      : null;

  const hasUpdate =
    Platform.OS !== 'web' && currentVersion && latestVersion && asset
      ? gt(latestVersion, currentVersion)
      : false;

  // notify if there is an update available
  useEffect(() => {
    if (!hasUpdate || isNotificationSent) {
      return;
    }

    const handleNotifyOnAvailableUpdate = async () => {
      const lastNotificationResponse = await getLastNotificationResponseAsync();

      if (
        lastNotificationResponse?.notification?.request.identifier ===
        'updateAvailable'
      )
        return;

      scheduleNotificationAsync({
        content: {
          title: t('updateAvailable'),
          body: t('updateAvailableDescription'),
        },
        trigger: null,
        identifier: 'updateAvailable',
      });
      setIsNotificationSent(true);
    };

    handleNotifyOnAvailableUpdate();
  }, [hasUpdate, isNotificationSent, t]);
};
