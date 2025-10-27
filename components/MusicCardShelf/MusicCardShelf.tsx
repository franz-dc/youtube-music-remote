import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Image, Platform, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  IconButton,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';

import { LIST_ITEM_PRESS_DELAY_MS, LONG_PRESS_DELAY_MS } from '@/constants';
import { useMediaQuery } from '@/hooks';
import { MusicCardShelfRendererObj, SearchResultSong } from '@/schemas';

import SearchResultItem from '../SearchResultItem';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  mainCardPressable: {
    borderTopLeftRadius: 8,
  },
  mainCardContainer: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    gap: 12,
    padding: 16,
  },
  albumArtContainer: {
    position: 'relative',
    overflow: 'hidden',
    width: 48,
    height: 48,
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
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    opacity: 0.5,
    fontSize: 16 * 0.875,
  },
  actionsContainer: {
    gap: 16,
    alignItems: 'center',
  },
  moreActionsButton: {
    position: 'absolute',
    right: 0,
  },
  subCardContainer: {
    paddingVertical: 8,
    borderBottomRightRadius: 8,
  },
  textContent: {
    marginVertical: 6,
    marginLeft: 16,
    opacity: 0.5,
    textTransform: 'uppercase',
  },
});

export type MusicCardShelfProps = MusicCardShelfRendererObj & {
  onSelect: (params: {
    videoId: string;
    action: 'play' | 'addToQueue' | 'playNext';
  }) => Promise<void>;
  onMoreActionsOpen: (params: SearchResultSong) => void;
};

const MusicCardShelf = ({
  title,
  subtitle,
  thumbnail,
  videoId,
  contents,
  onSelect,
  onMoreActionsOpen,
}: MusicCardShelfProps) => {
  const theme = useTheme();

  const { t } = useTranslation('translation');

  const mdUpRaw = useMediaQuery('md');

  const hasContents = contents.length > 0;
  const mdUp = mdUpRaw && hasContents;

  const [isLoading, setIsLoading] = useState(false);

  const playSong = async () => {
    try {
      setIsLoading(true);
      await onSelect({ videoId, action: 'play' });
    } finally {
      setIsLoading(false);
    }
  };

  const openMoreActions = () =>
    onMoreActionsOpen({
      title,
      subtitle,
      videoId,
      thumbnail,
    });

  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: mdUp ? 'row' : 'column',
        },
      ]}
    >
      <TouchableRipple
        onPress={playSong}
        onLongPress={openMoreActions}
        disabled={isLoading}
        style={[
          styles.mainCardPressable,
          {
            flex: mdUp ? 5 : undefined,
            maxWidth: mdUp ? 500 : undefined,
            borderTopRightRadius: mdUp ? 0 : 8,
            borderBottomLeftRadius: mdUp ? 8 : 0,
            backgroundColor: theme.colors.elevation.level3,
          },
          !hasContents && {
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          },
        ]}
        unstable_pressDelay={LIST_ITEM_PRESS_DELAY_MS}
        delayLongPress={LONG_PRESS_DELAY_MS}
      >
        <View style={styles.mainCardContainer}>
          <View
            style={{
              flexDirection: mdUp ? 'column' : 'row',
              alignItems: 'center',
              gap: mdUp ? 8 : 14,
            }}
          >
            <View
              style={[
                styles.albumArtContainer,
                {
                  backgroundColor: theme.dark ? '#000000' : '#ffffff',
                },
                mdUp && {
                  width: 96,
                  height: 96,
                },
              ]}
            >
              <Image
                source={{ uri: thumbnail }}
                style={[
                  styles.albumArt,
                  mdUp && {
                    width: 96,
                    height: 96,
                  },
                  isLoading && {
                    opacity: theme.dark ? 0.15 : 0.25,
                  },
                ]}
              />
              {isLoading && (
                <View
                  style={[
                    styles.albumArtPlayingIcon,
                    mdUp && {
                      transform: [{ translateX: -30 }, { translateY: -30 }],
                    },
                  ]}
                >
                  <ActivityIndicator animating size={mdUp ? 60 : 30} />
                </View>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.title,
                  {
                    paddingRight: mdUp ? 0 : 28,
                    color: theme.colors.onSurface,
                    fontSize: mdUp ? 16 : undefined,
                    textAlign: mdUp ? 'center' : 'left',
                  },
                ]}
                numberOfLines={mdUp ? undefined : 1}
              >
                {title}
              </Text>
              {subtitle && (
                <Text
                  style={[
                    styles.subtitle,
                    {
                      paddingRight: mdUp && hasContents ? 0 : 28,
                      textAlign: mdUp ? 'center' : 'left',
                    },
                  ]}
                  numberOfLines={mdUp ? undefined : 1}
                >
                  {subtitle}
                </Text>
              )}
            </View>
          </View>
          <View
            style={[
              styles.actionsContainer,
              !hasContents && { display: 'none' },
            ]}
          >
            <Button
              icon='play'
              mode='contained'
              buttonColor={theme.colors.onSurface}
              textColor={theme.colors.inverseOnSurface}
              contentStyle={{
                height: mdUp ? undefined : 32,
              }}
              labelStyle={{
                verticalAlign: 'middle',
                height: mdUp ? undefined : 24,
                // fix weird web text vertical alignment
                paddingTop: Platform.OS === 'web' ? 2 : 0,
              }}
              style={{
                width: '100%',
                maxWidth: mdUp ? 150 : undefined,
              }}
              disabled={isLoading}
              onPress={playSong}
            >
              {t('player.play')}
            </Button>
          </View>
          <IconButton
            accessibilityLabel={t('search.moreActions')}
            icon='dots-vertical'
            style={[
              styles.moreActionsButton,
              { top: mdUp ? 0 : 5 },
              !hasContents && {
                top: 16,
                // transform: [{ translateY: '50%' }],
              },
            ]}
            size={20}
            onPress={openMoreActions}
          />
        </View>
      </TouchableRipple>
      {hasContents && (
        <View
          style={[
            styles.subCardContainer,
            {
              flex: mdUp ? 7 : undefined,
              borderTopRightRadius: mdUp ? 8 : 0,
              borderBottomLeftRadius: mdUp ? 0 : 8,
              backgroundColor: theme.colors.elevation.level1,
            },
          ]}
        >
          {contents.map((content) => {
            switch (content.type) {
              case 'text': {
                return (
                  <Text key={content.label} style={styles.textContent}>
                    {content.label}
                  </Text>
                );
              }
              case 'song': {
                return (
                  <SearchResultItem
                    key={content.videoId}
                    onSelect={onSelect}
                    onMoreActionsOpen={onMoreActionsOpen}
                    {...content}
                  />
                );
              }
            }
          })}
        </View>
      )}
    </View>
  );
};

export default MusicCardShelf;
