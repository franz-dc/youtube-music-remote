import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import { IconButton } from 'react-native-paper';

import { useSettingAtom } from '@/configs';
import {
  useIsFullScreen,
  useLike,
  useNowPlaying,
  useSetFullScreen,
  useVolume,
} from '@/hooks';
import { toggleMute } from '@/services';

import Slider from '../Slider';

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: -12,
    marginRight: -16,
  },
  stack: {
    flexDirection: 'row',
    gap: 8,
  },
  volumeContainer: {
    flexDirection: 'row',
  },
  volumeSlider: {
    width: 100,
  },
  volumeSliderLandscape: {
    width: 150,
  },
});

const LikeButtons = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'player' });
  const { data: songInfo } = useNowPlaying();
  const { likeState, toggleLike, toggleDislike } = useLike(songInfo?.videoId);

  return (
    <>
      <IconButton
        icon={likeState === 'LIKE' ? 'thumb-up' : 'thumb-up-outline'}
        size={20}
        onPress={toggleLike}
        accessibilityLabel={t('like')}
      />
      <IconButton
        icon={likeState === 'DISLIKE' ? 'thumb-down' : 'thumb-down-outline'}
        size={20}
        onPress={toggleDislike}
        accessibilityLabel={t('dislike')}
      />
    </>
  );
};

const VolumeControl = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'player' });
  const { width, height } = useWindowDimensions();
  const [showFullScreenButton] = useSettingAtom('showFullScreenButton');
  const { volume, isMuted, adjustVolume } = useVolume();

  const isLandscape = width > height;
  const volumeIcon =
    isMuted || volume === 0
      ? 'volume-mute'
      : volume > 66
        ? 'volume-high'
        : volume > 33
          ? 'volume-medium'
          : 'volume-low';

  return (
    <View style={styles.volumeContainer}>
      <IconButton
        icon={volumeIcon}
        size={20}
        onPress={toggleMute}
        accessibilityLabel={t(isMuted ? 'unmute' : 'mute')}
      />
      <Slider
        style={[
          styles.volumeSlider,
          isLandscape && styles.volumeSliderLandscape,
          !showFullScreenButton && {
            marginRight: Platform.OS === 'web' ? 16 : 0,
          },
        ]}
        step={1}
        minimumValue={0}
        maximumValue={100}
        value={isMuted ? 0 : volume}
        onValueChange={adjustVolume}
        hitSlop={5}
        accessibilityLabel={t('adjustVolume')}
      />
    </View>
  );
};

const FullScreenButton = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'player' });

  // Fullscreen state (optimistic)
  const [isFullScreen, setIsFullscreen] = useState(false);
  const { data: initialIsFullscreen } = useIsFullScreen();
  const { mutateAsync: setFullscreen } = useSetFullScreen();

  useEffect(() => {
    setIsFullscreen(initialIsFullscreen);
  }, [initialIsFullscreen]);

  const toggleFullScreen = async () => {
    try {
      setIsFullscreen((prev) => !prev);
      await setFullscreen(!isFullScreen);
    } catch {
      setIsFullscreen((prev) => !prev);
    }
  };

  return (
    <IconButton
      icon={isFullScreen ? 'fullscreen-exit' : 'fullscreen'}
      size={20}
      onPress={toggleFullScreen}
      accessibilityLabel={t(
        isFullScreen ? 'exitFullscreen' : 'enterFullscreen'
      )}
    />
  );
};

const PlayerExtraActions = () => {
  const [showLikeAndDislikeButtons] = useSettingAtom(
    'showLikeAndDislikeButtons'
  );
  const [showVolumeControl] = useSettingAtom('showVolumeControl');
  const [showFullScreenButton] = useSettingAtom('showFullScreenButton');

  const showPlayerActions =
    showLikeAndDislikeButtons || showVolumeControl || showFullScreenButton;

  if (!showPlayerActions) return null;

  return (
    <View style={styles.actionsContainer}>
      <View style={styles.stack}>
        {showLikeAndDislikeButtons && <LikeButtons />}
      </View>
      <View style={styles.stack}>
        {showVolumeControl && <VolumeControl />}
        {showFullScreenButton && <FullScreenButton />}
      </View>
    </View>
  );
};

export default PlayerExtraActions;
