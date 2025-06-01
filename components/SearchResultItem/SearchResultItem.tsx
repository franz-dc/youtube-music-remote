import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  IconButton,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';

import { LIST_ITEM_PRESS_DELAY_MS, LONG_PRESS_DELAY_MS } from '@/constants';
import { SearchResultSong } from '@/schemas';

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
  subtitle: {
    opacity: 0.5,
    fontSize: 16 * 0.875,
  },
});

export type SearchResultItemProps = SearchResultSong & {
  onSelect: (params: {
    videoId: string;
    action: 'play' | 'addToQueue' | 'playNext';
  }) => Promise<void>;
  onMoreActionsOpen: (params: SearchResultSong) => void;
};

const SearchResultItem = ({
  title,
  subtitle,
  videoId,
  thumbnail,
  onSelect,
  onMoreActionsOpen,
}: SearchResultItemProps) => {
  const theme = useTheme();

  const { t } = useTranslation('translation', { keyPrefix: 'search' });

  subtitle ??= subtitle || t('unknownArtist');

  const [isLoading, setIsLoading] = useState(false);

  const playSong = async () => {
    try {
      setIsLoading(true);
      await onSelect({ videoId, action: 'play' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoreActionsOpen = () => {
    onMoreActionsOpen({ title, subtitle, videoId, thumbnail });
  };

  return (
    <TouchableRipple
      onPress={playSong}
      onLongPress={handleMoreActionsOpen}
      disabled={isLoading}
      unstable_pressDelay={LIST_ITEM_PRESS_DELAY_MS}
      delayLongPress={LONG_PRESS_DELAY_MS}
    >
      <View style={styles.listItemContainer}>
        <View
          style={[
            styles.albumArtContainer,
            { backgroundColor: theme.dark ? '#000000' : '#ffffff' },
          ]}
        >
          <Image
            source={{ uri: thumbnail }}
            style={[
              styles.albumArt,
              isLoading && {
                opacity: theme.dark ? 0.15 : 0.25,
              },
            ]}
          />
          {isLoading && (
            <View style={styles.albumArtPlayingIcon}>
              <ActivityIndicator animating size={30} />
            </View>
          )}
        </View>
        <View style={styles.songTextContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        </View>
        <IconButton
          accessibilityLabel={t('search.moreActions')}
          icon='dots-vertical'
          style={{ marginRight: -8 }}
          size={20}
          onPress={handleMoreActionsOpen}
          disabled={isLoading}
        />
      </View>
    </TouchableRipple>
  );
};

export default SearchResultItem;
