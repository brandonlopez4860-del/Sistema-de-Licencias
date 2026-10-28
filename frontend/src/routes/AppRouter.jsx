import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/auth/Login';
import SystemLayout from '../layouts/SystemLayout';
import ManageTeam from '../pages/system/ManageTeam';
import Profile from '../pages/system/Profile';
import EscalafonConsultas from '../pages/system/EscalafonConsultas';
import RegistroEscalafon from '../pages/system/RegistroEscalafon';
import RegistroRemuneracion from '../pages/system/RegistroRemuneracion';
import RegistroTrabajador from '../pages/system/RegistroTrabajador';
import RegistroInstitucion from '../pages/system/RegistroInstitucion';
import RemuneracionConsultas from '../pages/system/RemuneracionConsultas';
import Dashboard from '../pages/system/Dashboard'; // <-- NUEVO IMPORT

export default function AppRouter() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />

        <Route path="/" element={isAuthenticated ? <SystemLayout /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          {/* Añadimos las rutas de escalafón */}
          <Route path="registro/escalafon" element={<RegistroEscalafon />} />
          <Route path="registro/remuneracion" element={<RegistroRemuneracion />} />
          <Route path="consultas/escalafon" element={<EscalafonConsultas />} />
          <Route path="consultas/remuneracion" element={<RemuneracionConsultas />} />
          <Route path="trabajadores" element={<RegistroTrabajador />} />
          <Route path="instituciones" element={<RegistroInstitucion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}