import { StyleSheet, View } from 'react-native';
import { Button, Icon, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 24,
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
};

const InfoView = ({
  title,
  message,
  icon,
  actionLabel,
  onActionPress,
}: InfoViewProps) => (
  <SafeAreaView style={styles.container}>
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
  </SafeAreaView>
);

export default InfoView;
