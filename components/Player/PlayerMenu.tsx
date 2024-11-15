import { forwardRef, useImperativeHandle, useRef } from 'react';

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useBottomSheetModalBackHandler } from '@/hooks';

import SleepTimer from './SleepTimer';

export type PlayerMenuProps = {
  onPause: () => Promise<void>;
  onSleepTimerMenuOpen: () => void;
};

export type PlayerMenuMethods = {
  show: () => void;
};

const ANIMATION_CONFIGS = {
  duration: 350,
  easing: Easing.out(Easing.exp),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSheetModal: {
    marginHorizontal: 24,
  },
});

const PlayerMenu = forwardRef<PlayerMenuMethods, PlayerMenuProps>(
  ({ onPause, onSleepTimerMenuOpen }, ref) => {
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
          <BottomSheetView style={{ paddingBottom: bottomInset }}>
            <SleepTimer
              onPause={onPause}
              onPlayerMenuDismiss={handleDismissModalPress}
              onSleepTimerMenuOpen={onSleepTimerMenuOpen}
            />
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  }
);

PlayerMenu.displayName = 'PlayerMenu';

export default PlayerMenu;
