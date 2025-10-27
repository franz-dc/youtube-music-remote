import { useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { SAFE_LOW_VOLUME } from '@/constants';
import { getVolume, toggleMute, updateVolume } from '@/services';

const VOLUME_QUERY_KEY = ['volume'];
const MUTE_QUERY_KEY = ['isMuted'];

/**
 * Hook to manipulate the volume and mute state.
 * State is not polled to not overload with requests.
 *
 * The states are only updated when:
 * - The app is opened
 * - Volume or mute is changed
 */
export const useVolume = () => {
  const queryClient = useQueryClient();

  const [localVolume, setLocalVolume] = useState(1);
  const [isLocalMuted, setIsLocalMuted] = useState(false);

  const { data } = useQuery({
    queryKey: VOLUME_QUERY_KEY,
    queryFn: async () => {
      const data = await getVolume();
      setLocalVolume(data.state / 100);
      setIsLocalMuted(data.isMuted);
      return data;
    },
    initialData: {
      state: 100,
      isMuted: false,
    },
  });

  const mutateVolume = (volume: number) => {
    try {
      setLocalVolume(volume / 100);
      updateVolume(volume);
      queryClient.setQueryData(VOLUME_QUERY_KEY, volume);
      queryClient.setQueryData(MUTE_QUERY_KEY, false);
    } catch {
      setLocalVolume(data?.state ? data.state / 100 : 1);
    }
  };

  const { mutateAsync: mutateMute } = useMutation({
    mutationKey: MUTE_QUERY_KEY,
    mutationFn: async () => {
      const newIsLocalMuted = !isLocalMuted;

      // If the volume is 0 and the user tries to unmute,
      // set the volume to a safe value
      if (!newIsLocalMuted && localVolume === 0) {
        setLocalVolume(SAFE_LOW_VOLUME);
        setIsLocalMuted(newIsLocalMuted);
        mutateVolume(SAFE_LOW_VOLUME * 100);
      } else {
        setIsLocalMuted(newIsLocalMuted);
      }

      await toggleMute();
    },
    onError: async () => {
      setLocalVolume(data?.state ? data.state / 100 : 1);
      setIsLocalMuted(data?.isMuted ?? false);
    },
  });

  return {
    volume: localVolume,
    setVolume: async (volume: number) => await mutateVolume(volume * 100),
    isMuted: isLocalMuted,
    toggleMute: async () => await mutateMute(),
  };
};
