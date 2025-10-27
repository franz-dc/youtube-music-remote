import { useState } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { SAFE_LOW_VOLUME } from '@/constants';
import { getVolume, toggleMute, updateVolume } from '@/services';

const QUERY_KEY = ['volume'];

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

  const [localVolume, setLocalVolume] = useState(1); // (0-1)
  const [isLocalMuted, setIsLocalMuted] = useState(false);

  const { data } = useQuery({
    queryKey: QUERY_KEY,
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

  const mutateVolume = async (volume: number) => {
    try {
      setLocalVolume(volume / 100);
      await updateVolume(volume);
      queryClient.setQueryData(QUERY_KEY, { state: volume, isMuted: false });
    } catch {
      setLocalVolume(data?.state ? data.state / 100 : 1);
    }
  };

  const mutateMute = async () => {
    try {
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

      queryClient.setQueryData(QUERY_KEY, {
        state: data?.state ?? 100,
        isMuted: newIsLocalMuted,
      });
    } catch {
      setLocalVolume(data?.state ? data.state / 100 : 1);
      setIsLocalMuted(data?.isMuted ?? false);
    }
  };

  return {
    volume: localVolume,
    setVolume: async (volume: number) => await mutateVolume(volume * 100),
    isMuted: isLocalMuted,
    toggleMute: async () => await mutateMute(),
  };
};
