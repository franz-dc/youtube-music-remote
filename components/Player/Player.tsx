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
import SongDetails from './SongDetails';

const PLAYER_PADDING = 24;
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
    paddingHorizontal: PLAYER_PADDING,
    paddingBottom: PLAYER_PADDING,
    zIndex: 0,
  },
  albumArtContainer: {
    // with app bar controls
    position: 'relative',
    flex: 1,
    flexDirection: 'row',
    gap: PLAYER_PADDING,
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumArtWrapper: {
    flex: 1,
  },
  albumArt: {
    // Consider app bar height as inset as it visually looks like blank space.
    // Remove it if something will be placed in the middle of the player top
    // bar in the future.
    marginTop: -52,
    borderRadius: 16,
  },
  mainPlayerContainer: {
    flex: 1,
    gap: 16,
    justifyContent: 'flex-end',
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
    flex: 1,
    alignItems: 'center',
    height: MINI_PLAYER_HEIGHT,
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

  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();

  const { t } = useTranslation('translation', { keyPrefix: 'player' });

  const { data: songInfo, isLoading, isError } = useNowPlaying();

  const [showAlbumArtColor] = useSettingAtom('showAlbumArtColor');
  const [showLikeAndDislikeButtons] = useSettingAtom(
    'showLikeAndDislikeButtons'
  );
  const [showVolumeControl] = useSettingAtom('showVolumeControl');
  const [showFullScreenButton] = useSettingAtom('showFullScreenButton');

  const isExtraActionsVisible =
    showLikeAndDislikeButtons || showVolumeControl || showFullScreenButton;

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const isAlbumArtAndDetailsSideBySide = isLandscape && height < 600;

  const [isPlayingOptimistic, setIsPlayingOptimistic] = useState(false);

  // Arbitrarily calculate image width due to image requiring dimensions.
  // Not that elegant but it works. Refactor if necessary.
  const maxAlbumArtWidthLandscape = (width - 48) * 0.4;
  const albumArtWidthLandscapeRaw =
    height +
    topInset +
    bottomInset -
    60 - // app bar
    46 - // seek bar
    88 - // controls
    (isExtraActionsVisible ? 48 + 8 : 0) - // extra actions
    PLAYER_PADDING;
  const albumArtWidthLandscape = Math.min(
    albumArtWidthLandscapeRaw,
    maxAlbumArtWidthLandscape
  );
  const albumArtWidth = Math.min(
    width - PLAYER_PADDING * 2,
    albumArtWidthLandscapeRaw - 52 - PLAYER_PADDING,
    height / 2
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsPlayingOptimistic(songInfo ? !songInfo.isPaused : false);
  }, [songInfo]);

  const handlePlayPause = async () => {
    setIsPlayingOptimistic((prev) => !prev);
    try {
      await togglePlayPause();
    } catch {
      setIsPlayingOptimistic((prev) => !prev);
    }
  };

  const handlePause = async () => {
    setIsPlayingOptimistic(false);
    await pause();
  };

  const { color: dominantColor, isBright: isDominantColorBright } =
    useDominantColor(songInfo?.imageSrc);
  const dominantColorGradientStart = dominantColor
    ? `${dominantColor}${isDominantColorBright ? '50' : 'ff'}`
    : theme.colors.surface;
  const dominantColorGradientEnd = dominantColor
    ? `${dominantColor}${isDominantColorBright ? '18' : '40'}`
    : theme.colors.surface;

  // bottom sheet modal - player
  const bottomSheetRef = useRef<BottomSheet>(null);
  const minimizePlayer = () => bottomSheetRef.current?.snapToIndex(0);
  const maximizePlayer = () => bottomSheetRef.current?.snapToIndex(1);

  const snapPoints = [MINI_PLAYER_HEIGHT + bottomInset, '100%'];
  const animatedPosition = useSharedValue(0);
  const animatedIndex = useSharedValue(0);
  const heightForPosition =
    height + (isLandscape ? 0 : topInset) - MINI_PLAYER_HEIGHT;

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
              showAlbumArtColor && theme.dark
                ? [dominantColorGradientStart, dominantColorGradientEnd]
                : ['transparent', 'transparent']
            }
            style={[
              styles.linearGradient,
              {
                backgroundColor:
                  showAlbumArtColor && theme.dark
                    ? '#000000'
                    : theme.colors.surface,
                paddingBottom: bottomInset,
              },
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
                      styles.mainPlayerContainer,
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
                        accessibilityLabel={t('player.moreActions')}
                      />
                    </View>
                    <View
                      style={[
                        styles.albumArtContainer,
                        isAlbumArtAndDetailsSideBySide && {
                          alignItems: 'flex-end',
                          justifyContent: 'flex-start',
                        },
                      ]}
                    >
                      {songInfo.imageSrc && (
                        <Image
                          source={{ uri: songInfo.imageSrc }}
                          style={[
                            styles.albumArt,
                            {
                              display: height < 450 ? 'none' : 'flex',
                              width: albumArtWidth,
                              height: albumArtWidth,
                            },
                            isAlbumArtAndDetailsSideBySide && {
                              display: height < 300 ? 'none' : 'flex',
                              width: albumArtWidthLandscape,
                              height: albumArtWidthLandscape,
                              marginTop: 0,
                            },
                          ]}
                        />
                      )}
                      {isAlbumArtAndDetailsSideBySide && (
                        <SongDetails {...songInfo} sideBySide />
                      )}
                    </View>
                    {!isAlbumArtAndDetailsSideBySide && (
                      <SongDetails {...songInfo} />
                    )}
                    <PlayerSeekBar songInfo={songInfo} />
                    <PlayerControls
                      isPlaying={isPlayingOptimistic}
                      onPlayPause={handlePlayPause}
                    />
                    <PlayerExtraActions />
                  </Animated.View>
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
