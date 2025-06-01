import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const styles = StyleSheet.create({
  title: {
    fontSize: 16 * 1.25,
    fontWeight: 'bold',
  },
  artist: {
    opacity: 0.5,
  },
});

export type SongDetailsProps = {
  title: string;
  artist: string;
  sideBySide?: boolean;
};

const SongDetails = ({ title, artist, sideBySide }: SongDetailsProps) => {
  return (
    <View style={[sideBySide && { flex: 1 }]}>
      <Text numberOfLines={sideBySide ? 2 : 1} style={styles.title}>
        {title}
      </Text>
      <Text numberOfLines={1} variant='bodyLarge' style={styles.artist}>
        {artist}
      </Text>
    </View>
  );
};

export default SongDetails;
