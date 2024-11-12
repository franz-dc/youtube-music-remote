import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';

import {
  playNextTrack,
  playPreviousTrack,
  switchRepeat,
  toggleShuffle,
} from '@/services';

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
    marginVertical: -8,
  },
  innerIcon: {
    marginHorizontal: -8,
  },
});

const PlayerControls = ({ isPlaying, onPlayPause }: PlayerControlsProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'player' });

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
        icon={isPlaying ? 'play-circle' : 'pause-circle'}
        size={80}
        animated
        onPress={onPlayPause}
        accessibilityLabel={t(isPlaying ? 'play' : 'pause')}
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
        icon='repeat'
        size={28}
        onPress={switchRepeat}
        accessibilityLabel={t('switchRepeat')}
      />
    </View>
  );
};

export default PlayerControls;
