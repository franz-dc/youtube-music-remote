import { StyleSheet } from 'react-native';
import { List, ListItemProps } from 'react-native-paper';

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

const SettingsListItem = (props: ListItemProps) => (
  <List.Item
    {...props}
    style={styles.listItem}
    titleStyle={styles.title}
    descriptionStyle={styles.description}
  />
);

export default SettingsListItem;
