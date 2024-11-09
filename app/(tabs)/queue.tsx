import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Appbar } from 'react-native-paper';

import {
  ConnectionError,
  InfoView,
  LoadingView,
  QueueListItem,
} from '@/components';
import { useQueue } from '@/hooks/useQueue';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const Queue = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'queue' });

  const { data: queue, isLoading, isError, error, refetch } = useQueue();

  if (error?.message === 'Network Error')
    return <ConnectionError type='noConnection' onRetry={refetch} />;

  if (isLoading) return <LoadingView />;

  if (isError) return <ConnectionError type='serverError' onRetry={refetch} />;

  if (!queue || !queue.items?.length)
    return (
      <InfoView
        title={t('nothingIsInQueue')}
        message={t('nothingIsInQueueMessage')}
        icon='playlist-music'
      />
    );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title={t('title')} />
      </Appbar.Header>
      <FlashList
        data={queue.items}
        renderItem={({ item }) => (
          <QueueListItem song={item.playlistPanelVideoRenderer} />
        )}
        keyExtractor={(item) => item.playlistPanelVideoRenderer.videoId}
        estimatedItemSize={64}
      />
    </View>
  );
};

export default Queue;
