// hooks/useValidateUser.ts
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { authService } from "../api/auth";
import { useAuthStore } from "../stores/useAuthStore";
import { ValidationPayload, Usuario, ApiError } from "../@types";

export const useValidateUser = (): UseMutationResult<
  Usuario,
  ApiError,
  ValidationPayload
> => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (payload: ValidationPayload) =>
      authService.validateUser(payload),
    onSuccess: (usuario) => {
      console.log(usuario);
      
      // Verificar si el estado es diferente de "IN"
      if (usuario.estado !== 'IN') {
        // No crear el localstore y lanzar error
        throw new Error('USUARIO_YA_ACTUALIZADO');
      }
      
      login(usuario);
    },
    onError: (error) => {
      return error;
      /* if (error instanceof Error && error.message === "USUARIO_YA_ACTUALIZADO") {
        // El usuario ya actualizó su registro, no crear localstore
        console.log("El usuario ya actualizó su registro");
        // El componente que usa este hook debe manejar este error
      } else if (error instanceof Error && error.message === "DATOS_ACTUALIZADOS") {
        // El usuario ya tiene sus datos actualizados, mostrar pantalla especial
        // Aquí podrías redirigir a una página de "datos ya actualizados"
        // o mostrar un modal/message especial
        console.log("Los datos del usuario ya están actualizados");
        // Por ahora, puedes manejar esto en el componente que usa este hook
      } */
    },
  });
};
