import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { useClientElapsedSeconds } from '@/hooks';
import { SongInfoSchema } from '@/schemas';
import { formatSecondsToDuration } from '@/utils';

import Slider from '../Slider';

export type PlayerSeekBarProps = {
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

  const { elapsedSeconds } = useClientElapsedSeconds({
    songInfo,
    isPlaying,
  });

  return (
    <View>
      <Slider
        style={styles.seekBar}
        value={elapsedSeconds / songInfo.songDuration || 0}
        step={0.001}
        // onValueChange={seek}
        accessibilityLabel={t('seek')}
      />
      <View style={styles.seekBarTime}>
        <Text variant='bodySmall'>
          {formatSecondsToDuration(elapsedSeconds)}
        </Text>
        <Text variant='bodySmall'>
          {formatSecondsToDuration(songInfo.songDuration)}
        </Text>
      </View>
    </View>
  );
};

export default PlayerSeekBar;
