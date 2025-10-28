import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';

import { useSettingAtom } from '@/configs';
import { MINI_PLAYER_ALBUM_ART_WIDTH } from '@/constants';
import { useNowPlayingElapsedSeconds, usePlay } from '@/hooks';
import { SongInfoSchema } from '@/schemas';
import { playNextTrack, playPreviousTrack, togglePlayPause } from '@/services';

export type MiniPlayerProps = {
  songInfo: NonNullable<SongInfoSchema>;
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    height: '100%',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  progressBarMinimumTrack: {
    height: 2,
  },
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

const PlayButton = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'player' });

  const { isPlaying } = usePlay();

  return (
    <IconButton
      icon={isPlaying ? 'pause' : 'play'}
      size={30}
      onPress={togglePlayPause}
      accessibilityLabel={t(isPlaying ? 'pause' : 'play')}
      style={styles.innerIcon}
    />
  );
};

const MiniPlayer = ({ songInfo }: MiniPlayerProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'player' });

  const theme = useTheme();

  const { elapsedSeconds } = useNowPlayingElapsedSeconds();

  const [showAlbumArtColor] = useSettingAtom('showAlbumArtColor');

  // FIXME: Buttons are still pressable when the player is maximized

  return (
    <View
      style={[
        styles.container,
        (!showAlbumArtColor || !theme.dark) && {
          backgroundColor: theme.colors.elevation.level4,
        },
      ]}
    >
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressBarMinimumTrack,
            {
              backgroundColor: theme.colors.onSurface,
              width: `${(elapsedSeconds / songInfo.songDuration || 0) * 100}%`,
            },
          ]}
        />
      </View>
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
        <PlayButton />
        <IconButton
          icon='skip-next'
          size={30}
          onPress={playNextTrack}
          accessibilityLabel={t('playNext')}
        />
      </View>
    </View>
  );
};
export default MiniPlayer;
