import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import GroupedByStatePage from '../pages/GroupedByStatePage';

export const AppRoutes = () => {
    return (
        <Routes>
            {/* Ruta pública */}
            <Route path="/" element={<GroupedByStatePage />} />


            {/* Rutas protegidas (agrupa todas las que requieren autenticación) */}
            <Route element={<PrivateRoute />}>
                
                {/* Aquí puedes agregar más rutas protegidas fácilmente */}
            </Route>

            {/* Ruta 404 (opcional) */}
            <Route path="*" element={<div>404 - Página no encontrada</div>} />
        </Routes>
    );
};