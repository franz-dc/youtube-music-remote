import { useCallback, useEffect, useRef, useState } from 'react';

import { FlashList } from '@shopify/flash-list';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { DraxList, DraxProvider } from 'react-native-drax';
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
import { MINI_PLAYER_HEIGHT, QUEUE_ITEM_HEIGHT } from '@/constants';
import { useQueue } from '@/hooks';
import { QueueSchema, SearchResultSong } from '@/schemas';
import {
  addSongToQueue,
  moveSongInQueue,
  removeSongFromQueue,
} from '@/services';
import { getQueueItemId, pollQueue, pollQueueForIndex } from '@/utils';

const keyExtractor = (item: QueueSchema['items'][number], idx: number) =>
  item.playlistPanelVideoRenderer?.playlistSetVideoId ||
  item.playlistPanelVideoWrapperRenderer?.primaryRenderer
    .playlistPanelVideoRenderer.playlistSetVideoId ||
  `queue-item-${idx}`;

const Queue = () => {
  const { t } = useTranslation('translation');

  const queryClient = useQueryClient();

  // Queue order captured when a drag starts, used to roll back if the move
  // request fails.
  const queueBeforeDragRef = useRef<QueueSchema | undefined>(undefined);

  const applyOptimisticReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      queryClient.setQueryData<QueueSchema>(['queue'], (currentQueue) => {
        if (!currentQueue) return currentQueue;

        const items = [...currentQueue.items];
        const [movedItem] = items.splice(fromIndex, 1);

        if (!movedItem) return currentQueue;

        items.splice(toIndex, 0, movedItem);

        return { ...currentQueue, items };
      });
    },
    [queryClient]
  );

  const [ipAddress] = useSettingAtom('ipAddress');

  const {
    data: queue,
    isLoading: isLoadingQueue,
    isError: isErrorQueue,
    refetch: refetchQueue,
    isFetched,
  } = useQueue();

  const queueListRef = useRef<any>(null);
  const queueListWrapperRef = useRef<View>(null);

  // Resolve the queue index from the position the user actually pressed.
  // The list index carried by the rendered cell can lag behind the visual
  // order while a reorder is being applied (Drax transforms / FlashList
  // recycling), but the row geometry on screen is always current.
  const resolveIndexAtPosition = useCallback(
    (pageY: number, fallbackIndex: number) =>
      new Promise<number>((resolve) => {
        const wrapper = queueListWrapperRef.current;

        if (!wrapper) return resolve(fallbackIndex);

        wrapper.measureInWindow((_x, listTop) => {
          const scrollOffset =
            queueListRef.current?.getAbsoluteLastScrollOffset?.() ?? 0;
          const index = Math.floor(
            (pageY - listTop + scrollOffset) / QUEUE_ITEM_HEIGHT
          );
          resolve(
            index >= 0 && index < (queue?.items.length ?? 0)
              ? index
              : fallbackIndex
          );
        });
      }),
    [queue?.items.length]
  );

  const isWebsocketLoading = useAtomValue(isWebsocketConnectingAtom);
  const isWebsocketError = useAtomValue(isWebsocketErrorAtom);

  const isLoading = isLoadingQueue || isWebsocketLoading;

  const { bottom: bottomInset } = useSafeAreaInsets();

  const paddingBottom = MINI_PLAYER_HEIGHT + bottomInset;

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
          if (index === undefined) return;
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
      <DraxProvider style={{ flex: 1, paddingBottom }}>
        <View ref={queueListWrapperRef} collapsable={false} style={{ flex: 1 }}>
          <DraxList
            ref={queueListRef}
            component={FlashList}
            data={queue.items}
            renderItem={({ item, index }) => {
              const song =
                item.playlistPanelVideoRenderer ||
                item.playlistPanelVideoWrapperRenderer?.primaryRenderer
                  ?.playlistPanelVideoRenderer;

              if (!song) return <></>;

              return (
                <QueueListItem
                  song={
                    (item.playlistPanelVideoRenderer ||
                      item.playlistPanelVideoWrapperRenderer?.primaryRenderer
                        ?.playlistPanelVideoRenderer)!
                  }
                  index={index}
                  resolveIndexAtPosition={resolveIndexAtPosition}
                  onMoreActionsOpen={setSelectedSong}
                />
              );
            }}
            keyExtractor={keyExtractor}
            recycleItems
            containerDraxViewProps={{
              style: {
                height: '100%',
              },
            }}
            itemDraxViewProps={{
              dragHandle: true,
              // Finish the drag as soon as the item is released. Drax's default
              // snap animation waits ~350ms before calling `onReorder`, during
              // which the list is visually reordered by transforms but the list
              // data (and therefore the item indexes) is still in the old order.
              // Tapping a song in that window would resolve to the wrong song.
              animateSnap: false,
            }}
            lockToMainAxis
            onDragStart={() => {
              queueBeforeDragRef.current =
                queryClient.getQueryData<QueueSchema>(['queue']);
            }}
            onDragEnd={({ index: fromIndex, toIndex, cancelled }) => {
              if (cancelled || toIndex === undefined || toIndex === fromIndex) {
                return;
              }

              // Send the move and update the cache as soon as the finger is
              // released instead of waiting for `onReorder`, which Drax calls on
              // the next frame (and after its snap handling). A tap right after
              // the drop must resolve against the new order, and the move request
              // must be queued before the tap's play request.
              //
              // The cache update is deferred to the next task so Drax still
              // reads the pre-drag data while finalizing its own buffered order.
              setTimeout(() => applyOptimisticReorder(fromIndex, toIndex), 0);

              const movedItemId = getQueueItemId(
                queueBeforeDragRef.current?.items[fromIndex]
              );

              moveSongInQueue(fromIndex, toIndex, movedItemId).catch(() => {
                if (queueBeforeDragRef.current) {
                  queryClient.setQueryData(
                    ['queue'],
                    queueBeforeDragRef.current
                  );
                }
              });
            }}
            // The reorder is handled in `onDragEnd`; nothing is left to do here.
            // Do not refetch the queue after a move: the desktop app applies
            // queue edits asynchronously after the request resolves (see
            // `pollQueue`), so an immediate refetch can still return the previous
            // order and make the list flicker back with stale indexes.
            onReorder={() => {}}
          />
        </View>
      </DraxProvider>
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
