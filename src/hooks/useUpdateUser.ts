import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { userService } from "../api/user";
import { useAuthStore } from "../stores/useAuthStore";
import { useUpdateFormStore } from "../stores/useUpdateFormStore";
import { UpdateUserPayload, ApiError } from "../@types";

export const useUpdateUser = (): UseMutationResult<
  void,
  ApiError,
  UpdateUserPayload
> => {
  const usuario = useAuthStore((state) => state.usuario);
  const setGuardado = useUpdateFormStore((state) => state.setGuardado);
  const resetForm = useUpdateFormStore((state) => state.resetForm);

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => {
      if (!usuario) throw new Error("Usuario no autenticado");
      // Usar el ID del usuario
      return userService.updateUser(usuario.id, payload);
    },
    onSuccess: () => {
      setGuardado(true);
      // Opcional: resetear formulario tras 2 segundos
      setTimeout(() => {
        setGuardado(false);
        resetForm();
      }, 2000);
    },
    onError: (error) => {
      console.error('Error al actualizar usuario:', error);
      // El error será manejado en el componente que usa el hook
    },
  });
};
