import { useQuery, useQueryClient } from '@tanstack/react-query';

import { LikeStateSchema } from '@/schemas';
import { getLikeState, toggleDislikeSong, toggleLikeSong } from '@/services';

export const useLikeState = (videoId: string) => {
  const queryClient = useQueryClient();

  const { data: likeState = 'INDIFFERENT' } = useQuery({
    queryKey: ['likeState', videoId],
    queryFn: getLikeState,
    enabled: !!videoId,
  });

  const toggleLike = async () => {
    // optimistic update
    queryClient.setQueryData(
      ['likeState', videoId],
      (oldState?: LikeStateSchema) => {
        if (oldState === 'LIKE') return 'INDIFFERENT';
        return 'LIKE';
      }
    );
    await toggleLikeSong();

    // refetch to ensure data is correct
    await queryClient.invalidateQueries({ queryKey: ['likeState', videoId] });
  };

  const toggleDislike = async () => {
    queryClient.setQueryData(
      ['likeState', videoId],
      (oldState?: LikeStateSchema) => {
        if (oldState === 'DISLIKE') return 'INDIFFERENT';
        return 'DISLIKE';
      }
    );
    await toggleDislikeSong();
    await queryClient.invalidateQueries({ queryKey: ['likeState', videoId] });
  };

  return { likeState, toggleLike, toggleDislike };
};
