import { useEffect, useRef, useState } from 'react';

import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { Icon, IconButton, Text, useTheme } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSettingAtom } from '@/configs';
import {
  ANIMATION_CONFIGS,
  DOMINANT_COLOR_FALLBACK,
  MINI_PLAYER_ALBUM_ART_WIDTH,
  MINI_PLAYER_HEIGHT,
  MORE_ICON,
} from '@/constants';
import {
  useBottomSheetBackHandler,
  useDominantColor,
  useNowPlaying,
} from '@/hooks';
import { pause, togglePlayPause } from '@/services';

import InfoView from '../InfoView';

import MiniPlayer from './MiniPlayer';
import PlayerControls from './PlayerControls';
import PlayerExtraActions from './PlayerExtraActions';
import PlayerMenu, { PlayerMenuMethods } from './PlayerMenu';
import PlayerSeekBar from './PlayerSeekBar';
import SleepTimerMenu, { SleepTimerMenuMethods } from './SleepTimerMenu';

const PLAYER_HORIZONTAL_PADDING = 24;
const MINI_PLAYER_VISIBILITY_THRESHOLD = 0.8;
const PLAYER_VISIBILITY_THRESHOLD = 0.2;
const styles = StyleSheet.create({
  linearGradient: {
    height: '100%',
  },
  container: {
    flex: 1,
    // gap: 8,
    justifyContent: 'flex-end',
    paddingHorizontal: PLAYER_HORIZONTAL_PADDING,
    paddingBottom: 24,
    zIndex: 0,
  },
  albumArtContainer: {
    position: 'relative',
    // with app bar controls
    flex: 1,
    height: '100%',
  },
  albumArt: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    borderRadius: 16,
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
  bottomSheetView: {
    position: 'relative',
    flex: 1,
  },
  miniPlayerPressableContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: MINI_PLAYER_HEIGHT,
    flex: 1,
    // padding: 16,
    alignItems: 'center',
  },
  miniPlayerPressable: {
    width: '100%',
    height: '100%',
  },
  playerAppBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -18, // icon edge alignment
    paddingVertical: 0,
  },
});

