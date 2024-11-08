import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';

import { QueueSchema } from '@/schemas';

export type SongListItemProps = {
  song: QueueSchema['items'][0]['playlistPanelVideoRenderer'];
};

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  isPlayingListItemContainer: {
    backgroundColor: '#ffffff0d',
  },
  albumArtContainer: {
    position: 'relative',
    width: 48,
    height: 48,
    overflow: 'hidden',
    backgroundColor: '#000000',
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

  return (
    <View
      style={[
        styles.listItemContainer,
        isPlaying && styles.isPlayingListItemContainer,
      ]}
    >
      <View style={styles.albumArtContainer}>
        <Image
          source={{ uri: smallestThumbnailUrl }}
          style={[styles.albumArt, isPlaying && styles.albumArtPlaying]}
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
