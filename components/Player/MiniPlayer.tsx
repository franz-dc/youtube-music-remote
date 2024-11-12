import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

import { MINI_PLAYER_HEIGHT } from '@/constants';
import { SongInfoSchema } from '@/schemas';
import { playNextTrack, playPreviousTrack } from '@/services';

export type MiniPlayerProps = {
  songInfo: NonNullable<SongInfoSchema>;
  isPlaying: boolean;
  onPlayPause: () => void;
};

const MINI_PLAYER_ALBUM_ART_WIDTH = MINI_PLAYER_HEIGHT - 20; // 10 vertical padding

const styles = StyleSheet.create({
  albumArt: {
    width: MINI_PLAYER_ALBUM_ART_WIDTH,
    height: MINI_PLAYER_ALBUM_ART_WIDTH,
    borderRadius: 4,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  artist: {
    opacity: 0.5,
    fontSize: 16 * 0.875,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: -20,
  },
  innerIcon: {
    marginHorizontal: -8,
  },
});

const MiniPlayer = ({ songInfo, isPlaying, onPlayPause }: MiniPlayerProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'player' });

  // TODO: Progress bar

  return (
    <>
      {songInfo.imageSrc && (
        <Image style={styles.albumArt} source={{ uri: songInfo.imageSrc }} />
      )}
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.title}>
          {songInfo.title}
        </Text>
        <Text numberOfLines={1} style={styles.artist}>
          {songInfo.artist}
        </Text>
      </View>
      <View style={styles.controlsContainer}>
        <IconButton
          icon='skip-previous'
          size={30}
          onPress={playPreviousTrack}
          accessibilityLabel={t('playPrevious')}
        />
        <IconButton
          icon={isPlaying ? 'play' : 'pause'}
          size={30}
          onPress={onPlayPause}
          accessibilityLabel={t(isPlaying ? 'play' : 'pause')}
          style={styles.innerIcon}
        />
        <IconButton
          icon='skip-next'
          size={30}
          onPress={playNextTrack}
          accessibilityLabel={t('playNext')}
        />
      </View>
    </>
  );
};
export default MiniPlayer;
