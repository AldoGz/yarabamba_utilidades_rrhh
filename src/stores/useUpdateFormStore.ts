import { create } from 'zustand';

interface UpdateFormState {
  // Datos del formulario
  banco: string;
  cuenta: string;
  cci: string;
  correo: string;
  tel1: string;
  tel2: string;
  // Flags de validación/UI
  errorCci: boolean;
  errorTel1: boolean;
  guardado: boolean; // para mostrar feedback
  // Actions
  setBanco: (value: string) => void;
  setCuenta: (value: string) => void;
  setCci: (value: string) => void;
  setCorreo: (value: string) => void;
  setTel1: (value: string) => void;
  setTel2: (value: string) => void;
  validateForm: () => boolean; // valida y actualiza flags, retorna si es válido
  resetForm: () => void;
  setGuardado: (value: boolean) => void;
}

export const useUpdateFormStore = create<UpdateFormState>((set, get) => ({
  banco: '',
  cuenta: '',
  cci: '',
  correo: '',
  tel1: '',
  tel2: '',
  errorCci: false,
  errorTel1: false,
  guardado: false,

  setBanco: (banco) => set({ banco }),
  setCuenta: (cuenta) => set({ cuenta }),
  setCci: (cci) => set({ cci }),
  setCorreo: (correo) => set({ correo }),
  setTel1: (tel1) => set({ tel1 }),
  setTel2: (tel2) => set({ tel2 }),
  setGuardado: (guardado) => set({ guardado }),

  validateForm: () => {
    const { cci, tel1 } = get();
    const isValidCci = cci.length === 20;
    const isValidTel1 = tel1.length > 0; // o usar regex para validar celular
    set({
      errorCci: cci.length > 0 && cci.length !== 20,
      errorTel1: tel1.length === 0,
    });
    return isValidCci && isValidTel1;
  },

  resetForm: () =>
    set({
      banco: '',
      cuenta: '',
      cci: '',
      correo: '',
      tel1: '',
      tel2: '',
      errorCci: false,
      errorTel1: false,
      guardado: false,
    }),
}));
