import { useEffect } from 'react';

import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { List } from 'react-native-paper';

import { sleepTimerActiveAtom, sleepTimerAtom } from '@/configs';
import { formatSecondsToDuration } from '@/utils';

export type SleepTimerProps = {
  onPause: () => Promise<void>;
  onPlayerMenuDismiss: () => void;
  onSleepTimerMenuOpen: () => void;
};

const styles = StyleSheet.create({
  listItem: {
    paddingHorizontal: 16,
  },
});

const SleepTimer = ({
  onPause,
  onPlayerMenuDismiss,
  onSleepTimerMenuOpen,
}: SleepTimerProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'player' });

  const [isSleepTimerActive, setIsSleepTimerActive] =
    useAtom(sleepTimerActiveAtom);
  const [timeRemaining, setTimeRemaining] = useAtom(sleepTimerAtom);

  // format duration with proper padding to minutes and seconds
  const timeRemainingText = formatSecondsToDuration(timeRemaining);

  // countdown timer
  useEffect(() => {
    if (!isSleepTimerActive) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    if (!timeRemaining) {
      return () => clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [
    isSleepTimerActive,
    timeRemaining,
    setIsSleepTimerActive,
    setTimeRemaining,
  ]);

  // disable timer and pause when timer ends
  useEffect(() => {
    if (isSleepTimerActive && timeRemaining === 0) {
      setIsSleepTimerActive(false);
      onPause();
    }
  }, [isSleepTimerActive, timeRemaining, setIsSleepTimerActive, onPause]);

  const onPress = () => {
    onPlayerMenuDismiss();
    onSleepTimerMenuOpen();
  };

  return (
    <List.Item
      title={
        t('sleepTimer') + (timeRemaining > 0 ? `  ⦁  ${timeRemainingText}` : '')
      }
      left={() => (
        <List.Icon icon={isSleepTimerActive ? 'timer' : 'timer-outline'} />
      )}
      onPress={onPress}
      style={styles.listItem}
    />
  );
};
export default SleepTimer;
