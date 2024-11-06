import { PropsWithChildren } from 'react';

import { StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

const styles = StyleSheet.create({
  subheader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

const SettingsSubheader = ({ children }: PropsWithChildren) => {
  const theme = useTheme();

  return (
    <Text
      variant='titleLarge'
      style={[
        styles.subheader,
        {
          color: theme.colors.primary,
        },
      ]}
    >
      {children}
    </Text>
  );
};

export default SettingsSubheader;
