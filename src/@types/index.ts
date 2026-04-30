export interface Usuario {
  id: number;
  numeroDocumento: string;
  nombresCompletos: string;
  periodo: string;
  importe: number;
  idBanco: number;
  cuentaBancaria: string;
  cci: string;
  email: string;
  phone1: string;
  phone2: string | null;
  esLaborando: boolean;
  estado: string;
  lote: string | null;
}

export interface ValidationPayload {
  dni: string;
  verificador: string;
}

export interface UpdateUserPayload {
  id_banco: number;
  cuenta_bancaria: string;
  cci: string;
  email: string;
  telefono_1: string;
  telefono_2: string;
}

export interface ApiError {
  code: number;
  msg: string;
}
