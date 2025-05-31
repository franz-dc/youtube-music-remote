import { router } from 'expo-router';

export const goBack = () => {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/');
  }
};
