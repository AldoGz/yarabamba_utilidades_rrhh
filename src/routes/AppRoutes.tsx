import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import PageValidator from '../pages/PageValidator';
import PageUpdate from '../pages/PageUpdate';
import HashPage from '../pages/HashPage';
import GroupedByStatePage from '../pages/GroupedByStatePage';

export const AppRoutes = () => {
    return (
        <Routes>
            {/* Ruta pública */}
            <Route path="/" element={<PageValidator />} />

            {/* Ruta con hash - pública */}
            <Route path="/hash/:hash" element={<HashPage />} />
            <Route path="/estados" element={<GroupedByStatePage />} />

            {/* Rutas protegidas (agrupa todas las que requieren autenticación) */}
            <Route element={<PrivateRoute />}>
                <Route path="/actualizacion" element={<PageUpdate />} />
                
                {/* Aquí puedes agregar más rutas protegidas fácilmente */}
            </Route>

            {/* Ruta 404 (opcional) */}
            <Route path="*" element={<div>404 - Página no encontrada</div>} />
        </Routes>
    );
};