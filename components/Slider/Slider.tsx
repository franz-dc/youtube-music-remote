import RNSlider, { SliderProps } from '@react-native-community/slider';
import { Platform, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

const styles = StyleSheet.create({
  slider: {
    marginHorizontal: Platform.OS === 'web' ? 0 : -16,
  },
});

const Slider = ({ style, ...SliderProps }: SliderProps) => {
  const theme = useTheme();
  return (
    <RNSlider
      {...SliderProps}
      style={[styles.slider, style]}
      minimumTrackTintColor='#ffffff'
      thumbTintColor='#ffffff'
      maximumTrackTintColor={theme.colors.inverseSurface}
    />
  );
};

export default Slider;
