import { StyleSheet } from 'react-native';
import { List, ListItemProps, Switch } from 'react-native-paper';

const styles = StyleSheet.create({
  listItem: {
    paddingRight: 16,
  },
  title: {
    fontSize: 16 * 1.125,
  },
  description: {
    opacity: 0.75,
  },
});

type SettingsListItemProps = ListItemProps & {
  type: 'switch' | 'text';
  value: string | boolean;
  onPress?: (value: any) => void | Promise<void>;
};

const SettingsListItem = ({
  type,
  value,
  description,
  onPress,
  ...rest
}: SettingsListItemProps) => (
  <List.Item
    {...rest}
    description={description || (type !== 'switch' ? value : undefined)}
    right={() =>
      type === 'switch' ? (
        <Switch
          value={value as boolean}
          onValueChange={() => onPress?.(value)}
        />
      ) : undefined
    }
    onPress={() => onPress?.(value)}
    style={styles.listItem}
    titleStyle={styles.title}
    descriptionStyle={styles.description}
  />
);

export default SettingsListItem;
