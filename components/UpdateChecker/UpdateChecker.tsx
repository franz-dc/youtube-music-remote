import { useCallback, useEffect, useState } from 'react';

import { nativeApplicationVersion as currentVersion } from 'expo-application';
import * as FileSystem from 'expo-file-system';
import { startActivityAsync } from 'expo-intent-launcher';
import * as Notifications from 'expo-notifications';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { gt } from 'semver';

import { useGetLatestRelease } from '@/hooks';

const FILE_EXTENSION = Platform.select({
  ios: 'ipa',
  android: 'apk',
});

const styles = StyleSheet.create({
  listItem: {
    paddingHorizontal: 4,
  },
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const UpdateChecker = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'about' });

  const params = useLocalSearchParams<{
    startUpdate: string;
  }>();

  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadError, setIsDownloadError] = useState(false);
  const [progress, setProgress] = useState(0);

  const {
    data: latestRelease,
    isLoading,
    isRefetching,
    isError,
    refetch,
  } = useGetLatestRelease();

  // get latest version number without the 'v' prefix
  const latestVersion = latestRelease?.tag_name.slice(1);
  const asset = FILE_EXTENSION
    ? latestRelease?.assets.find((asset) => asset.name.endsWith(FILE_EXTENSION))
    : null;
  const hasUpdate =
    Platform.OS !== 'web' && currentVersion && latestVersion && asset
      ? gt(latestVersion, currentVersion)
      : false;

  const getUpdateStatus = () => {
    if (isLoading || isRefetching) return 'checkingForUpdates';
    if (isError || isDownloadError) return 'errorCheckingForUpdates';
    if (isDownloading) return 'downloadingUpdate';
    if (hasUpdate) return 'updateAvailableLong';
    return 'upToDate';
  };

  const updateStatusText = t(getUpdateStatus(), { progress });

  const downloadUpdate = useCallback(async () => {
    try {
      setProgress(0);
      setIsDownloading(true);

      const downloadResumable = FileSystem.createDownloadResumable(
        asset!.browser_download_url,
        FileSystem.cacheDirectory + asset!.name,
        {},
        (downloadProgress) => {
          const progress =
            downloadProgress.totalBytesWritten /
            downloadProgress.totalBytesExpectedToWrite;
          setProgress(Math.round(progress * 100));
        }
      );

      const downloadResult = await downloadResumable.downloadAsync();

      if (!downloadResult?.uri) {
        throw new Error('Download failed');
      }

      const contentUri = await FileSystem.getContentUriAsync(
        downloadResult.uri
      );
      await startActivityAsync('android.intent.action.VIEW', {
        data: contentUri,
        flags: 1,
      });
    } catch (error) {
      setIsDownloadError(true);
    } finally {
      setIsDownloading(false);
    }
  }, [asset]);

  // start download if the user pressed the notification to update
  useEffect(() => {
    if (
      params.startUpdate === '1' &&
      progress === 0 &&
      hasUpdate &&
      !isDownloading
    ) {
      downloadUpdate();
    }
  }, [params.startUpdate, progress, downloadUpdate, hasUpdate, isDownloading]);

  const handlePress = async () => {
    if (isLoading || isRefetching || isDownloading) return;

    if (hasUpdate) {
      await downloadUpdate();
      return;
    }

    // for errors or up-to-date
    await refetch();
  };

  return (
    <List.Item
      title={t('checkForUpdates')}
      description={updateStatusText}
      left={(props) => <List.Icon {...props} icon='update' />}
      style={styles.listItem}
      onPress={handlePress}
    />
  );
};
export default UpdateChecker;
