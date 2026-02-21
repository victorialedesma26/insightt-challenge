import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { taskApi } from '../services/api';
import type { Task, TaskPayload, TaskStatus } from '../types/task';
import { useAuth } from '../context/AuthProvider';

interface PendingAction {
  type: 'create' | 'update' | 'delete' | 'markDone' | 'transition';
  taskId?: string;
}

export const useTasks = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated, getAccessToken, user } = useAuth();
  const queryClient = useQueryClient();
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const ensureToken = useCallback(async () => {
    if (!isAuthenticated) {
      throw new Error('You must be authenticated.');
    }

    await getAccessToken();
  }, [getAccessToken, isAuthenticated]);

  const userKey = user?.sub ?? 'anonymous';
  const tasksQueryKey = useMemo(() => ['tasks', userKey] as const, [userKey]);

  const { data: tasks = [], isFetching, refetch } = useQuery({
    queryKey: tasksQueryKey,
    enabled: isAuthenticated,
    queryFn: async () => {
      await ensureToken();
      return taskApi.list();
    },
    staleTime: 30_000,
    placeholderData: [] as Task[],
  });

  const updateCache = useCallback(
    (mutator: (prev: Task[]) => Task[]) => {
      queryClient.setQueryData<Task[]>(tasksQueryKey, (prev = []) => mutator(prev));
    },
    [queryClient, tasksQueryKey],
  );

  const createTaskMutation = useMutation({
    mutationFn: async (payload: TaskPayload) => {
      await ensureToken();
      return taskApi.create(payload);
    },
    onSuccess: (created) => {
      updateCache((prev) => [created, ...prev]);
      enqueueSnackbar('Task created', { variant: 'success' });
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar('Could not create task', { variant: 'error' });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, payload }: { taskId: string; payload: TaskPayload }) => {
      await ensureToken();
      return taskApi.update(taskId, payload);
    },
    onSuccess: (updated) => {
      updateCache((prev) => prev.map((task) => (task.id === updated.id ? updated : task)));
      enqueueSnackbar('Task updated', { variant: 'success' });
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar('Could not update task', { variant: 'error' });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      await ensureToken();
      await taskApi.remove(taskId);
      return taskId;
    },
    onSuccess: (taskId) => {
      updateCache((prev) => prev.filter((task) => task.id !== taskId));
      enqueueSnackbar('Task deleted', { variant: 'info' });
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar('Could not delete task', { variant: 'error' });
    },
  });

  const markDoneMutation = useMutation({
    mutationFn: async (taskId: string) => {
      await ensureToken();
      return taskApi.markDone(taskId);
    },
    onSuccess: (updated) => {
      updateCache((prev) => prev.map((task) => (task.id === updated.id ? updated : task)));
      enqueueSnackbar('Task marked as done', { variant: 'success' });
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar('Could not mark task as done', { variant: 'error' });
    },
  });

  const transitionMutation = useMutation({
    mutationFn: async ({ taskId, targetStatus }: { taskId: string; targetStatus: TaskStatus }) => {
      await ensureToken();
      return taskApi.transition(taskId, targetStatus);
    },
    onSuccess: (updated) => {
      updateCache((prev) => prev.map((task) => (task.id === updated.id ? updated : task)));
      enqueueSnackbar('Task updated', { variant: 'success' });
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar('Could not update task status', { variant: 'error' });
    },
  });

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) {
      queryClient.setQueryData(tasksQueryKey, []);
      return;
    }

    await refetch();
  }, [isAuthenticated, queryClient, refetch, tasksQueryKey]);

  const createTask = useCallback(
    async (payload: TaskPayload) => {
      setPendingAction({ type: 'create' });
      try {
        await createTaskMutation.mutateAsync(payload);
      } finally {
        setPendingAction(null);
      }
    },
    [createTaskMutation],
  );

  const updateTask = useCallback(
    async (taskId: string, payload: TaskPayload) => {
      setPendingAction({ type: 'update', taskId });
      try {
        await updateTaskMutation.mutateAsync({ taskId, payload });
      } finally {
        setPendingAction(null);
      }
    },
    [updateTaskMutation],
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      setPendingAction({ type: 'delete', taskId });
      try {
        await deleteTaskMutation.mutateAsync(taskId);
      } finally {
        setPendingAction(null);
      }
    },
    [deleteTaskMutation],
  );

  const markTaskDone = useCallback(
    async (taskId: string) => {
      setPendingAction({ type: 'markDone', taskId });
      try {
        await markDoneMutation.mutateAsync(taskId);
      } finally {
        setPendingAction(null);
      }
    },
    [markDoneMutation],
  );

  const transitionTask = useCallback(
    async (taskId: string, targetStatus: TaskStatus) => {
      setPendingAction({ type: 'transition', taskId });
      try {
        await transitionMutation.mutateAsync({ taskId, targetStatus });
      } finally {
        setPendingAction(null);
      }
    },
    [transitionMutation],
  );

  return {
    tasks,
    loading: isFetching,
    pendingAction,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    markTaskDone,
    transitionTask,
  };
};
