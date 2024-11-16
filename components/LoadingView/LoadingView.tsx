import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MINI_PLAYER_HEIGHT } from '@/constants';

const styles = StyleSheet.create({
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const LoadingView = () => {
  const { bottom: bottomInset } = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.loadingView,
        { marginBottom: bottomInset + MINI_PLAYER_HEIGHT },
      ]}
    >
      <ActivityIndicator animating size='large' />
    </View>
  );
};

export default LoadingView;
