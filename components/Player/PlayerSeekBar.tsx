import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { useNowPlayingElapsedSeconds } from '@/hooks';
import { SongInfoSchema } from '@/schemas';
import { seek } from '@/services';
import { formatSecondsToDuration } from '@/utils';

import Slider from '../Slider';

export type PlayerSeekBarProps = {
  songInfo: NonNullable<SongInfoSchema>;
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

const PlayerSeekBar = ({ songInfo }: PlayerSeekBarProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'player' });

  const { elapsedSeconds, seekBarValue, setSeekBarValue } =
    useNowPlayingElapsedSeconds();

  const seekSeconds = async (value: number) => {
    const seekValue = Math.round(value * songInfo.songDuration);

    // Web jitter reduction fix: Do not update if new value is just within
    // threshold (1 second) from current server elapsed seconds
    if (Platform.OS === 'web') {
      if (Math.abs(elapsedSeconds - seekValue) <= 1) return;
    }

    setSeekBarValue(value);
    await seek(seekValue);
  };

  return (
    <View>
      <Slider
        style={styles.seekBar}
        value={seekBarValue}
        step={0.001}
        onValueChange={seekSeconds}
        hitSlop={10}
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
