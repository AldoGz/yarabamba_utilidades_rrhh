import { apiClient } from './client';

export interface PersonalItem {
  id: number;
  numberDocument: string;
  fullName: string;
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
  statusColor: string;
  statusLabel: string;
  updatedAt: string;
}

export interface BatchItem {
  id: number;
  period: string;
  fileName: string;
  route: string;
  status: string;
}

export interface GroupedByStateResponse {
  success: boolean;
  message: string | null;
  data: {
    lotes: BatchItem[];
    pendientes: PersonalItem[];
    actualizados: PersonalItem[];
    aprobados: PersonalItem[];
    firmados: PersonalItem[];
  };
  errors: string | null;
}

export const fetchGroupedByState = async (): Promise<GroupedByStateResponse> => {
  try {
    const response = await apiClient.get('/personal-utilidades/agrupados-por-estado');
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
    const response = await apiClient.put('/personal-utilidades/batch/enviar-correo', { ids });
    return response.data;
  } catch (error) {
    console.error('Error sending bulk email:', error);
    throw error;
  }
};

export interface BatchCreateRequest {
  ids: number[];
}

export interface BatchCreateResponse {
  success: boolean;
  message: string;
  batchCount?: number;
  batchId?: string;
}

export const createBatch = async (ids: number[]): Promise<BatchCreateResponse> => {
  try {
    const response = await apiClient.put('/personal-utilidades/crear-lote', { ids });
    return response.data;
  } catch (error) {
    console.error('Error creating batch:', error);
    throw error;
  }
};

export interface BatchEmailSendRequest {
  lotes: string[];
}

export interface BatchEmailSendResponse {
  success: boolean;
  message: string;
  sentCount?: number;
  failedCount?: number;
}

export const sendBatchEmail = async (lotes: string[]): Promise<BatchEmailSendResponse> => {
  try {
    const response = await apiClient.put('/personal-utilidades/batch/colaborador/enviar-correo', { lotes });
    return response.data;
  } catch (error) {
    console.error('Error sending batch email:', error);
    throw error;
  }
};
