import { apiClient } from './client';

export interface PersonalItem {
  id: number;
  numberDocument: string;
  period: string;
  amount: number;
  bankId: number;
  bankAccountNumber: string;
  cci: string;
  email: string;
  phone1: string;
  phone2: string | null;
  isWorking: boolean;
  status: string;
  batch: string | null;
}

export interface GroupedByStateResponse {
  success: boolean;
  data: {
    pendientes: PersonalItem[];
    actualizados: PersonalItem[];
    aprobados: PersonalItem[];
    firmados: PersonalItem[];
  };
}

export const fetchGroupedByState = async (): Promise<GroupedByStateResponse> => {
  try {
    const response = await apiClient.post('/personal-utilidades/agrupados-por-estado');
    return response.data;
  } catch (error) {
    console.error('Error fetching grouped by state data:', error);
    throw error;
  }
};

export interface BulkUpdateRequest {
  ids: number[];
}

export interface BulkUpdateResponse {
  success: boolean;
  message: string;
  updatedCount?: number;
}

export const bulkUpdateStatus = async (ids: number[]): Promise<BulkUpdateResponse> => {
  try {
    const response = await apiClient.put('/personal-utilidades/actualizar-estado-masivo', { ids });
    return response.data;
  } catch (error) {
    console.error('Error updating bulk status:', error);
    throw error;
  }
};

export interface EmailSendRequest {
  ids: number[];
}

export interface EmailSendResponse {
  success: boolean;
  message: string;
  sentCount?: number;
  failedCount?: number;
}

export const sendBulkEmail = async (ids: number[]): Promise<EmailSendResponse> => {
  try {
    const response = await apiClient.post('/personal-utilidades/enviar-correo-masivo', { ids });
    return response.data;
  } catch (error) {
    console.error('Error sending bulk email:', error);
    throw error;
  }
};
