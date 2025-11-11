import { Linking, StyleSheet, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';

import { SongInfoSchema } from '@/schemas';

const styles = StyleSheet.create({
  title: {
    fontSize: 16 * 1.25,
    fontWeight: 'bold',
  },
  artist: {
    opacity: 0.5,
  },
});

export type SongDetailsProps = SongInfoSchema & {
  sideBySide?: boolean;
};

const SongDetails = ({
  title,
  artist,
  artistUrl,
  sideBySide,
}: SongDetailsProps) => {
  return (
    <View style={[sideBySide && { flex: 1 }]}>
      <Text numberOfLines={sideBySide ? 2 : 1} style={styles.title}>
        {title}
      </Text>
      <TouchableRipple
        onPress={
          artistUrl
            ? () => {
                Linking.openURL(artistUrl);
              }
            : undefined
        }
        style={{ alignSelf: 'flex-start' }}
      >
        <Text numberOfLines={1} variant='bodyLarge' style={styles.artist}>
          {artist}
        </Text>
      </TouchableRipple>
    </View>
  );
};

export default SongDetails;
