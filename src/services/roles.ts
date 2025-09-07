import { apiClient } from '../lib/api';
import { Role } from '@/types';

// eslint-disable-next-line import/no-unused-modules
export const rolesService = {
  getRoles: async (): Promise<Role[]> => {
    const response = await apiClient.get('/roles');
    return response.data;
  },
};
