import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { WebsiteState } from '../backend';

export function useWebsiteStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WebsiteState>({
    queryKey: ['websiteStatus'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getWebsiteStatus();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
