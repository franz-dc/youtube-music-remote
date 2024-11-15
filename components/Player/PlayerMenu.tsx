import { forwardRef, useImperativeHandle, useRef } from 'react';

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { Alert, Platform, Share, StyleSheet } from 'react-native';
import { Divider, List, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ANIMATION_CONFIGS } from '@/constants';
import { useBottomSheetModalBackHandler } from '@/hooks';
import { SongInfoSchema } from '@/schemas';
import { toggleDislikeSong, toggleLikeSong } from '@/services';
import { formatSecondsToDuration } from '@/utils';

import SleepTimer from './SleepTimer';

export type PlayerMenuProps = {
  songInfo: NonNullable<SongInfoSchema>;
  onPause: () => Promise<void>;
  onSleepTimerMenuOpen: () => void;
};

export type PlayerMenuMethods = {
  show: () => void;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSheetModal: {
    marginHorizontal: 24,
  },
  listItem: {
    paddingHorizontal: 16,
  },
  divider: {
    marginTop: 16,
    marginBottom: 8,
  },
});

const PlayerMenu = forwardRef<PlayerMenuMethods, PlayerMenuProps>(
  ({ songInfo, onPause, onSleepTimerMenuOpen }, ref) => {
    const { t } = useTranslation('translation', { keyPrefix: 'player' });

    const { bottom: bottomInset } = useSafeAreaInsets();

    const theme = useTheme();

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const handlePresentModalPress = () => {
      bottomSheetModalRef.current?.present();
      bottomSheetModalRef.current?.snapToIndex(0);
    };
    const handleDismissModalPress = () =>
      bottomSheetModalRef.current?.dismiss();

    useImperativeHandle(ref, () => ({
      show: handlePresentModalPress,
    }));

    const { handleSheetPositionChange } =
      useBottomSheetModalBackHandler(bottomSheetModalRef);

    const shareSong = async () => {
      try {
        await Share.share({
          message: songInfo.url,
        });
      } catch (error: any) {
        Alert.alert(error.message);
      } finally {
        handleDismissModalPress();
      }
    };

    const likeSong = async () => {
      handleDismissModalPress();
      await toggleLikeSong();
    };

    const dislikeSong = async () => {
      handleDismissModalPress();
      await toggleDislikeSong();
    };

    return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          onChange={handleSheetPositionChange}
          animationConfigs={ANIMATION_CONFIGS}
          handleIndicatorStyle={{ backgroundColor: theme.colors.onSurface }}
          style={styles.bottomSheetModal}
          backgroundStyle={{ backgroundColor: theme.colors.elevation.level4 }}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
            />
          )}
          enableDismissOnClose={false}
        >
          <BottomSheetScrollView
            contentContainerStyle={{
              paddingBottom: bottomInset + (Platform.OS === 'web' ? 16 : 8),
            }}
          >
            <Text
              style={{
                paddingHorizontal: 16,
                fontWeight: 'bold',
              }}
            >
              {songInfo.title}
            </Text>
            <Text
              style={{
                paddingHorizontal: 16,
                opacity: 0.5,
              }}
            >
              {songInfo.artist} ⦁{' '}
              {formatSecondsToDuration(songInfo.songDuration)}
            </Text>
            <Divider style={styles.divider} />
            <List.Item
              title={t('like')}
              left={() => <List.Icon icon='thumb-up-outline' />}
              onPress={likeSong}
              style={styles.listItem}
            />
            <List.Item
              title={t('dislike')}
              left={() => <List.Icon icon='thumb-down-outline' />}
              onPress={dislikeSong}
              style={styles.listItem}
            />
            <List.Item
              title={t('share')}
              left={() => <List.Icon icon='share' />}
              onPress={shareSong}
              style={styles.listItem}
            />
            <SleepTimer
              onPause={onPause}
              onPlayerMenuDismiss={handleDismissModalPress}
              onSleepTimerMenuOpen={onSleepTimerMenuOpen}
            />
          </BottomSheetScrollView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  }
);

PlayerMenu.displayName = 'PlayerMenu';

export default PlayerMenu;
