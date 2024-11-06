import { useTranslation } from 'react-i18next';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Appbar, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SongListItem } from '@/components';
import { useQueue } from '@/hooks/useQueue';

const styles = StyleSheet.create({
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    // @ts-ignore: ScrollView does not render a scrollbar on web
    height: Platform.OS === 'web' ? 'calc(100vh - 144px)' : 'auto',
  },
});

const Queue = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'queue' });

  const { data: queue, isLoading, isError } = useQueue();

  if (isLoading)
    return (
      <SafeAreaView style={styles.loadingView}>
        <ActivityIndicator animating size='large' />
      </SafeAreaView>
    );

  // TODO: Error UI
  if (isError) return <Text>Something went wrong</Text>;

  // TODO: Empty state UI
  if (!queue || !queue.items?.length)
    return <Text>{t('nothingIsInQueue')}</Text>;

  return (
    <View>
      <Appbar.Header>
        <Appbar.Content title={t('title')} />
      </Appbar.Header>
      <ScrollView style={styles.scrollView}>
        {queue.items.map((item) => {
          const song = item.playlistPanelVideoRenderer;
          return <SongListItem key={song.videoId} song={song} />;
        })}
      </ScrollView>
    </View>
  );
};

export default Queue;
