import axios, { AxiosHeaders } from 'axios';
import type { Task, TaskPayload, TaskStatus } from '../types/task';
import { getStoredToken } from './tokenStorage';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

const client = axios.create({
  baseURL,
  timeout: 10_000,
});

client.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

interface ApiCollection<T> {
  data: T;
}

export const taskApi = {
  async list(): Promise<Task[]> {
    const response = await client.get<ApiCollection<Task[]>>('/tasks');
    return response.data.data;
  },

  async create(payload: TaskPayload): Promise<Task> {
    const response = await client.post<ApiCollection<Task>>('/tasks', payload);
    return response.data.data;
  },

  async update(taskId: string, payload: TaskPayload): Promise<Task> {
    const response = await client.patch<ApiCollection<Task>>(`/tasks/${taskId}`, payload);
    return response.data.data;
  },

  async remove(taskId: string): Promise<void> {
    await client.delete(`/tasks/${taskId}`);
  },

  async markDone(taskId: string): Promise<Task> {
    const response = await client.post<ApiCollection<Task>>(`/tasks/${taskId}/done`);
    return response.data.data;
  },

  async transition(taskId: string, targetStatus: TaskStatus): Promise<Task> {
    const response = await client.post<ApiCollection<Task>>(
      `/tasks/${taskId}/transition`,
      { targetStatus },
    );
    return response.data.data;
  },
};
