import { useCallback, useEffect, useRef, useState } from 'react';

import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ConnectionError,
  InfoView,
  LoadingView,
  Player,
  QueueListItem,
  SearchResultMenu,
  SearchResultMenuMethods,
} from '@/components';
import {
  isWebsocketConnectingAtom,
  isWebsocketErrorAtom,
  useSettingAtom,
} from '@/configs';
import { MINI_PLAYER_HEIGHT } from '@/constants';
import { useQueue } from '@/hooks';
import { QueueSchema, SearchResultSong } from '@/schemas';
import { addSongToQueue, removeSongFromQueue } from '@/services';
import { pollQueue, pollQueueForIndex } from '@/utils';

const Queue = () => {
  const { t } = useTranslation('translation');

  const [ipAddress] = useSettingAtom('ipAddress');

  const {
    data: queue,
    isLoading: isLoadingQueue,
    isError: isErrorQueue,
    isFetched,
  } = useQueue();

  const isWebsocketLoading = useAtomValue(isWebsocketConnectingAtom);
  const isWebsocketError = useAtomValue(isWebsocketErrorAtom);

  const isLoading = isLoadingQueue || isWebsocketLoading;

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

  // more actions handler
  const [selectedSong, setSelectedSong] = useState<
    (SearchResultSong & { index: number }) | null
  >(null);
  const searchResultMenuRef = useRef<SearchResultMenuMethods>(null);

  useEffect(() => {
    if (selectedSong) {
      searchResultMenuRef.current?.show();
    }
  }, [selectedSong]);

  const { refetch: refetchQueue } = useQueue();

  const handleSelectSong = useCallback(
    async ({
      videoId,
      index,
      action,
    }: {
      videoId: string;
      index?: number;
      action: 'addToQueue' | 'playNext' | 'removeFromQueue';
    }) => {
      // The API does not support playing a song directly via its ID.
      // Workaround: Insert song next to the current song in the queue,
      // then, play the next song in the queue (newly added song).
      switch (action) {
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
        case 'removeFromQueue': {
          if (!index) return;
          await removeSongFromQueue(index);
          await pollQueueForIndex(videoId, index, refetchQueue);
        }
      }
    },
    [refetchQueue]
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

  if (isWebsocketError)
    return <ConnectionError type='noConnection' style={{ paddingBottom }} />;

  if (isLoading || !isFetched) return <LoadingView />;

  if (isWebsocketError && isErrorQueue)
    return <ConnectionError type='serverError' style={{ paddingBottom }} />;

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
              onMoreActionsOpen={setSelectedSong}
            />
          )}
          keyExtractor={keyExtractor}
          estimatedItemSize={64}
          contentContainerStyle={{ paddingBottom: 8 }}
        />
      </View>
      <Player />
      {selectedSong && (
        <SearchResultMenu
          ref={searchResultMenuRef}
          song={selectedSong}
          onSongActionSelect={handleSelectSong}
          source='queue'
        />
      )}
    </>
  );
};

export default Queue;
