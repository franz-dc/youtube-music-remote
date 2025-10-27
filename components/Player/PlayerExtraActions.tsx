import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import { IconButton } from 'react-native-paper';

import { useSettingAtom } from '@/configs';
import { useIsFullScreen, useSetFullScreen } from '@/hooks';
import { useLike } from '@/hooks/useLike';
import { useVolume } from '@/hooks/useVolume';
import { SongInfoSchema } from '@/schemas';

import Slider from '../Slider';

export type PlayerExtraActionsProps = {
  songInfo: NonNullable<SongInfoSchema>;
};

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

const PlayerExtraActions = ({ songInfo }: PlayerExtraActionsProps) => {
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

  const { volume, setVolume, isMuted, toggleMute } = useVolume();

  const volumeIcon =
    isMuted || volume === 0
      ? 'volume-mute'
      : volume > 2 / 3
        ? 'volume-high'
        : volume > 1 / 3
          ? 'volume-medium'
          : 'volume-low';

  const { likeState, toggleLike, toggleDislike } = useLike(songInfo.videoId);

  if (!showPlayerActions) return null;

  return (
    <View style={styles.actionsContainer}>
      <View style={styles.stack}>
        {showLikeAndDislikeButtons && (
          <>
            <IconButton
              icon={likeState === 'LIKE' ? 'thumb-up' : 'thumb-up-outline'}
              size={20}
              onPress={toggleLike}
              accessibilityLabel={t('like')}
            />
            <IconButton
              icon={
                likeState === 'DISLIKE' ? 'thumb-down' : 'thumb-down-outline'
              }
              size={20}
              onPress={toggleDislike}
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
              onValueChange={(value) => setVolume(value)}
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
