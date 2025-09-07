{
  /* eslint-disable import/no-unused-modules */
}
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, LoginResponse } from '../services/auth';
import { UserLogin, UserCreate } from '@/types';

export const useLogin = () => {
  return useMutation<LoginResponse, Error, UserLogin>({
    mutationFn: authService.login,
    onSuccess: data => {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
    },
  });
};

export const useRegister = () => {
  return useMutation<LoginResponse, Error, UserCreate>({
    mutationFn: authService.register,
    onSuccess: data => {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user', 'current'],
    queryFn: authService.getCurrentUser,
    enabled: !!localStorage.getItem('access_token'),
  });
};

export const useUpdateName = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.updateName,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'current'] });
    },
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: authService.updatePassword,
  });
};
