import { StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const LoadingView = () => (
  <SafeAreaView style={styles.loadingView}>
    <ActivityIndicator animating size='large' />
  </SafeAreaView>
);

export default LoadingView;
