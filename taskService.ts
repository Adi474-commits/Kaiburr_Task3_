import axios from 'axios';
import { Task, TaskFormData, TaskExecution } from '../types/task';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskService = {
  // Get all tasks
  getAllTasks: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  },

  // Get task by ID
  getTaskById: async (id: string): Promise<Task> => {
    const response = await api.get<Task>(`/tasks?id=${id}`);
    return response.data;
  },

  // Create or update task
  createTask: async (task: TaskFormData): Promise<Task> => {
    const response = await api.put<Task>('/tasks', task);
    return response.data;
  },

  // Update existing task
  updateTask: async (task: Task): Promise<Task> => {
    const response = await api.put<Task>('/tasks', task);
    return response.data;
  },

  // Delete task
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  // Search tasks by name
  searchTasks: async (name: string): Promise<Task[]> => {
    const response = await api.get<Task[]>(`/tasks/search?name=${encodeURIComponent(name)}`);
    return response.data;
  },

  // Execute task
  executeTask: async (id: string): Promise<TaskExecution> => {
    const response = await api.put<TaskExecution>(`/tasks/${id}/execute`);
    return response.data;
  },
};

export default taskService;
