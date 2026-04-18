import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import {
  pendingSeekSecondsAtom,
  queryClient,
  seekInFlightUntilAtom,
  store,
} from '@/configs';
import { useNowPlayingElapsedSeconds } from '@/hooks';
import { SongInfoSchema } from '@/schemas';
import { seek } from '@/services';
import { formatSecondsToDuration, isWithinSeekTolerance } from '@/utils';

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

const SEEK_GRACE_PERIOD_MS = 2500;

const PlayerSeekBar = ({ songInfo }: PlayerSeekBarProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'player' });

  const { elapsedSeconds, seekBarValue, setSeekBarValue } =
    useNowPlayingElapsedSeconds();
  const [, setSeekInFlightUntil] = useAtom(seekInFlightUntilAtom);
  const [, setPendingSeekSeconds] = useAtom(pendingSeekSecondsAtom);

  const seekSeconds = async (value: number) => {
    const seekValue = Math.round(value * songInfo.songDuration);

    // Web jitter reduction fix: Do not update if new value is just within
    // threshold (1 second) from current server elapsed seconds
    if (Platform.OS === 'web') {
      if (isWithinSeekTolerance(elapsedSeconds, seekValue)) return;
    }

    setSeekBarValue(value);
    setPendingSeekSeconds(seekValue);
    const seekExpiry = Date.now() + SEEK_GRACE_PERIOD_MS;
    setSeekInFlightUntil(seekExpiry);
    queryClient.setQueryData(['nowPlayingElapsedSeconds'], () => seekValue);
    setTimeout(() => {
      if (store.get(seekInFlightUntilAtom) !== seekExpiry) return;
      store.set(seekInFlightUntilAtom, 0);
      store.set(pendingSeekSecondsAtom, null);
    }, SEEK_GRACE_PERIOD_MS);
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
