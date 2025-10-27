import axios from 'axios';

import { api } from '@/configs';
import {
  LikeStateSchema,
  QueueSchema,
  ReleaseSchema,
  RepeatModeStateSchema,
  SearchResultSchema,
  SongInfoSchema,
} from '@/schemas';

// Player
// export const play = async () => await api.post('/play');

export const pause = async () => await api.post('/pause');

export const togglePlayPause = async () => await api.post('/toggle-play');

export const playPreviousTrack = async () => await api.post('/previous');

export const playNextTrack = async () => await api.post('/next');

export const seek = async (seconds: number) =>
  await api.post('/seek-to', { seconds });

export const getShuffleState = async () => {
  const { data } = await api.get<{ state: boolean }>('/shuffle');
  return data.state;
};

export const toggleShuffle = async () => await api.post('/shuffle');

export const getRepeatMode = async () => {
  const { data } = await api.get<RepeatModeStateSchema>('/repeat-mode');
  return data.mode;
};

export const switchRepeat = async () =>
  await api.post('/switch-repeat', { iteration: 1 });

export const getVolume = async () => {
  const { data } = await api.get<{ state: number; isMuted: boolean }>(
    '/volume'
  );
  return data;
};

export const updateVolume = async (volume: number) =>
  await api.post('/volume', { volume: Math.floor(volume) });

export const getFullScreen = async () => {
  const { data } = await api.get<{ state: boolean }>('/fullscreen');
  return data.state;
};

export const setFullScreen = async (state: boolean) =>
  await api.post('/fullscreen', { state });

export const toggleMute = async () => await api.post('/toggle-mute');

// Song
export const getLikeState = async () => {
  const { data } = await api.get<{ state: LikeStateSchema }>('/like-state');
  return data.state;
};

export const toggleLikeSong = async () => await api.post('/like');

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
    | 'INSERT_AT_END'
    | 'INSERT_AFTER_CURRENT_VIDEO' = 'INSERT_AT_END'
) => await api.post('/queue', { videoId, insertPosition });

export const changeActiveSongInQueue = async (index: number) =>
  await api.patch('/queue', { index });

export const moveSongInQueue = async (fromIndex: number, toIndex: number) =>
  await api.patch(`/queue/${fromIndex}`, { toIndex });

export const removeSongFromQueue = async (index: number) =>
  await api.delete(`/queue/${index}`);

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
