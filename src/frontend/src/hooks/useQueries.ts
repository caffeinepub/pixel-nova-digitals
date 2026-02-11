import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, GenRecordEntry, GenType } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetGenHistory() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<GenRecordEntry[]>({
    queryKey: ['genHistory'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGenHistory();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddGenRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ type, prompt, metadata }: { type: GenType; prompt: string; metadata: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addGenRecord(type, prompt, metadata);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genHistory'] });
    },
  });
}

export function useUpdateGenRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ recordId, type, prompt, metadata }: { recordId: bigint; type: GenType; prompt: string; metadata: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateGenRecord(recordId, type, prompt, metadata);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genHistory'] });
    },
  });
}

export function useDeleteGenRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recordId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteGenRecord(recordId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genHistory'] });
    },
  });
}
