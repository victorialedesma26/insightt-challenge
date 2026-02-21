import axios from 'axios';
import type { Task, TaskPayload, TaskStatus } from '../types/task';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

const client = axios.create({
  baseURL,
  timeout: 10_000,
});

const authHeaders = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

interface ApiCollection<T> {
  data: T;
}

export const taskApi = {
  async list(token: string): Promise<Task[]> {
    const response = await client.get<ApiCollection<Task[]>>('/tasks', authHeaders(token));
    return response.data.data;
  },

  async create(token: string, payload: TaskPayload): Promise<Task> {
    const response = await client.post<ApiCollection<Task>>('/tasks', payload, authHeaders(token));
    return response.data.data;
  },

  async update(token: string, taskId: string, payload: TaskPayload): Promise<Task> {
    const response = await client.patch<ApiCollection<Task>>(`/tasks/${taskId}`, payload, authHeaders(token));
    return response.data.data;
  },

  async remove(token: string, taskId: string): Promise<void> {
    await client.delete(`/tasks/${taskId}`, authHeaders(token));
  },

  async markDone(token: string, taskId: string): Promise<Task> {
    const response = await client.post<ApiCollection<Task>>(`/tasks/${taskId}/done`, null, authHeaders(token));
    return response.data.data;
  },

  async transition(token: string, taskId: string, targetStatus: TaskStatus): Promise<Task> {
    const response = await client.post<ApiCollection<Task>>(
      `/tasks/${taskId}/transition`,
      { targetStatus },
      authHeaders(token),
    );
    return response.data.data;
  },
};
