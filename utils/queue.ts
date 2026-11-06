import { QueueSchema } from '@/schemas';

export const getQueueItemRenderer = (item?: QueueSchema['items'][number]) =>
  item?.playlistPanelVideoRenderer ||
  item?.playlistPanelVideoWrapperRenderer?.primaryRenderer
    .playlistPanelVideoRenderer;

/**
 * Stable identity of a queue item. `playlistSetVideoId` is unique per queue
 * entry; fall back to the video id if the server omits it.
 */
export const getQueueItemId = (item?: QueueSchema['items'][number]) => {
  const renderer = getQueueItemRenderer(item);

  return renderer?.playlistSetVideoId || renderer?.videoId;
};
