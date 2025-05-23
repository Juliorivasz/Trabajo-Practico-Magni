// src/services/LoginService.ts
import { Usuario } from "../models/Usuario"; // Importa tu clase Usuario del frontend
import type { UsuarioApi } from "./types/apiTypes"; // Asumo que `apiTypes` está en la misma carpeta `services` o en `services/types`

const portUrl = `http://localhost:8080`; // Asegúrate de que esta URL sea correcta

// La función parseUsuarioApiToClass está bien aquí
export const parseUsuarioApiToClass = (data: UsuarioApi): Usuario => {
  // Asegúrate de que los datos necesarios existan antes de crear la instancia
  if (data === null || data === undefined) {
    throw new Error("Los datos de UsuarioApi no pueden ser nulos o indefinidos.");
  }
  if (typeof data.id !== "number" || !data.nombreUsuario || !data.rol) {
    throw new Error("Faltan propiedades esenciales en los datos de UsuarioApi.");
  }

  // Creamos la instancia de Usuario. La clave siempre estará vacía aquí.
  return new Usuario(data.id, data.nombreUsuario, data.rol, "");
};

export const LoginServicio = {
  login: async (nombreUsuario: string, clave: string): Promise<Usuario> => {
    try {
      const response = await fetch(`${portUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombreUsuario, clave }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Corrección aquí: solo `throw new Error(...)`, no `new new Error(...)`
        throw new Error(errorData.message || "Credenciales inválidas o error en el servidor.");
      }

      const data: UsuarioApi = await response.json(); // Aseguramos el tipo de `data`
      console.log(parseUsuarioApiToClass(data));
      return parseUsuarioApiToClass(data);
    } catch (error) {
      // Capturamos el error como `any` para un manejo flexible
      console.error("Error en el login:", error);
      // ¡Importante! Re-lanzar el error para que el componente de login lo pueda capturar
      throw error;
    }
  },
};
