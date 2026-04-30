import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Usuario } from "../@types";


interface AuthState {
  usuario: Usuario | null;
  login: (usuario: Usuario) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      login: (usuario) => set({ usuario }),
      logout: () => set({ usuario: null }),
    }),
    {
      name: "auth-storage", // clave en localStorage
      storage: createJSONStorage(() => localStorage), // persiste al recargar
    },
  ),
);
