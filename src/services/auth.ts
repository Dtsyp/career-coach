import { apiClient } from '../lib/api';
import { UserPublic, UserCreate, UserLogin } from '@/types';

// eslint-disable-next-line import/no-unused-modules
export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: UserPublic;
}

// eslint-disable-next-line import/no-unused-modules
export const authService = {
  login: async ({ email, password }: UserLogin): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: UserCreate): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async (): Promise<UserPublic> => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  updateName: async (name: string): Promise<UserPublic> => {
    const response = await apiClient.patch('/users/update_name', { name });
    return response.data;
  },

  updatePassword: async (password: string): Promise<void> => {
    await apiClient.patch('/users/update_password', { password });
  },
};
