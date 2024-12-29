import Color from 'color';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';

import { PlaylistPanelVideoRenderer } from '@/schemas';

export type SongListItemProps = {
  song: PlaylistPanelVideoRenderer;
};

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  albumArtContainer: {
    position: 'relative',
    width: 48,
    height: 48,
    overflow: 'hidden',
    borderRadius: 4,
  },
  albumArt: {
    width: 48,
    height: 48,
  },
  albumArtPlaying: {
    opacity: 0.15,
  },
  albumArtPlayingIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
  },
  songTextContainer: {
    flex: 1,
    gap: 1,
  },
  title: {
    fontWeight: 'bold',
  },
  artist: {
    opacity: 0.5,
    fontSize: 16 * 0.875,
  },
});

const QueueListItem = ({ song }: SongListItemProps) => {
  const theme = useTheme();

  const { t } = useTranslation('translation', { keyPrefix: 'queue' });

  const smallestThumbnailUrl = song.thumbnail.thumbnails[0].url;
  const title = song.title.runs[0].text ?? t('unknownTitle');
  const artist = song.shortBylineText.runs[0].text ?? t('unknownChannel');
  const isPlaying = song.selected;

  const activeBackgroundColor = Color(theme.colors.onSurface)
    .fade(0.9)
    .string();

  return (
    <View
      style={[
        styles.listItemContainer,
        isPlaying && {
          backgroundColor: activeBackgroundColor,
        },
      ]}
    >
      <View
        style={[
          styles.albumArtContainer,
          { backgroundColor: theme.dark ? '#000000' : '#ffffff' },
        ]}
      >
        <Image
          source={{ uri: smallestThumbnailUrl }}
          style={[
            styles.albumArt,
            isPlaying && {
              opacity: theme.dark ? 0.15 : 0.25,
            },
          ]}
        />
        {isPlaying && (
          <>
            <View style={styles.albumArtPlayingIcon}>
              <Icon
                source='equalizer'
                size={30}
                color={theme.colors.onSurface}
              />
            </View>
          </>
        )}
      </View>
      <View style={styles.songTextContainer}>
        <Text
          numberOfLines={1}
          style={[styles.title, isPlaying && { color: theme.colors.primary }]}
        >
          {title}
        </Text>
        <Text numberOfLines={1} style={styles.artist}>
          {artist}
        </Text>
      </View>
    </View>
  );
};

export default QueueListItem;
