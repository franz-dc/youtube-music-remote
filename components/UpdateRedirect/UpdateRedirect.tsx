import { useEffect } from 'react';

import { useLastNotificationResponse } from 'expo-notifications';
import { router, usePathname } from 'expo-router';
import { Platform } from 'react-native';

export type UpdateRedirectProps = {
  isInitialized: boolean;
};

/**
 * Redirect to '/about' if the user presses the update notification.
 *
 * This component exists for the sole reason of circumventing the rules of
 * hooks. Web version throws an error when using `useLastNotificationResponse`.
 */
const UpdateRedirect = ({ isInitialized }: UpdateRedirectProps) => {
  const pathName = usePathname();
  const lastNotificationResponse = useLastNotificationResponse();

  useEffect(() => {
    if (!isInitialized || pathName === '/about' || Platform.OS === 'web') {
      return;
    }

    const handleUpdateOnNotificationPress = async () => {
      if (
        lastNotificationResponse?.notification?.request.identifier ===
        'updateAvailable'
      ) {
        router.push({
          pathname: '/about',
          params: { startUpdate: '1' },
        });
      }
    };

    handleUpdateOnNotificationPress();
  }, [isInitialized, pathName, lastNotificationResponse]);

  return null;
};

export default UpdateRedirect;
