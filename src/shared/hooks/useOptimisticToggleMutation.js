import { useMutation, useQueryClient } from "@tanstack/react-query";

// Shared scaffold for toggle-style mutations (like, save, ...): optimistic
// patch on a cached query, rollback on error, reconcile on success.
export function useOptimisticToggleMutation({
  queryKey,
  mutationFn,
  applyOptimistic,
  applyServerSync,
  onSuccess,
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async () => {
      // Cancel in-flight refetches so they don't overwrite the optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot current state for rollback
      const previous = queryClient.getQueryData(queryKey);

      // Immediately flip the UI
      queryClient.setQueryData(queryKey, (old) => (old ? applyOptimistic(old) : old));

      return { previous };
    },
    onError: (_err, _vars, context) => {
      // Revert to snapshot if API fails
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSuccess: (data) => {
      // Sync with server truth (corrects any optimistic discrepancy)
      queryClient.setQueryData(queryKey, (old) => (old ? applyServerSync(old, data) : old));
      onSuccess?.(data, queryClient);
    },
  });
}
