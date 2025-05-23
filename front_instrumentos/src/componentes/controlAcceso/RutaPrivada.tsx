import React, { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

interface RutasPrivadasProps {
  children: ReactNode;
  rolesPermitidos?: string[]; // Opcional: para especificar qué roles pueden acceder
}

export const RutasPrivada: React.FC<RutasPrivadasProps> = ({ children, rolesPermitidos }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // Si no está autenticado, redirige a la página de login
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (rolesPermitidos && user && !rolesPermitidos.includes(user.rol)) {
    // Si está autenticado pero no tiene el rol permitido, redirige a una página de no autorizado
    // O simplemente al home/login con un mensaje de error
    alert("No tienes permiso para acceder a esta página."); // Mensaje simple
    return (
      <Navigate
        to="/login"
        replace
      />
    ); // O a "/acceso-denegado"
  }

  return <>{children}</>; // Si está autenticado y tiene el rol, renderiza el contenido
};
