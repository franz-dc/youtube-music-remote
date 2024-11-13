import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Button, Icon, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
  button: {
    marginTop: 24,
  },
});

export type InfoViewProps = {
  title: string;
  message: string;
  icon: string;
  onActionPress?: () => void;
  actionLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const InfoView = ({
  title,
  message,
  icon,
  actionLabel,
  onActionPress,
  style,
}: InfoViewProps) => {
  const { bottom: bottomInset } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { marginBottom: bottomInset }, style]}>
      <View style={styles.icon}>
        <Icon source={icon} size={64} />
      </View>
      <Text variant='titleLarge' style={styles.title}>
        {title}
      </Text>
      <Text style={styles.message}>{message}</Text>
      {!!onActionPress && !!actionLabel && (
        <Button mode='contained' onPress={onActionPress} style={styles.button}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
};

export default InfoView;
