import { useCallback, useEffect, useState } from 'react';
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
  const { isAuthenticated, getAccessToken } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const ensureToken = useCallback(async () => {
    if (!isAuthenticated) {
      throw new Error('You must be authenticated.');
    }

    await getAccessToken();
  }, [getAccessToken, isAuthenticated]);

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) {
      setTasks([]);
      return;
    }

    setLoading(true);
    try {
      await ensureToken();
      const data = await taskApi.list();
      setTasks(data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to load tasks', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, ensureToken, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      void fetchTasks();
    } else {
      setTasks([]);
    }
  }, [fetchTasks, isAuthenticated]);

  const createTask = useCallback(
    async (payload: TaskPayload) => {
      setPendingAction({ type: 'create' });
      try {
        await ensureToken();
        const created = await taskApi.create(payload);
        setTasks((prev) => [created, ...prev]);
        enqueueSnackbar('Task created', { variant: 'success' });
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Could not create task', { variant: 'error' });
        throw error;
      } finally {
        setPendingAction(null);
      }
    },
    [enqueueSnackbar, ensureToken],
  );

  const updateTask = useCallback(
    async (taskId: string, payload: TaskPayload) => {
      setPendingAction({ type: 'update', taskId });
      try {
        await ensureToken();
        const updated = await taskApi.update(taskId, payload);
        setTasks((prev) => prev.map((task) => (task.id === taskId ? updated : task)));
        enqueueSnackbar('Task updated', { variant: 'success' });
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Could not update task', { variant: 'error' });
        throw error;
      } finally {
        setPendingAction(null);
      }
    },
    [enqueueSnackbar, ensureToken],
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      setPendingAction({ type: 'delete', taskId });
      try {
        await ensureToken();
        await taskApi.remove(taskId);
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
        enqueueSnackbar('Task deleted', { variant: 'info' });
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Could not delete task', { variant: 'error' });
        throw error;
      } finally {
        setPendingAction(null);
      }
    },
    [enqueueSnackbar, ensureToken],
  );

  const markTaskDone = useCallback(
    async (taskId: string) => {
      setPendingAction({ type: 'markDone', taskId });
      try {
        await ensureToken();
        const updated = await taskApi.markDone(taskId);
        setTasks((prev) => prev.map((task) => (task.id === taskId ? updated : task)));
        enqueueSnackbar('Task marked as done', { variant: 'success' });
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Could not mark task as done', { variant: 'error' });
        throw error;
      } finally {
        setPendingAction(null);
      }
    },
    [enqueueSnackbar, ensureToken],
  );

  const transitionTask = useCallback(
    async (taskId: string, targetStatus: TaskStatus) => {
      setPendingAction({ type: 'transition', taskId });
      try {
        await ensureToken();
        const updated = await taskApi.transition(taskId, targetStatus);
        setTasks((prev) => prev.map((task) => (task.id === taskId ? updated : task)));
        enqueueSnackbar('Task updated', { variant: 'success' });
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Could not update task status', { variant: 'error' });
        throw error;
      } finally {
        setPendingAction(null);
      }
    },
    [enqueueSnackbar, ensureToken],
  );

  return {
    tasks,
    loading,
    pendingAction,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    markTaskDone,
    transitionTask,
  };
};
