import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { Platform } from 'react-native';

import { volumeSliderValueAtom } from '@/configs';
import { updateVolume } from '@/services';

export const useVolume = () => {
  const queryClient = useQueryClient();

  const [volume, setVolume] = useAtom(volumeSliderValueAtom);

  const { data: isMuted } = useQuery({
    queryKey: ['isMuted'],
    queryFn: () => queryClient.getQueryData<boolean>(['isMuted']) || false,
    initialData: false,
  });

  const adjustVolume = async (newVolume: number) => {
    // Web jitter reduction fix: Do not update if new value is just within
    // threshold from current server volume
    if (Platform.OS === 'web') {
      const serverVolume = queryClient.getQueryData<number>(['volume']) || 100;
      if (Math.abs(serverVolume - newVolume) <= 1) return;
    }

    setVolume(newVolume);
    await updateVolume(newVolume);
  };

  return { volume, isMuted, adjustVolume };
};
