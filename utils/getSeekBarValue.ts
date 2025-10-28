import { queryClient } from '@/configs';
import { SongInfoSchema } from '@/schemas';

const roundSeekBarValue = (num: number) => {
  return Math.round(num * 1000) / 1000;
};

export const getSeekBarValue = () => {
  const elapsedSeconds =
    queryClient.getQueryData<number>(['nowPlayingElapsedSeconds']) || 0;
  const duration =
    queryClient.getQueryData<SongInfoSchema>(['nowPlaying'])?.songDuration || 1;
  return roundSeekBarValue(elapsedSeconds / duration);
};
