import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
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

  const { data: elapsedSeconds = 0 } = useNowPlayingElapsedSeconds();

  const queryClient = useQueryClient();

  const seekSeconds = async (value: number) => {
    const seekValue = Math.round(value * songInfo.songDuration);
    // optimistic update elapsedSeconds to avoid seek lag or jumps
    queryClient.setQueryData(['nowPlayingElapsedSeconds'], seekValue);
    await seek(seekValue);
  };

  return (
    <View>
      <Slider
        style={styles.seekBar}
        value={elapsedSeconds / songInfo.songDuration || 0}
        step={0.001}
        onValueChange={seekSeconds}
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
