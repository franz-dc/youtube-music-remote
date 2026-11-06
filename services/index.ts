import axios from 'axios';

import { api } from '@/configs';
import {
  LikeState,
  QueueSchema,
  ReleaseSchema,
  RepeatMode,
  SearchResultSchema,
  SongInfoSchema,
} from '@/schemas';
import { getQueueItemId } from '@/utils/queue';

// Player
export const pause = async () => {
  await api.post('/pause');
};

export const togglePlayPause = async () => {
  await api.post('/toggle-play');
};

export const playPreviousTrack = async () => {
  await api.post('/previous');
};

export const playNextTrack = async () => {
  await api.post('/next');
};

export const seek = async (seconds: number) => {
  await api.post('/seek-to', { seconds });
};

export const getShuffleState = async () => {
  const { data } = await api.get<{ state: boolean }>('/shuffle');
  return data.state;
};

export const toggleShuffle = async () => {
  await api.post('/shuffle');
};

export const getRepeatMode = async () => {
  const { data } = await api.get<{ mode: RepeatMode | null }>('/repeat-mode');
  return data.mode;
};

export const switchRepeat = async () => {
  await api.post('/switch-repeat', { iteration: 1 });
};

export const getVolume = async () => {
  const { data } = await api.get<{ state: number; isMuted: boolean }>(
    '/volume'
  );
  return data;
};

export const updateVolume = async (volume: number) => {
  await api.post('/volume', { volume: Math.floor(volume) });
};

export const getFullScreen = async () => {
  const { data } = await api.get<{ state: boolean }>('/fullscreen');
  return data.state;
};

export const setFullScreen = async (state: boolean) => {
  await api.post('/fullscreen', { state });
};

export const toggleMute = async () => {
  await api.post('/toggle-mute');
};

// Song
export const getLikeState = async () => {
  const { data } = await api.get<{ state: LikeState }>('/like-state');
  return data.state;
};

export const toggleLikeSong = async () => {
  await api.post('/like');
};

export const toggleDislikeSong = async () => await api.post('/dislike');

export const getSongInfo = async () => {
  const { status, data } = await api.get<SongInfoSchema>('/song');
  if (status === 204) return null;
  return data;
};

// Queue Info
export const getQueue = async () => {
  const { status, data } = await api.get<QueueSchema>('/queue');
  if (status === 204) return null;
  return data;
};

export const addSongToQueue = async (
  videoId: string,
  insertPosition:
    'INSERT_AT_END' | 'INSERT_AFTER_CURRENT_VIDEO' = 'INSERT_AT_END'
) => {
  await api.post('/queue', { videoId, insertPosition });
};

// Queue edits are applied optimistically in the UI, so requests that depend on
// queue positions must not race each other. Serializing them guarantees that a
// play request sent right after a reorder (or removal) reaches the server after
// that edit, using the same order the UI is showing.
let pendingQueueEdit: Promise<unknown> = Promise.resolve();

const withQueueEditLock = <T>(edit: () => Promise<T>): Promise<T> => {
  const result = pendingQueueEdit.then(edit, edit);
  pendingQueueEdit = result.catch(() => undefined);
  return result;
};

export const changeActiveSongInQueue = (index: number) =>
  withQueueEditLock(() => api.patch('/queue', { index }));

const QUEUE_MOVE_POLL_INTERVAL_MS = 100;
const QUEUE_MOVE_POLL_MAX_ATTEMPTS = 20;

/**
 * The desktop app applies a queue move asynchronously. The PATCH resolves
 * before the queue reflects the new position, so poll until the moved song is
 * actually at `toIndex`. The queue edit lock keeps a play request sent right
 * after the drag waiting for this, so it cannot run against the old order.
 */
const waitForSongToMove = async (toIndex: number, movedItemId?: string) => {
  if (!movedItemId) return;

  for (let attempt = 0; attempt < QUEUE_MOVE_POLL_MAX_ATTEMPTS; attempt += 1) {
    const queue = await getQueue();

    if (getQueueItemId(queue?.items[toIndex]) === movedItemId) return;

    await new Promise((resolve) =>
      setTimeout(resolve, QUEUE_MOVE_POLL_INTERVAL_MS)
    );
  }
};

export const moveSongInQueue = (
  fromIndex: number,
  toIndex: number,
  movedItemId?: string
) =>
  withQueueEditLock(async () => {
    await api.patch(`/queue/${fromIndex}`, { toIndex });
    await waitForSongToMove(toIndex, movedItemId);
  });

export const removeSongFromQueue = (index: number) =>
  withQueueEditLock(() => api.delete(`/queue/${index}`));

// Search
export const search = async (searchParams: {
  query: string;
  params?: string;
  continuation?: string;
}) => {
  const { data } = await api.post<SearchResultSchema>('/search', searchParams);
  return data;
};

// GitHub
export const getLatestRelease = async () => {
  const { data } = await axios.get<ReleaseSchema>(
    'https://api.github.com/repos/franz-dc/youtube-music-remote/releases/latest',
    {
      timeout: 5000,
    }
  );
  return data;
};
