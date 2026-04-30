import { apiClient } from './client';
import { UpdateUserPayload } from '../@types';

export const userService = {
  updateUser: async (userId: number, payload: UpdateUserPayload): Promise<void> => {
    await apiClient.put(`/personal-utilidades/actualizar-colaborador/${userId}`, payload);
  },
};