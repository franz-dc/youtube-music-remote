// https://github.com/gorhom/react-native-bottom-sheet/issues/1110
// https://gist.github.com/vanenshi/6c2938d2f7424979d76c06d66703df19

import { useCallback, useRef } from 'react';

import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import { BackHandler, NativeEventSubscription } from 'react-native';

/**
 * hook that dismisses the bottom sheet on the hardware back button press if it is visible
 * @param bottomSheetRef ref to the bottom sheet which is going to be closed/dismissed on the back press
 */
export const useBottomSheetModalBackHandler = (
  bottomSheetRef: React.RefObject<BottomSheetModal | null>
) => {
  const backHandlerSubscriptionRef = useRef<NativeEventSubscription | null>(
    null
  );
  const handleSheetPositionChange = useCallback<
    NonNullable<BottomSheetModalProps['onChange']>
  >(
    (index) => {
      const isBottomSheetVisible = index >= 0;
      if (isBottomSheetVisible && !backHandlerSubscriptionRef.current) {
        // setup the back handler if the bottom sheet is right in front of the user
        backHandlerSubscriptionRef.current = BackHandler.addEventListener(
          'hardwareBackPress',
          () => {
            bottomSheetRef.current?.dismiss();
            return true;
          }
        );
      } else if (!isBottomSheetVisible) {
        backHandlerSubscriptionRef.current?.remove();
        backHandlerSubscriptionRef.current = null;
      }
    },
    [bottomSheetRef, backHandlerSubscriptionRef]
  );
  return { handleSheetPositionChange };
};

export const useBottomSheetBackHandler = (
  bottomSheetRef: React.RefObject<BottomSheet | null>
) => {
  const backHandlerSubscriptionRef = useRef<NativeEventSubscription | null>(
    null
  );
  const handleSheetPositionChange = useCallback<
    NonNullable<BottomSheetModalProps['onChange']>
  >(
    (index) => {
      const isBottomSheetVisible = index > 0;
      if (isBottomSheetVisible && !backHandlerSubscriptionRef.current) {
        // setup the back handler if the bottom sheet is right in front of the user
        backHandlerSubscriptionRef.current = BackHandler.addEventListener(
          'hardwareBackPress',
          () => {
            bottomSheetRef.current?.snapToIndex(0);
            return true;
          }
        );
      } else if (!isBottomSheetVisible) {
        backHandlerSubscriptionRef.current?.remove();
        backHandlerSubscriptionRef.current = null;
      }
    },
    [bottomSheetRef, backHandlerSubscriptionRef]
  );
  return { handleSheetPositionChange };
};
