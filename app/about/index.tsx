import * as Application from 'expo-application';
import { useTranslation } from 'react-i18next';
import { Image, Linking, Platform, StyleSheet } from 'react-native';
import { List, Text } from 'react-native-paper';

const styles = StyleSheet.create({
  image: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  brand: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  versionNumber: {
    textAlign: 'center',
    opacity: 0.5,
    marginBottom: 16,
  },
  listItem: {
    paddingHorizontal: 4,
  },
});

// TODO: Check for updates API

const About = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'about' });

  return (
    <>
      <Image
        source={require('@/assets/images/logo.png')}
        style={styles.image}
      />
      <Text variant='titleLarge' style={styles.brand}>
        YouTube Music Remote
      </Text>
      <Text variant='titleMedium' style={styles.versionNumber}>
        {Platform.OS === 'web'
          ? t('webVersion')
          : Application.nativeApplicationVersion}
      </Text>
      <List.Item
        title={t('checkForUpdates')}
        left={(props) => <List.Icon {...props} icon='update' />}
        style={styles.listItem}
      />
      <List.Item
        title='GitHub'
        left={(props) => <List.Icon {...props} icon='github' />}
        style={styles.listItem}
        onPress={() =>
          Linking.openURL('https://github.com/franz-dc/youtube-music-remote')
        }
      />
      {Platform.OS !== 'web' && (
        <List.Item
          title={t('webVersion')}
          left={(props) => <List.Icon {...props} icon='web' />}
          style={styles.listItem}
          onPress={() =>
            Linking.openURL('https://youtube-music-remote.vercel.app')
          }
        />
      )}
      <List.Item
        title={t('license')}
        description='GNU General Public License v3.0'
        left={(props) => <List.Icon {...props} icon='gavel' />}
        style={styles.listItem}
        onPress={() =>
          Linking.openURL(
            'https://github.com/franz-dc/youtube-music-remote/blob/main/LICENSE.md'
          )
        }
      />
    </>
  );
};
export default About;
