import { PropsWithChildren } from 'react';

import {
  SafeAreaView,
  SafeAreaViewProps,
} from 'react-native-safe-area-context';

const styles = {
  safeAreaView: {
    padding: 16,
  },
};

const Container = ({
  children,
  ...SafeAreaViewProps
}: PropsWithChildren<SafeAreaViewProps>) => {
  return (
    <SafeAreaView style={styles.safeAreaView} {...SafeAreaViewProps}>
      {children}
    </SafeAreaView>
  );
};

export default Container;
