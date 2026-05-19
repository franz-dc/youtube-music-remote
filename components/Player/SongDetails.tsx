import { useTranslation } from 'react-i18next';
import { Linking, StyleSheet, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';

import { SongInfoSchema } from '@/schemas';

const styles = StyleSheet.create({
  title: {
    fontSize: 16 * 1.25,
    fontWeight: 'bold',
  },
  subtitle: {
    flexDirection: 'row',
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
  album,
}: SongDetailsProps) => {
  const { t } = useTranslation('translation');

  return (
    <View style={[sideBySide && { flex: 1 }]}>
      <Text numberOfLines={sideBySide ? 2 : 1} style={styles.title}>
        {title || t('queue.unknownTitle')}
      </Text>
      <View style={styles.subtitle}>
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
            {artist || t('queue.unknownArtist')}
          </Text>
        </TouchableRipple>
        {!!album && (
          <Text
            numberOfLines={1}
            variant='bodyLarge'
            style={[styles.artist, { marginLeft: 4 }]}
          >
            • {album}
          </Text>
        )}
      </View>
    </View>
  );
};

export default SongDetails;
