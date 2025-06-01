import { QueryObserverResult } from '@tanstack/react-query';

import { QueueSchema } from '@/schemas';

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
export const pollQueue = async (
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

/**
 * Similar to pollQueue, but will check if the song is not in the specified
 * index of the queue.
 *
 * Used for removing a song from the queue and checking if the song is removed.
 */
export const pollQueueForIndex = async (
  videoId: string,
  index: number,
  refetchQueue: () => Promise<QueryObserverResult<QueueSchema | null, Error>>,
  onSongFound?: () => Promise<void> | void
): Promise<boolean> => {
  // Poll every 1 second interval until the song is added to the queue.
  // If the song is not added after 10 attempts, abort the operation.
  let attempts = 0;
  const maxAttempts = 10;

  return new Promise((resolve) => {
    const poll = async () => {
      attempts += 1;

      if (attempts > maxAttempts) return resolve(false);

      const { data: queue } = await refetchQueue();

      const songAtIndexVideoId =
        queue?.items[index]?.playlistPanelVideoRenderer?.videoId ||
        queue?.items[index]?.playlistPanelVideoWrapperRenderer?.primaryRenderer
          ?.playlistPanelVideoRenderer?.videoId;

      if (songAtIndexVideoId === videoId) {
        if (onSongFound) await onSongFound();
        return resolve(true);
      } else {
        setTimeout(poll, 1000);
      }
    };
    poll();
  });
};
