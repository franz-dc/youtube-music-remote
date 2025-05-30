import { useCallback } from 'react';

import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ConnectionError,
  InfoView,
  LoadingView,
  QueueListItem,
} from '@/components';
import { useSettingAtom } from '@/configs';
import { MINI_PLAYER_HEIGHT } from '@/constants';
import { useQueue } from '@/hooks';
import { QueueSchema } from '@/schemas';

const Queue = () => {
  const { t } = useTranslation('translation');

  const [ipAddress] = useSettingAtom('ipAddress');

  const {
    data: queue,
    isLoading,
    isError,
    error,
    refetch,
    isFetched,
  } = useQueue();

  const { bottom: bottomInset } = useSafeAreaInsets();

  const paddingBottom = MINI_PLAYER_HEIGHT + bottomInset;

  const keyExtractor = useCallback(
    (item: QueueSchema['items'][number], idx: number) =>
      `${idx}-${
        item.playlistPanelVideoRenderer?.videoId ||
        item.playlistPanelVideoWrapperRenderer?.primaryRenderer
          .playlistPanelVideoRenderer.videoId
      }`,
    []
  );

  if (!ipAddress)
    return (
      <ConnectionError
        type='notConfigured'
        style={{ paddingBottom }}
        onActionPress={() => router.push('/settings')}
        actionLabel={t('common.goToSettings')}
      />
    );

  if (error?.message === 'Network Error')
    return (
      <ConnectionError
        type='noConnection'
        onActionPress={refetch}
        style={{ paddingBottom }}
      />
    );

  if (isLoading || !isFetched) return <LoadingView />;

  if (isError)
    return (
      <ConnectionError
        type='serverError'
        onActionPress={refetch}
        style={{ paddingBottom }}
      />
    );

  if (!queue || !queue.items?.length)
    return (
      <InfoView
        title={t('queue.nothingIsInQueue')}
        message={t('queue.nothingIsInQueueMessage')}
        icon='playlist-music'
        style={{ paddingBottom }}
      />
    );

  return (
    <>
      <View style={{ flex: 1, paddingBottom }}>
        <FlashList
          data={queue.items.filter(
            (item) =>
              item?.playlistPanelVideoRenderer?.videoId ||
              item.playlistPanelVideoWrapperRenderer?.primaryRenderer
                .playlistPanelVideoRenderer.videoId
          )}
          renderItem={({ item, index }) => (
            <QueueListItem
              song={
                (item.playlistPanelVideoRenderer ||
                  item.playlistPanelVideoWrapperRenderer?.primaryRenderer
                    ?.playlistPanelVideoRenderer)!
              }
              index={index}
            />
          )}
          keyExtractor={keyExtractor}
          estimatedItemSize={64}
          contentContainerStyle={{ paddingBottom: 8 }}
        />
      </View>
    </>
  );
};

export default Queue;
