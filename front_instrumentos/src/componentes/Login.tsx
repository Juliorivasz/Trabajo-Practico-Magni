import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth"; // Asegúrate de que esta ruta sea correcta

export const Login = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState<string | null>(null); // Estado para mostrar el mensaje de error
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Obtiene la función de login del contexto

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpiar cualquier error previo antes de un nuevo intento
    setCargando(true); // Indicar que la petición está en curso

    // Validaciones básicas del lado del cliente
    if (!nombreUsuario.trim() || !clave.trim()) {
      setError("Por favor, ingresa tu usuario y contraseña.");
      setCargando(false);
      return;
    }

    try {
      await login(nombreUsuario, clave); // Llama a la función login del AuthContext
      navigate("/home"); // Redirige a la página principal tras un login exitoso
    } catch (err: unknown) {
      // ¡Cambiado de 'any' a 'unknown'!
      // Captura el error que fue re-lanzado por LoginServicio
      console.error("Error al iniciar sesión:", err);

      // Verificamos si el error es una instancia de Error para acceder a su propiedad 'message'
      if (err instanceof Error) {
        // El mensaje de error que viene de LoginServicio.ts
        // ya debería ser "Credenciales inválidas o error en el servidor."
        // o el mensaje específico que tu backend devuelva.
        setError(err.message || "Error desconocido al iniciar sesión. Intenta de nuevo.");
      } else {
        // Si el error no es una instancia de Error (ej. un string o un objeto genérico)
        setError("Ocurrió un error inesperado al iniciar sesión.");
      }
    } finally {
      setCargando(false); // Siempre deshabilitar el estado de carga al finalizar
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h2>
        <p className="text-center text-gray-600 mb-8">Bienvenido de nuevo</p>

        {/* Muestra el mensaje de error si existe */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert">
            <strong className="font-bold">¡Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6">
          <div>
            <label
              htmlFor="nombreUsuario"
              className="block text-sm font-medium text-gray-700 mb-2">
              Usuario
            </label>
            <input
              type="text"
              id="nombreUsuario"
              name="nombreUsuario"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              placeholder="Tu usuario"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={cargando}
            />
          </div>

          <div>
            <label
              htmlFor="clave"
              className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="clave"
              name="clave"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              placeholder="Tu contraseña"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={cargando}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out font-semibold text-lg"
            disabled={cargando}>
            {cargando ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-sm">
          ¿Olvidaste tu contraseña?{" "}
          <a
            href="#"
            className="text-blue-600 hover:underline">
            Recupérala aquí
          </a>
        </p>
        <p className="mt-2 text-center text-gray-500 text-sm">
          ¿No tienes una cuenta?{" "}
          <a
            href="#"
            className="text-blue-600 hover:underline">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
};
