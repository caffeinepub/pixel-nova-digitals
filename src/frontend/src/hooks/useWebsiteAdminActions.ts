import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useRetireWebsite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: string | null) => {
      if (!actor) throw new Error('Actor not available');
      return actor.retireWebsite(message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['websiteStatus'] });
    },
  });
}

export function useReactivateWebsite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.reactivateWebsite();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['websiteStatus'] });
    },
  });
}

export function usePurgeData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.purgeData();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genHistory'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
