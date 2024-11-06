import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { usePrevious } from '@/hooks';
import { SongInfoSchema } from '@/schemas';
import { formatSecondsToDuration } from '@/utils';

import Slider from '../Slider';

type PlayerSeekBarProps = {
  songInfo: NonNullable<SongInfoSchema>;
  isPlaying: boolean;
};

const styles = StyleSheet.create({
  seekBar: {
    marginBottom: 2,
  },
  seekBarTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    opacity: 0.5,
  },
});

// TODO: Use this once https://github.com/th-ch/youtube-music/pull/2577 is released
// const ELAPSED_SECONDS_INACCURACY_THRESHOLD = 3;

const PlayerSeekBar = ({ songInfo, isPlaying }: PlayerSeekBarProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'player' });

  const [clientElapsedSeconds, setClientElapsedSeconds] = useState<number>(0);

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
      setClientElapsedSeconds(songInfo.elapsedSeconds);
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
      setClientElapsedSeconds((prev) => prev + 1);
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

  return (
    <View>
      <Slider
        style={styles.seekBar}
        value={clientElapsedSeconds / songInfo.songDuration || 0}
        step={0.001}
        // onValueChange={seek}
        accessibilityLabel={t('seek')}
      />
      <View style={styles.seekBarTime}>
        <Text variant='bodySmall'>
          {formatSecondsToDuration(clientElapsedSeconds)}
        </Text>
        <Text variant='bodySmall'>
          {formatSecondsToDuration(songInfo.songDuration)}
        </Text>
      </View>
    </View>
  );
};

export default PlayerSeekBar;