const Player = () => {
  const theme = useTheme();
  const backgroundColor =
    DOMINANT_COLOR_FALLBACK[theme.dark ? 'dark' : 'light'];

  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();

  const { t } = useTranslation('translation', { keyPrefix: 'player' });

  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;
  const albumArtWidth = Math.min(
    width - PLAYER_HORIZONTAL_PADDING * 2,
    height - 450,
    height / 2
  );

  const [showAlbumArtColor] = useSettingAtom('showAlbumArtColor');

  const { data: songInfo, isLoading, isError } = useNowPlaying();

  const [isPlayingOptimistic, setIsPlayingOptimistic] = useState(false);

  useEffect(() => {
    setIsPlayingOptimistic(songInfo ? !songInfo.isPaused : false);
  }, [songInfo]);

  const handlePlayPause = async () => {
    setIsPlayingOptimistic((prev) => !prev);
    await togglePlayPause();
  };

  const handlePause = async () => {
    setIsPlayingOptimistic(false);
    await pause();
  };

  // TODO: Use right gradient colors for light theme
  const { color: dominantColor, isBright: isDominantColorBright } =
    useDominantColor(songInfo?.imageSrc);
  const dominantColorGradientStart = dominantColor
    ? `${dominantColor}${isDominantColorBright ? '50' : 'ff'}`
    : backgroundColor;
  const dominantColorGradientEnd = dominantColor
    ? `${dominantColor}${isDominantColorBright ? '18' : '40'}`
    : backgroundColor;

  // bottom sheet modal - player
  const bottomSheetRef = useRef<BottomSheet>(null);
  const minimizePlayer = () => bottomSheetRef.current?.snapToIndex(0);
  const maximizePlayer = () => bottomSheetRef.current?.snapToIndex(1);

  const snapPoints = [MINI_PLAYER_HEIGHT + bottomInset, '100%'];
  const animatedPosition = useSharedValue(0);
  const animatedIndex = useSharedValue(0);
  const heightForPosition =
    height + (isPortrait ? topInset : 0) - MINI_PLAYER_HEIGHT;

  // Linear scale opacity relative to PLAYER_VISIBILITY_THRESHOLD and 1.
  // Overshoots in opacity are ignored as it won't error out.
  const miniPlayerOpacityStyle = useAnimatedStyle(() => ({
    opacity:
      (animatedPosition.value / heightForPosition -
        MINI_PLAYER_VISIBILITY_THRESHOLD) /
      (1 - MINI_PLAYER_VISIBILITY_THRESHOLD),
  }));
  const playerOpacityStyle = useAnimatedStyle(() => ({
    opacity:
      1 -
      animatedPosition.value /
        heightForPosition /
        (1 - PLAYER_VISIBILITY_THRESHOLD),
  }));

  const miniPlayerZIndexStyle = useAnimatedStyle(() => ({
    zIndex: animatedIndex.value === 0 ? 0 : -10,
  }));
  const playerZIndexStyle = useAnimatedStyle(() => ({
    zIndex: animatedIndex.value === 1 ? 0 : -10,
  }));

  const isNotPlaying = isLoading || isError || !songInfo;

  const playerMenuRef = useRef<PlayerMenuMethods>(null);
  const handleMenuPress = () => playerMenuRef.current?.show();

  const sleepTimerMenuRef = useRef<SleepTimerMenuMethods>(null);
  const handleSleepTimerMenuOpen = () => sleepTimerMenuRef.current?.show();

  const { handleSheetPositionChange } =
    useBottomSheetBackHandler(bottomSheetRef);

  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetPositionChange}
        animationConfigs={ANIMATION_CONFIGS}
        animatedIndex={animatedIndex}
        animatedPosition={animatedPosition}
        handleIndicatorStyle={{ backgroundColor: theme.colors.onSurface }}
        handleComponent={null}
        snapPoints={snapPoints}
        enableOverDrag={false}
        style={{ backgroundColor: theme.colors.elevation.level4 }}
        backgroundStyle={{ backgroundColor: theme.colors.elevation.level4 }}
        // Slider fix - https://github.com/gorhom/react-native-bottom-sheet/issues/372
        activeOffsetY={[-1, 1]}
        failOffsetX={[-7, 7]}
      >
        <BottomSheetView style={styles.bottomSheetView}>
          <LinearGradient
            colors={
              showAlbumArtColor
                ? [dominantColorGradientStart, dominantColorGradientEnd]
                : [backgroundColor, backgroundColor]
            }
            style={[
              styles.linearGradient,
              { backgroundColor, paddingBottom: bottomInset },
            ]}
          >
            <View style={[styles.container, { paddingTop: topInset }]}>
              <Animated.View
                style={[
                  styles.miniPlayerPressableContainer,
                  miniPlayerOpacityStyle,
                  miniPlayerZIndexStyle,
                ]}
              >
                <Pressable
                  onPress={maximizePlayer}
                  style={styles.miniPlayerPressable}
                  accessibilityLabel={t('player.maximizePlayer')}
                >
                  {isNotPlaying ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 12,
                        width: '100%',
                        height: '100%',
                        paddingVertical: 10,
                        paddingHorizontal: 16,
                        alignItems: 'center',
                      }}
                    >
                      <Icon
                        source='music-off'
                        size={MINI_PLAYER_ALBUM_ART_WIDTH * 0.75}
                      />
                      <Text>{t('nothingIsPlaying')}</Text>
                    </View>
                  ) : (
                    <MiniPlayer
                      songInfo={songInfo}
                      isPlaying={isPlayingOptimistic}
                      onPlayPause={handlePlayPause}
                    />
                  )}
                </Pressable>
              </Animated.View>
              {isNotPlaying ? (
                <Animated.View
                  style={[playerOpacityStyle, playerZIndexStyle, { flex: 1 }]}
                >
                  <View style={styles.playerAppBar}>
                    <IconButton
                      icon='chevron-down'
                      size={24}
                      onPress={minimizePlayer}
                      accessibilityLabel={t('player.minimizePlayer')}
                    />
                  </View>
                  <InfoView
                    title={t('nothingIsPlaying')}
                    message={t('nothingIsPlayingMessage')}
                    icon='music-off'
                    style={{ marginTop: topInset }}
                  />
                </Animated.View>
              ) : (
                <>
                  <Animated.View
                    style={[
                      styles.albumArtContainer,
                      playerOpacityStyle,
                      playerZIndexStyle,
                    ]}
                  >
                    <View style={styles.playerAppBar}>
                      <IconButton
                        icon='chevron-down'
                        size={24}
                        onPress={minimizePlayer}
                        accessibilityLabel={t('player.minimizePlayer')}
                      />
                      <IconButton
                        icon={MORE_ICON}
                        size={24}
                        onPress={handleMenuPress}
                      />
                    </View>
                    {songInfo.imageSrc && (
                      <Image
                        style={[
                          styles.albumArt,
                          {
                            display: height < 600 ? 'none' : 'flex',
                            width: albumArtWidth,
                            height: albumArtWidth,
                            maxWidth: height / 2,
                            maxHeight: height / 2,
                            transform: [
                              { translateX: -albumArtWidth / 2 },
                              { translateY: -albumArtWidth / 2 },
                            ],
                          },
                        ]}
                        source={{ uri: songInfo.imageSrc }}
                      />
                    )}
                  </Animated.View>
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
                      <Text
                        numberOfLines={1}
                        variant='bodyLarge'
                        style={styles.artist}
                      >
                        {songInfo.artist}
                      </Text>
                    </View>
                    <PlayerSeekBar
                      songInfo={songInfo}
                      isPlaying={isPlayingOptimistic}
                    />
                    <PlayerControls
                      isPlaying={isPlayingOptimistic}
                      onPlayPause={handlePlayPause}
                    />
                    <PlayerExtraActions />
                  </View>
                </>
              )}
            </View>
          </LinearGradient>
        </BottomSheetView>
      </BottomSheet>
      {!!songInfo && (
        <>
          <PlayerMenu
            ref={playerMenuRef}
            songInfo={songInfo}
            onSleepTimerMenuOpen={handleSleepTimerMenuOpen}
            onPause={handlePause}
          />
          <SleepTimerMenu ref={sleepTimerMenuRef} />
        </>
      )}
    </>
  );
};

export default Player;
