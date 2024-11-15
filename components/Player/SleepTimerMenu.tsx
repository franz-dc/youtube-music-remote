import { forwardRef, useImperativeHandle, useRef } from 'react';

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, View } from 'react-native';
import { Button, List, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { sleepTimerActiveAtom, sleepTimerAtom } from '@/configs';
import { ANIMATION_CONFIGS } from '@/constants';
import { useBottomSheetModalBackHandler } from '@/hooks';
import { formatSecondsToDuration } from '@/utils';

export type SleepTimerMenuProps = {};

export type SleepTimerMenuMethods = {
  show: () => void;
};

type TimerOption = {
  type: 'hours' | 'minutes';
  value: number;
};

const TIMER_OPTIONS: TimerOption[] = [
  {
    type: 'minutes',
    value: 5,
  },
  {
    type: 'minutes',
    value: 15,
  },
  {
    type: 'minutes',
    value: 30,
  },
  {
    type: 'hours',
    value: 1,
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSheetModal: {
    marginHorizontal: 24,
  },
  title: {
    marginHorizontal: 16,
  },
  durationText: {
    textAlign: 'center',
    marginVertical: 32,
    fontSize: 16 * 2.5,
    fontWeight: 'bold',
  },
  actionsContainer: {
    gap: 8,
    marginHorizontal: 48,
    marginBottom: Platform.OS === 'web' ? 24 : 8,
  },
  addTimerContainer: {
    marginTop: 8,
  },
  listItemOptionTitle: {
    paddingHorizontal: 24,
  },
});

// separate content to prevent stutters when timer is active
const Content = ({ onDismiss }: { onDismiss: () => void }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'player' });

  const theme = useTheme();

  const [isSleepTimerActive, setIsSleepTimerActive] =
    useAtom(sleepTimerActiveAtom);
  const [timeRemaining, setTimeRemaining] = useAtom(sleepTimerAtom);

  // format duration with proper padding to minutes and seconds
  const timeRemainingText = formatSecondsToDuration(timeRemaining);

  const addTimer = ({ type, value }: TimerOption) => {
    switch (type) {
      case 'hours':
        setTimeRemaining(value * 3600);
        break;
      case 'minutes':
        setTimeRemaining(value * 60);
        break;
    }

    setIsSleepTimerActive(true);
    onDismiss();
  };

  const addFiveMinutes = () => {
    setTimeRemaining((prev) => prev + 300);
    // reinstate active state to prevent race conditions
    setIsSleepTimerActive(true);
  };

  const cancelTimer = () => {
    setIsSleepTimerActive(false);
    setTimeRemaining(0);
    onDismiss();
  };

  if (isSleepTimerActive)
    return (
      <>
        <Text style={styles.durationText}>{timeRemainingText}</Text>
        <View style={styles.actionsContainer}>
          <Button
            style={{
              borderColor: theme.colors.onSurface,
            }}
            buttonColor={theme.colors.onSurface}
            textColor={theme.colors.surface}
            icon='plus'
            onPress={addFiveMinutes}
          >
            {t('addFiveMinutes')}
          </Button>
          <Button
            style={{
              borderWidth: 1,
              borderColor: theme.colors.onSurface,
            }}
            textColor={theme.colors.onSurface}
            onPress={cancelTimer}
          >
            {t('cancelTimer')}
          </Button>
        </View>
      </>
    );

  return (
    <View style={styles.addTimerContainer}>
      {TIMER_OPTIONS.map(({ type, value }, index) => (
        <List.Item
          key={index}
          title={t(type, { count: value })}
          onPress={() => addTimer({ type, value })}
          titleStyle={styles.listItemOptionTitle}
        />
      ))}
    </View>
  );
};

const SleepTimerMenu = forwardRef<SleepTimerMenuMethods, SleepTimerMenuProps>(
  (props, ref) => {
    const { t } = useTranslation('translation', { keyPrefix: 'player' });

    const { bottom: bottomInset } = useSafeAreaInsets();

    const theme = useTheme();

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const handlePresentModalPress = () =>
      bottomSheetModalRef.current?.present();
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
        >
          <BottomSheetView
            style={{
              paddingBottom: bottomInset + 8,
            }}
          >
            <Text variant='titleMedium' style={styles.title}>
              {t('sleepTimer')}
            </Text>
            <Content onDismiss={handleDismissModalPress} />
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  }
);

SleepTimerMenu.displayName = 'SleepTimerMenu';

export default SleepTimerMenu;
