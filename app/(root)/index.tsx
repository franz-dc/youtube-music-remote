import { FlashList } from '@shopify/flash-list';
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
import { useQueue } from '@/hooks/useQueue';

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

  if (!ipAddress)
    return <ConnectionError type='noConnection' style={{ paddingBottom }} />;

  if (error?.message === 'Network Error')
    return (
      <ConnectionError
        type='noConnection'
        onRetry={refetch}
        style={{ paddingBottom }}
      />
    );

  if (isLoading || !isFetched) return <LoadingView />;

  if (isError)
    return (
      <ConnectionError
        type='serverError'
        onRetry={refetch}
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
          data={queue.items}
          renderItem={({ item }) => (
            <QueueListItem song={item.playlistPanelVideoRenderer} />
          )}
          keyExtractor={(item) => item.playlistPanelVideoRenderer.videoId}
          estimatedItemSize={64}
          contentContainerStyle={{ paddingBottom: 8 }}
        />
      </View>
    </>
  );
};

export default Queue;
