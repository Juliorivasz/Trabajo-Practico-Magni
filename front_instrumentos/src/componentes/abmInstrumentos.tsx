import { useEffect, useState } from "react";
import { FormularioInstrumento } from "../componentes/formInstrumentos";
import { BotonNavegar } from "./botones";
import { deleteInstrumento, fetchInstrumentos } from "../services/instrumentosServicio";
import { Instrumento } from "../models/Instrumento";

export function AbmInstrumentos() {
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
  const [instrumentoEditar, setInstrumentoEditar] = useState<Instrumento | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Carga los instrumentos desde la API
  const cargarInstrumentos = () => {
    fetchInstrumentos()
      .then((data) => setInstrumentos(data))
      .catch((err) => console.error("Error al cargar instrumentos:", err));
  };

  useEffect(() => {
    cargarInstrumentos();
  }, []);

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
    deleteInstrumento(id)
      .then((res) => {
        if (!res) throw new Error("Error eliminando");
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

      {!mostrarFormulario ? (
        <>
          <button
            onClick={handleAgregar}
            className="mb-4 bg-cyan-600 text-white px-4 py-2 rounded">
            Agregar Instrumento
          </button>

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
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center p-4">
                    No hay instrumentos cargados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      ) : (
        <FormularioInstrumento
          instrumentoInicial={instrumentoEditar}
          onCerrar={onCerrar}
          onGuardado={onGuardado}
        />
      )}
    </div>
  );
}
