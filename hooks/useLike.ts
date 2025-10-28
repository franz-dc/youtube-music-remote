import { useQuery, useQueryClient } from '@tanstack/react-query';

import { LikeState } from '@/schemas';
import { getLikeState, toggleDislikeSong, toggleLikeSong } from '@/services';

export const useLike = (videoId?: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['likeState', videoId];

  const { data: likeState } = useQuery({
    queryKey,
    queryFn: getLikeState,
    enabled: !!videoId,
    initialData: LikeState.INDIFFERENT,
  });

  const toggleLike = async () => {
    if (!videoId) return;

    // optimistic update
    queryClient.setQueryData(queryKey, (oldState?: LikeState) => {
      if (oldState === LikeState.LIKE) return LikeState.INDIFFERENT;
      return LikeState.LIKE;
    });
    await toggleLikeSong();

    // refetch to ensure data is correct
    await queryClient.invalidateQueries({ queryKey });
  };

  const toggleDislike = async () => {
    if (!videoId) return;

    queryClient.setQueryData(queryKey, (oldState?: LikeState) => {
      if (oldState === LikeState.DISLIKE) return LikeState.INDIFFERENT;
      return LikeState.DISLIKE;
    });
    await toggleDislikeSong();
    await queryClient.invalidateQueries({ queryKey });
  };

  return { likeState, toggleLike, toggleDislike };
};
