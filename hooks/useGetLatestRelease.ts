import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { Platform } from 'react-native';

import { ReleaseSchema } from '@/schemas';
import { getLatestRelease } from '@/services';

export const useGetLatestRelease = (
  options?: Partial<
    UseQueryOptions<ReleaseSchema, Error, ReleaseSchema, string[]>
  >
) =>
  useQuery({
    ...options,
    queryKey: ['latestRelease'],
    queryFn: getLatestRelease,
    staleTime: Infinity, // Fetch only once, or on demand
    enabled: options?.enabled
      ? Platform.OS !== 'web' && options.enabled
      : Platform.OS !== 'web',
  });
