import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

export const PrivateRoute = () => {
    const usuario = useAuthStore((state) => state.usuario);

    if (!usuario) {
        // Redirige al login si no está autenticado
        return <Navigate to="/" replace />;
    }

    // Si está autenticado, renderiza el contenido hijo (Outlet)
    return <Outlet />;
};