import React, { useState, useEffect, type ReactNode } from "react";
import type { UserAuth } from "./AuthContext";
import { LoginServicio } from "../services/loginServicio";
import { AuthContext } from "./AuthContext";

// Proveedor del contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Inicializa el usuario desde localStorage si existe
  const [user, setUser] = useState<UserAuth | null>(() => {
    try {
      const storedUser = localStorage.getItem("userAuth");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      return null;
    }
  });

  // Efecto para guardar el usuario en localStorage cada vez que cambia
  useEffect(() => {
    if (user) {
      console.log(user);
      localStorage.setItem("userAuth", JSON.stringify(user));
    } else {
      localStorage.removeItem("userAuth");
    }
  }, [user]);

  const isAuthenticated = !!user; // true si hay un usuario logueado
  const isAdmin = user?.rol === "Admin";
  const isOperador = user?.rol === "Operador";
  const isVisor = user?.rol === "Visor";

  const login = async (nombreUsuario: string, clave: string) => {
    try {
      const responseData = await LoginServicio.login(nombreUsuario, clave);
      // responseData contiene id, nombreUsuario, rol
      const loggedInUser: UserAuth = {
        id: responseData.getIdUsuario(),
        nombreUsuario: responseData.getNombreUsuario(),
        rol: responseData.getRol(),
      };
      setUser(loggedInUser);
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Re-lanza el error para que el componente de login lo maneje
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isOperador,
    isVisor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto de autenticación
