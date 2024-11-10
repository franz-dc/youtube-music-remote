import { api } from '@/configs';
import { QueueSchema, SongInfoSchema } from '@/schemas';

// Player
// export const play = async () => await api.post('/play');
// export const pause = async () => await api.post('/pause');
export const togglePlayPause = async () => await api.post('/toggle-play');
export const playPreviousTrack = async () => await api.post('/previous');
export const playNextTrack = async () => await api.post('/next');
// export const seekBackward = async (seconds: number) =>
//   await api.post('/go-back', { seconds });
export const seekSeconds = async (seconds: number) =>
  await api.post('/go-forward', { seconds });
export const toggleShuffle = async () => await api.post('/shuffle');
export const switchRepeat = async () =>
  await api.post('/switch-repeat', { iteration: 1 });
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
export const toggleLikeSong = async () => await api.post('/like');
export const toggleDislikeSong = async () => await api.post('/dislike');
export const getSongInfo = async () => {
  const { status, data } = await api.get<SongInfoSchema>('/song-info');
  if (status === 204) return null;
  return data;
};

// Queue Info
export const getQueue = async () => {
  const { status, data } = await api.get<QueueSchema>('/queue-info');
  if (status === 204) return null;
  return data;
};
