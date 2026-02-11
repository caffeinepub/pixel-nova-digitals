import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { HomePageContent } from '../backend';

export function useGetHomepageContent() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<HomePageContent | null>({
    queryKey: ['homepageContent'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getHomepageContent();
    },
    enabled: !!actor && !actorFetching,
    retry: 1,
  });
}

export function useUpdateHomepageContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: HomePageContent) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateHomepageContent(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepageContent'] });
    },
  });
}
