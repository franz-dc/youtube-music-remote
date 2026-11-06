import { useQueryClient } from '@tanstack/react-query';
import Color from 'color';
import { useTranslation } from 'react-i18next';
import { GestureResponderEvent, Image, StyleSheet, View } from 'react-native';
import { DraxHandle } from 'react-native-drax';
import { Icon, Text, TouchableRipple, useTheme } from 'react-native-paper';

import { LIST_ITEM_PRESS_DELAY_MS, LONG_PRESS_DELAY_MS } from '@/constants';
import {
  PlaylistPanelVideoRenderer,
  QueueSchema,
  SearchResultSong,
} from '@/schemas';
import { changeActiveSongInQueue } from '@/services';

export type SongListItemProps = {
  song: PlaylistPanelVideoRenderer;
  index: number;
  resolveIndexAtPosition: (
    pageY: number,
    fallbackIndex: number
  ) => Promise<number>;
  onMoreActionsOpen: (params: SearchResultSong & { index: number }) => void;
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

const QueueListItem = ({
  song,
  index,
  resolveIndexAtPosition,
  onMoreActionsOpen,
}: SongListItemProps) => {
  const theme = useTheme();

  const { t } = useTranslation('translation', { keyPrefix: 'queue' });

  const smallestThumbnailUrl = song.thumbnail.thumbnails[0].url;
  const title = song.title.runs?.[0].text ?? t('unknownTitle');
  const artist = song.shortBylineText.runs?.[0].text ?? t('unknownArtist');
  const isPlaying = song.selected;

  const activeBackgroundColor = Color(theme.colors.onSurface)
    .fade(0.9)
    .string();

  const queryClient = useQueryClient();

  const playSelectedSong = async (event: GestureResponderEvent) => {
    if (isPlaying) return;

    const currentQueue = queryClient.getQueryData<QueueSchema>(['queue']);
    // Resolve the index from where the user pressed. While a reorder is being
    // applied, the rendered `index` prop can point at a different row than the
    // one on screen.
    const queueIndex = await resolveIndexAtPosition(
      event.nativeEvent.pageY,
      index
    );

    // Optimistically update the queue due to delay
    queryClient.setQueryData<QueueSchema>(['queue'], (data) => {
      if (!data) return data;

      return {
        ...data,
        items: data.items.map((item, itemIdx) => {
          if (item.playlistPanelVideoWrapperRenderer) {
            return {
              ...item,
              playlistPanelVideoWrapperRenderer: {
                ...item.playlistPanelVideoWrapperRenderer,
                primaryRenderer: {
                  ...item.playlistPanelVideoWrapperRenderer.primaryRenderer,
                  playlistPanelVideoRenderer: {
                    ...item.playlistPanelVideoWrapperRenderer.primaryRenderer
                      .playlistPanelVideoRenderer,
                    selected: itemIdx === queueIndex,
                  },
                },
              },
            };
          }

          if (item.playlistPanelVideoRenderer) {
            return {
              ...item,
              playlistPanelVideoRenderer: {
                ...item.playlistPanelVideoRenderer,
                selected: itemIdx === queueIndex,
              },
            };
          }
        }) as QueueSchema['items'],
      };
    });

    try {
      await changeActiveSongInQueue(queueIndex);
    } catch {
      queryClient.setQueryData<QueueSchema>(['queue'], currentQueue);
    }
  };

  const handleMoreActionsOpen = async (event: GestureResponderEvent) => {
    const queueIndex = await resolveIndexAtPosition(
      event.nativeEvent.pageY,
      index
    );

    onMoreActionsOpen({
      title,
      subtitle: artist,
      thumbnail: smallestThumbnailUrl,
      videoId: song.videoId,
      index: queueIndex,
    });
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          // gap: 14,
          backgroundColor: theme.colors.surface,
        }}
      >
        <TouchableRipple
          onPress={playSelectedSong}
          onLongPress={handleMoreActionsOpen}
          unstable_pressDelay={LIST_ITEM_PRESS_DELAY_MS}
          delayLongPress={LONG_PRESS_DELAY_MS}
          style={[
            styles.listItemContainer,
            { flex: 1 },
            isPlaying && {
              backgroundColor: activeBackgroundColor,
            },
          ]}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              flex: 1,
            }}
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
                style={[
                  styles.title,
                  isPlaying && { color: theme.colors.primary },
                ]}
              >
                {title}
              </Text>
              <Text numberOfLines={1} style={styles.artist}>
                {artist}
              </Text>
            </View>
          </View>
        </TouchableRipple>
        <DraxHandle
          style={{
            justifyContent: 'center',
            paddingHorizontal: 16,
            paddingVertical: 20,
            ...(isPlaying && {
              backgroundColor: activeBackgroundColor,
            }),
          }}
        >
          <Icon
            source='drag-horizontal-variant'
            size={24}
            color={theme.colors.onSurface}
          />
        </DraxHandle>
      </View>
    </>
  );
};

export default QueueListItem;
