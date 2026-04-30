// hooks/usePageValidator.tsx
import { useForm, FormProvider, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useValidateUser } from "./useValidateUser";

// Esquema de validación
const schema = z.object({
  dni: z.string().length(8, "Ingrese los 8 dígitos del DNI"),
  verificador: z.string().length(1, "Ingrese 1 dígito"),
});

export type FormData = z.infer<typeof schema>;

// Hook que provee el contexto del formulario
export const usePageValidator = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const { mutate, isPending, error } = useValidateUser();

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { dni: "", verificador: "" },
  });

  const { handleSubmit, getValues } = methods;

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onSuccess: () => navigate("/actualizacion"),
      onError: (err) => {
        console.error(err);
        
        // Verificar si el error es de usuario ya actualizado
        if (err.msg === "DATOS_ACTUALIZADOS") {
          // Abrir modal para mostrar mensaje
          handleOpenModal();
        }
      },
    });
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  // Retornamos todo lo necesario para el provider y el estado global
  return {
    formMethods: methods,
    handleSubmit: handleSubmit(onSubmit),
    isPending,
    error,
    modalOpen,
    handleOpenModal,
    handleCloseModal,
  };
};
