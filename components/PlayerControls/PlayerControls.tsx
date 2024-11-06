import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';

import { SongInfoSchema } from '@/schemas';
import {
  playNextTrack,
  playPreviousTrack,
  switchRepeat,
  togglePlayPause,
  toggleShuffle,
} from '@/services';

import PlayerSeekBar from '../PlayerSeekBar';

type PlayerControlsProps = {
  songInfo: NonNullable<SongInfoSchema>;
};

const styles = StyleSheet.create({
  playerControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: -16,
    marginVertical: -8,
  },
  icon: {
    marginHorizontal: 0,
  },
});

const PlayerControls = ({ songInfo }: PlayerControlsProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'player' });

  const [isPlayingOptimistic, setIsPlayingOptimistic] = useState(false);

  useEffect(() => {
    setIsPlayingOptimistic(songInfo.isPaused);
  }, [songInfo]);

  const handlePlayPause = async () => {
    setIsPlayingOptimistic((prev) => !prev);
    await togglePlayPause();
  };

  return (
    <>
      <PlayerSeekBar songInfo={songInfo} isPlaying={isPlayingOptimistic} />
      <View style={styles.playerControlsContainer}>
        <IconButton
          icon='shuffle'
          size={32}
          onPress={toggleShuffle}
          accessibilityLabel={t('toggleShuffle')}
          style={styles.icon}
        />
        <IconButton
          icon='skip-previous'
          size={48}
          onPress={playPreviousTrack}
          accessibilityLabel={t('playPrevious')}
          style={styles.icon}
        />
        <IconButton
          icon={isPlayingOptimistic ? 'play-circle' : 'pause-circle'}
          size={88}
          animated
          onPress={handlePlayPause}
          accessibilityLabel={t(isPlayingOptimistic ? 'play' : 'pause')}
          style={styles.icon}
        />
        <IconButton
          icon='skip-next'
          size={48}
          onPress={playNextTrack}
          accessibilityLabel={t('playNext')}
          style={styles.icon}
        />
        <IconButton
          icon='repeat'
          size={32}
          onPress={switchRepeat}
          accessibilityLabel={t('switchRepeat')}
          style={styles.icon}
        />
      </View>
    </>
  );
};

export default PlayerControls;
