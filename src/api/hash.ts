import { apiClient } from './client';

export interface HashValidationPayload {
  hash: string;
  codigo_aprobacion: string;
}

export interface HashValidationResponse {
  message: string;
  success: boolean;
  // Agrega otros campos según la respuesta de tu API
}

export interface HashCheckPayload {
  hash: string;
}

export interface HashCheckResponse {
  valid: boolean;
  message: string;
  // Agrega otros campos según la respuesta de tu API
}

export const hashService = {
  validateHash: async (payload: HashValidationPayload): Promise<HashValidationResponse> => {
    const response = await apiClient.put('/personal-utilidades/actualizar-estado-pp', payload);
    return response.data;
  },
  
  checkHashStatus: async (payload: HashCheckPayload): Promise<HashCheckResponse> => {
    const response = await apiClient.post('/personal-utilidades/validar-hash', payload);
    return response.data.data;
  },
};
