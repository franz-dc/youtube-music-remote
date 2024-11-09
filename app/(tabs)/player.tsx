import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ConnectionError,
  LoadingView,
  PlayerControls,
  PlayerExtraActions,
} from '@/components';
import { DOMINANT_COLOR_FALLBACK } from '@/constants';
import { useDominantColor, useNowPlaying, useSettings } from '@/hooks';

const styles = StyleSheet.create({
  linearGradient: {
    height: '100%',
    backgroundColor: DOMINANT_COLOR_FALLBACK,
  },
  container: {
    flex: 1,
    gap: 8,
    justifyContent: 'flex-end',
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  albumArt: {
    borderRadius: 16,
    margin: 'auto',
    // resizeMode: 'contain',
  },
  titleAndControlsContainer: {
    justifyContent: 'flex-end',
  },
  titleAndControlsContainerLandscape: {
    flex: 1,
  },
  titleContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 16 * 1.25,
    fontWeight: 'bold',
  },
  artist: {
    opacity: 0.5,
  },
});

const Player = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'player' });

  const { width, height } = useWindowDimensions();
  const albumArtWidth = Math.min(width - 64, height - 450);

  const { settings } = useSettings();

  const {
    data: songInfo,
    isLoading,
    isError,
    error,
    refetch,
  } = useNowPlaying();

  const { color: dominantColor, isBright: isDominantColorBright } =
    useDominantColor(songInfo?.imageSrc);
  const dominantColorGradientStart = dominantColor
    ? `${dominantColor}${isDominantColorBright ? '50' : 'ff'}`
    : DOMINANT_COLOR_FALLBACK;
  const dominantColorGradientEnd = dominantColor
    ? `${dominantColor}${isDominantColorBright ? '18' : '40'}`
    : DOMINANT_COLOR_FALLBACK;

  if (error?.message === 'Network Error')
    return <ConnectionError type='noConnection' onRetry={refetch} />;

  if (isLoading) return <LoadingView />;

  if (isError) return <ConnectionError type='serverError' onRetry={refetch} />;

  if (!songInfo) return <Text>{t('nothingIsPlaying')}</Text>;

  return (
    <LinearGradient
      colors={
        settings.showAlbumArtColor
          ? [dominantColorGradientStart, dominantColorGradientEnd]
          : [DOMINANT_COLOR_FALLBACK, DOMINANT_COLOR_FALLBACK]
      }
      style={styles.linearGradient}
    >
      <SafeAreaView style={styles.container}>
        {songInfo.imageSrc && (
          <Image
            style={[
              styles.albumArt,
              {
                width: albumArtWidth,
                height: albumArtWidth,
                maxWidth: height / 2,
                maxHeight: height / 2,
                display: height < 600 ? 'none' : 'flex',
              },
            ]}
            source={{ uri: songInfo.imageSrc }}
          />
        )}
        <View
          style={[
            styles.titleAndControlsContainer,
            height < 600 && styles.titleAndControlsContainerLandscape,
          ]}
        >
          <View style={styles.titleContainer}>
            <Text numberOfLines={1} style={styles.title}>
              {songInfo.title}
            </Text>
            <Text numberOfLines={1} variant='bodyLarge' style={styles.artist}>
              {songInfo.artist}
            </Text>
          </View>
          <PlayerControls songInfo={songInfo} />
          <PlayerExtraActions />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Player;
