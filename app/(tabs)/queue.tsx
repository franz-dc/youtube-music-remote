import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';

import { LoadingView, QueueListItem } from '@/components';
import { useQueue } from '@/hooks/useQueue';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const Queue = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'queue' });

  const { data: queue, isLoading, isError } = useQueue();

  if (isLoading) return <LoadingView />;

  // TODO: Error UI
  if (isError) return <Text>Something went wrong</Text>;

  // TODO: Empty state UI
  if (!queue || !queue.items?.length)
    return <Text>{t('nothingIsInQueue')}</Text>;

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
