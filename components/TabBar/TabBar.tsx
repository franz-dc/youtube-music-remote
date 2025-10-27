import { useTheme } from 'react-native-paper';
import { getTouchableRippleColors } from 'react-native-paper/src/components/TouchableRipple/utils';
import { TabBar as RNTabBar, TabViewProps } from 'react-native-tab-view';

const TabBar: NonNullable<
  TabViewProps<{
    key: string;
    title: string;
  }>['renderTabBar']
> = (props) => {
  const theme = useTheme();

  return (
    <RNTabBar
      {...props}
      indicatorStyle={{ backgroundColor: theme.colors.primary }}
      style={{
        backgroundColor: theme.colors.background,
        shadowColor: theme.colors.background,
      }}
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.onSurface}
      android_ripple={{
        color: getTouchableRippleColors({ theme }).calculatedRippleColor,
      }}
    />
  );
};

export default TabBar;
