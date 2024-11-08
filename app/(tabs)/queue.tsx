import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';

import { LoadingView, SongListItem } from '@/components';
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
      <ScrollView>
        {queue.items.map((item) => {
          const song = item.playlistPanelVideoRenderer;
          return <SongListItem key={song.videoId} song={song} />;
        })}
      </ScrollView>
    </View>
  );
};

export default Queue;
