import { useEffect, useState } from 'react';

import { SongInfoSchema } from '@/schemas';

import { usePrevious } from './usePrevious';

export const useClientElapsedSeconds = ({
  songInfo,
  isPlaying,
}: {
  songInfo: NonNullable<SongInfoSchema>;
  isPlaying: boolean;
}) => {
  const [clientElapsedSeconds, setClientElapsedSeconds] = useState<number>(
    songInfo.elapsedSeconds
  );

  const prevSongId = usePrevious(songInfo.videoId);
  const songId = songInfo.videoId;
  const prevIsPlaying = usePrevious(isPlaying);
  const prevElapsedSeconds = usePrevious(songInfo.elapsedSeconds);
  const elapsedSeconds = songInfo.elapsedSeconds;

  useEffect(() => {
    if (prevSongId !== songId) {
      setClientElapsedSeconds(0);
    }
    if (
      prevIsPlaying !== isPlaying ||
      prevElapsedSeconds !== elapsedSeconds
      // TODO: Remove line above and replace with the line below
      // Math.abs(clientElapsedSeconds - elapsedSeconds) > ELAPSED_SECONDS_INACCURACY_THRESHOLD
    ) {
      // If the song is paused/resumed, update the client elapsed seconds after
      // a delay (due to race conditions with the server).
      const timeout = setTimeout(() => {
        setClientElapsedSeconds(songInfo.elapsedSeconds);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [
    songInfo,
    prevSongId,
    songId,
    prevIsPlaying,
    isPlaying,
    prevElapsedSeconds,
    elapsedSeconds,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (songInfo.isPaused) return;
      setClientElapsedSeconds((prev) =>
        Math.min(prev + 1, songInfo.songDuration)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [songInfo]);

  // TODO: Implement seek
  // For now, the seek bar is read-only due to the lack of an absolute seek API.
  // This causes issues as `/go-back` and `/go-forward` are relative seek APIs.
  // This works fine for tapping on the seek bar but not for dragging.
  // const seek = async (sliderValue: number) => {
  //   // Slider returns a value between 0 and 1 so it needs to be multiplied by
  //   // the song duration to get the actual seconds
  //   const seconds = Math.floor(sliderValue * songInfo.songDuration);

  //   // update optimistically (no need to wait for the server)
  //   seekSeconds(seconds - songInfo.elapsedSeconds);
  //   setClientElapsedSeconds(seconds);
  // };

  return {
    elapsedSeconds: clientElapsedSeconds,
    // seek,
  };
};
