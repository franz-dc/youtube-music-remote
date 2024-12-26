import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';

import { useRepeat } from '@/hooks';
import { playNextTrack, playPreviousTrack, toggleShuffle } from '@/services';

export type PlayerControlsProps = {
  isPlaying: boolean;
  onPlayPause: () => void;
};

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

const repeatIconMap = {
  NONE: 'repeat',
  ALL: 'repeat',
  ONE: 'repeat-once',
};

const repeatLabelMap = {
  NONE: 'repeatOff',
  ALL: 'repeatAll',
  ONE: 'repeatOne',
};

const PlayerControls = ({ isPlaying, onPlayPause }: PlayerControlsProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'player' });

  const { repeatMode, switchRepeat } = useRepeat();

  return (
    <View style={styles.playerControlsContainer}>
      <IconButton
        icon='shuffle'
        size={28}
        onPress={toggleShuffle}
        accessibilityLabel={t('toggleShuffle')}
      />
      <IconButton
        icon='skip-previous'
        size={40}
        onPress={playPreviousTrack}
        accessibilityLabel={t('playPrevious')}
        style={styles.innerIcon}
      />
      <IconButton
        icon={isPlaying ? 'pause-circle' : 'play-circle'}
        size={80}
        animated
        onPress={onPlayPause}
        accessibilityLabel={t(isPlaying ? 'pause' : 'play')}
        style={styles.innerIcon}
      />
      <IconButton
        icon='skip-next'
        size={40}
        onPress={playNextTrack}
        accessibilityLabel={t('playNext')}
        style={styles.innerIcon}
      />
      <IconButton
        icon={repeatIconMap[repeatMode || 'NONE']}
        size={28}
        onPress={() => switchRepeat()}
        accessibilityLabel={t(repeatLabelMap[repeatMode || 'NONE'])}
        style={{ opacity: repeatMode === 'NONE' ? 0.5 : 1 }}
      />
    </View>
  );
};

export default PlayerControls;
