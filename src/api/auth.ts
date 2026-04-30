import { apiClient } from "./client";
import { ValidationPayload, Usuario } from "../@types";

export const authService = {
  validateUser: async (payload: ValidationPayload): Promise<Usuario> => {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: Usuario;
    }>("/personal-utilidades/buscar-colaborador", payload);
    
    const userData = response.data.data;
    
    // Si el estado es diferente a "IN", significa que los datos ya están actualizados
    if (userData.estado !== "IN") {
      throw new Error("DATOS_ACTUALIZADOS");
    }
    
    return userData;
  },
};
