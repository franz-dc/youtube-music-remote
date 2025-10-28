import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';

import { usePlay, useRepeat, useShuffle } from '@/hooks';
import { RepeatMode } from '@/schemas';
import { playNextTrack, playPreviousTrack, togglePlayPause } from '@/services';

const styles = StyleSheet.create({
  playerControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: -16,
    marginVertical: -20,
  },
  innerIcon: {
    marginHorizontal: -8,
  },
});

const repeatMap = {
  [RepeatMode.NONE]: {
    icon: 'repeat',
    label: 'repeatOff',
  },
  [RepeatMode.ALL]: {
    icon: 'repeat',
    label: 'repeatAll',
  },
  [RepeatMode.ONE]: {
    icon: 'repeat-once',
    label: 'repeatOne',
  },
};

const ShuffleButton = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'player' });

  const { isShuffle, toggleShuffle } = useShuffle();

  return (
    <IconButton
      icon='shuffle'
      size={28}
      onPress={toggleShuffle}
      accessibilityLabel={t('toggleShuffle')}
      style={{ opacity: isShuffle ? 1 : 0.5 }}
    />
  );
};

const PlayButton = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'player' });

  const { isPlaying } = usePlay();

  return (
    <IconButton
      icon={isPlaying ? 'pause-circle' : 'play-circle'}
      size={80}
      animated
      onPress={togglePlayPause}
      accessibilityLabel={t(isPlaying ? 'pause' : 'play')}
      style={styles.innerIcon}
    />
  );
};

const RepeatButton = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'player' });

  const { repeatMode, switchRepeat } = useRepeat();

  return (
    <IconButton
      icon={repeatMap[repeatMode || 'NONE'].icon}
      size={28}
      onPress={() => switchRepeat()}
      accessibilityLabel={t(repeatMap[repeatMode || 'NONE'].label)}
      style={{ opacity: repeatMode === 'NONE' ? 0.5 : 1 }}
    />
  );
};

const PlayerControls = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'player' });

  return (
    <View style={styles.playerControlsContainer}>
      <ShuffleButton />
      <IconButton
        icon='skip-previous'
        size={40}
        onPress={playPreviousTrack}
        accessibilityLabel={t('playPrevious')}
        style={styles.innerIcon}
      />
      <PlayButton />
      <IconButton
        icon='skip-next'
        size={40}
        onPress={playNextTrack}
        accessibilityLabel={t('playNext')}
        style={styles.innerIcon}
      />
      <RepeatButton />
    </View>
  );
};

export default PlayerControls;
