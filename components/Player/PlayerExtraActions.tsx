import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import { IconButton } from 'react-native-paper';

import { useSettingAtom } from '@/configs';
import { SAFE_LOW_VOLUME } from '@/constants';
import { useIsFullScreen, useSetFullScreen } from '@/hooks';
import { toggleDislikeSong, toggleLikeSong, updateVolume } from '@/services';

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

const PlayerExtraActions = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'player' });

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [showLikeAndDislikeButtons] = useSettingAtom(
    'showLikeAndDislikeButtons'
  );
  const [showVolumeControl] = useSettingAtom('showVolumeControl');
  const [showFullScreenButton] = useSettingAtom('showFullScreenButton');

  const showPlayerActions =
    showLikeAndDislikeButtons || showVolumeControl || showFullScreenButton;

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

  // Volume state (local only)
  // Fetching for volume does not exist so it will be initialized as max volume
  // All server side volume changes will not be awaited and will be optimistic
  const [volume, setVolume] = useState(1);

  // Local mute state to revert back to the previous volume
  const [isMuted, setIsMuted] = useState(false);

  const volumeIcon =
    isMuted || volume === 0
      ? 'volume-mute'
      : volume > 2 / 3
        ? 'volume-high'
        : volume > 1 / 3
          ? 'volume-medium'
          : 'volume-low';

  const setVolumeState = (newVolume: number) => {
    if (newVolume === 0) {
      setIsMuted(true);
    }
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
    setVolume(newVolume);
    updateVolume(newVolume * 100);
  };

  const toggleMute = () => {
    const newIsMuted = !isMuted;

    // If the volume is 0 and the user tries to unmute,
    // set the volume to a safe value
    if (!newIsMuted && volume === 0) {
      setVolume(SAFE_LOW_VOLUME);
      setIsMuted(newIsMuted);
      updateVolume(SAFE_LOW_VOLUME * 100);
    } else {
      setIsMuted(newIsMuted);
      updateVolume(newIsMuted ? 0 : volume * 100);
    }
  };

  if (!showPlayerActions) return null;

  return (
    <View style={styles.actionsContainer}>
      <View style={styles.stack}>
        {showLikeAndDislikeButtons && (
          <>
            <IconButton
              icon='thumb-up-outline'
              size={20}
              onPress={toggleLikeSong}
              accessibilityLabel={t('like')}
            />
            <IconButton
              icon='thumb-down-outline'
              size={20}
              onPress={toggleDislikeSong}
              accessibilityLabel={t('dislike')}
            />
          </>
        )}
      </View>
      <View style={styles.stack}>
        {showVolumeControl && (
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
              step={0.01}
              value={isMuted ? 0 : volume}
              onValueChange={(value) => setVolumeState(value)}
              accessibilityLabel={t('adjustVolume')}
            />
          </View>
        )}
        {showFullScreenButton && (
          <IconButton
            icon={isFullScreen ? 'fullscreen-exit' : 'fullscreen'}
            size={20}
            onPress={toggleFullScreen}
            accessibilityLabel={t(
              isFullScreen ? 'exitFullscreen' : 'enterFullscreen'
            )}
          />
        )}
      </View>
    </View>
  );
};

export default PlayerExtraActions;
