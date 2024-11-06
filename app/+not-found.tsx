import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Appbar } from 'react-native-paper';

export default function NotFoundScreen() {
  return (
    <>
      <Appbar.Header>
        <Appbar.Content title='Oops!' />
      </Appbar.Header>
      <View style={styles.container}>
        <Text>This screen doesn&quot;t exist.</Text>
        <Link href='/' style={styles.link}></Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
