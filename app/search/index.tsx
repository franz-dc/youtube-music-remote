import { useEffect, useRef, useState } from 'react';

import { QueryObserverResult } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { List, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  InfoView,
  LoadingView,
  MusicCardShelf,
  SearchResultItem,
  SearchResultMenu,
  SearchResultMenuMethods,
} from '@/components';
import { useQueue, useSearch } from '@/hooks';
import { QueueSchema, SearchResultSong } from '@/schemas';
import { addSongToQueue, playNextTrack } from '@/services';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

/**
 * Poll the queue until the song with `videoId` is found at the next position
 * after the current song.
 *
 * @param videoId - The video ID of the song to find in the queue.
 * @param refetchQueue - Function to refetch the queue data.
 * @param onSongFound - Optional callback to execute when the song is found.
 * @return A promise that resolves to `true` if the song is found, `false`
 * otherwise.
 */
const pollQueue = async (
  videoId: string,
  refetchQueue: () => Promise<QueryObserverResult<QueueSchema | null, Error>>,
  onSongFound?: () => Promise<void> | void
): Promise<boolean> => {
  // Adding song to the queue has a delay on the desktop app even if the
  // promise is resolved, so poll the queue until the song is added.
  //
  // 1. Invalidate the queue cache at set interval
  // 2. Get currently playing song (selected)
  // 3. Check if adjacent song is the one added
  // 4. If so, play the next track
  //
  // Poll every 1 second interval until the song is added to the queue.
  // If the song is not added after 10 attempts, abort the operation.
  let attempts = 0;
  const maxAttempts = 10;

  return new Promise((resolve) => {
    const poll = async () => {
      attempts += 1;

      if (attempts > maxAttempts) return resolve(false);

      const { data: queue } = await refetchQueue();

      const currentSongIdx = queue?.items.findIndex(
        (item: any) =>
          (
            item.playlistPanelVideoRenderer ||
            item.playlistPanelVideoWrapperRenderer?.primaryRenderer
              ?.playlistPanelVideoRenderer
          )?.selected
      );

      if (currentSongIdx === undefined || currentSongIdx < 0) {
        return resolve(false);
      }

      const nextSongVideoId = (
        queue?.items[currentSongIdx + 1]?.playlistPanelVideoRenderer ||
        queue?.items[currentSongIdx + 1]?.playlistPanelVideoWrapperRenderer
          ?.primaryRenderer?.playlistPanelVideoRenderer
      )?.videoId;

      if (nextSongVideoId === videoId) {
        if (onSongFound) await onSongFound();
        return resolve(true);
      } else {
        setTimeout(poll, 1000);
      }
    };
    poll();
  });
};

const Search = () => {
  const { bottom: bottomInset } = useSafeAreaInsets();

  const { t } = useTranslation('translation');

  const { refetch: refetchQueue } = useQueue();

  const { q } = useLocalSearchParams<{ q: string }>();
  const {
    data: searchResults,
    isLoading,
    isError,
    refetch,
  } = useSearch({ query: q });

  const handleSelectSong = async ({
    videoId,
    action,
  }: {
    videoId: string;
    action: 'play' | 'addToQueue' | 'playNext';
  }) => {
    // The API does not support playing a song directly via its ID.
    // Workaround: Insert song next to the current song in the queue,
    // then, play the next song in the queue (newly added song).
    switch (action) {
      case 'play': {
        await addSongToQueue(videoId, 'INSERT_AFTER_CURRENT_VIDEO');
        await pollQueue(videoId, refetchQueue, async () => {
          await playNextTrack();
        });
        break;
      }
      case 'addToQueue': {
        await addSongToQueue(videoId, 'INSERT_AT_END');
        await pollQueue(videoId, refetchQueue);
        break;
      }
      case 'playNext': {
        await addSongToQueue(videoId, 'INSERT_AFTER_CURRENT_VIDEO');
        await pollQueue(videoId, refetchQueue);
        break;
      }
    }
  };

  // more actions handler
  const [selectedSong, setSelectedSong] = useState<SearchResultSong | null>(
    null
  );
  const searchResultMenuRef = useRef<SearchResultMenuMethods>(null);

  useEffect(() => {
    if (selectedSong) {
      searchResultMenuRef.current?.show();
    }
  }, [selectedSong]);

  if (isLoading) {
    return <LoadingView />;
  }

  if (isError) {
    return (
      <InfoView
        title={t('common.somethingWentWrong')}
        message={t('search.errorMessage')}
        icon='image-broken-variant'
        onActionPress={refetch}
        actionLabel={t('retry')}
      />
    );
  }

  if (searchResults) {
    return (
      <>
        <ScrollView
          style={[styles.container]}
          contentContainerStyle={{ paddingBottom: bottomInset }}
        >
          {searchResults.map((result) => (
            <View key={result.category}>
              <Text style={{ marginBottom: 8 }}>{result.category}</Text>
              {result.contents.map((shelf) => (
                <View key={shelf.header}>
                  <Text
                    style={{
                      marginHorizontal: 16,
                      fontSize: 20,
                      fontWeight: 'bold',
                    }}
                  >
                    {shelf.header}
                  </Text>
                  {shelf.type === 'musicCardShelfRenderer' && (
                    <MusicCardShelf
                      {...shelf}
                      onSelect={handleSelectSong}
                      onMoreActionsOpen={setSelectedSong}
                    />
                  )}
                  {shelf.type === 'musicShelfRenderer' && (
                    <List.Section
                      style={{
                        marginBottom: 16,
                      }}
                    >
                      {shelf.contents.map((item) => (
                        <SearchResultItem
                          key={item.videoId}
                          onSelect={handleSelectSong}
                          onMoreActionsOpen={setSelectedSong}
                          {...item}
                        />
                      ))}
                    </List.Section>
                  )}
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
        {selectedSong && (
          <SearchResultMenu
            ref={searchResultMenuRef}
            song={selectedSong}
            onSongActionSelect={handleSelectSong}
          />
        )}
      </>
    );
  }

  return null;
};

export default Search;
