// src/componentes/abmInstrumentos.tsx
import { useEffect, useState } from "react";
import { FormularioInstrumento } from "../componentes/formInstrumentos"; // Asumo que este es tu formulario para crear/editar
import { BotonNavegar } from "./botones"; // Asumo que este es un componente de botón genérico
import { deleteInstrumento, fetchInstrumentos } from "../services/instrumentosServicio";
import { Instrumento } from "../models/Instrumento";
import { useAuth } from "../context/useAuth";

export function AbmInstrumentos() {
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
  const [instrumentoEditar, setInstrumentoEditar] = useState<Instrumento | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Obtén el estado de autenticación y el rol del usuario
  const { isAdmin, isAuthenticated } = useAuth(); // Importamos isAdmin, isAuthenticated y el objeto user

  // Carga los instrumentos desde la API
  const cargarInstrumentos = () => {
    fetchInstrumentos()
      .then((data) => setInstrumentos(data))
      .catch((err) => console.error("Error al cargar instrumentos:", err));
  };

  useEffect(() => {
    // Solo carga instrumentos si el usuario está autenticado
    if (isAuthenticated) {
      cargarInstrumentos();
    } else {
      // Opcional: podrías limpiar los instrumentos si el usuario no está autenticado
      setInstrumentos([]);
      console.log("No autenticado, no se cargan instrumentos para ABM.");
    }
  }, [isAuthenticated]); // Dependencia en isAuthenticated para recargar si el estado cambia

  const handleAgregar = () => {
    setInstrumentoEditar(null);
    setMostrarFormulario(true);
  };

  const handleEditar = (inst: Instrumento) => {
    setInstrumentoEditar(inst);
    setMostrarFormulario(true);
  };

  const handleEliminar = (id?: number) => {
    if (!id) return;
    // Aquí puedes añadir una pequeña validación extra por si acaso, aunque ya la ruta está protegida
    if (!isAdmin) {
      alert("No tienes permisos de administrador para eliminar instrumentos.");
      return;
    }
    deleteInstrumento(id)
      .then((res) => {
        if (!res) {
          // Si el backend responde con un error pero no lanza una excepción,
          // puedes manejarlo aquí (por ejemplo, si el servidor devuelve un 403 Forbidden).
          // Es mejor si tu `instrumentosServicio` ya lanza un error para un manejo más limpio.
          throw new Error("Error eliminando instrumento (posible falta de permisos).");
        }
        cargarInstrumentos();
      })
      .catch(console.error);
  };

  const onGuardado = () => {
    cargarInstrumentos();
    setMostrarFormulario(false);
  };

  const onCerrar = () => setMostrarFormulario(false);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <BotonNavegar
          texto="Volver al inicio"
          destino="/home"
        />
      </div>
      <h2 className="text-2xl font-bold mb-4">Administrar Instrumentos</h2>

      {/* Mensaje si el usuario no está autenticado o si no hay instrumentos cargados */}
      {!isAuthenticated ? (
        <p className="text-red-500 text-center text-lg mt-8">
          Debes iniciar sesión para ver los instrumentos en este ABM.
        </p>
      ) : (
        <>
          {/* Botón "Agregar Instrumento" solo visible para Administradores */}
          {isAdmin && !mostrarFormulario && (
            <button
              onClick={handleAgregar}
              className="mb-4 bg-cyan-600 text-white px-4 py-2 rounded">
              Agregar Instrumento
            </button>
          )}

          {!mostrarFormulario ? (
            <table className="w-full border border-gray-300 bg-[#ddd]">
              <thead>
                <tr>
                  <th className="border p-2">Instrumento</th>
                  <th className="border p-2">Marca</th>
                  <th className="border p-2">Modelo</th>
                  <th className="border p-2">Precio</th>
                  <th className="border p-2">Categoría</th>
                  <th className="border p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {instrumentos.length > 0 ? (
                  instrumentos.map((inst) => (
                    <tr key={inst.getId()}>
                      <td className="border p-2">{inst.getInstrumento()}</td>
                      <td className="border p-2">{inst.getMarca()}</td>
                      <td className="border p-2">{inst.getModelo()}</td>
                      <td className="border p-2">{inst.getPrecio()}</td>
                      <td className="border p-2">{inst.getCategoria()?.getDenominacion() ?? "-"}</td>
                      <td className="border p-2 space-x-2">
                        {/* Botones de Editar y Eliminar solo visibles para Administradores */}
                        {isAdmin ? (
                          <>
                            <button
                              onClick={() => handleEditar(inst)}
                              className="bg-yellow-400 px-2 py-1 rounded">
                              Editar
                            </button>
                            <button
                              onClick={() => handleEliminar(inst.getId())}
                              className="bg-red-600 text-white px-2 py-1 rounded">
                              Eliminar
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-500 text-sm">(Solo Admin)</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center p-4">
                      {isAuthenticated ? "No hay instrumentos cargados." : "Inicia sesión para ver instrumentos."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            // Formulario de Instrumento visible para todos los autenticados que acceden a ABM
            // Pero la lógica de guardado/actualización del formulario debería depender de los permisos de escritura
            // (Ver nota abajo sobre FormularioInstrumento)
            <FormularioInstrumento
              instrumentoInicial={instrumentoEditar}
              onCerrar={onCerrar}
              onGuardado={onGuardado}
              // Puedes pasar isAdmin aquí si FormularioInstrumento necesita saberlo para deshabilitar campos
              // isAdmin={isAdmin}
            />
          )}
        </>
      )}
    </div>
  );
}
