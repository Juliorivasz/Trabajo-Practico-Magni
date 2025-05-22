import { useEffect, useState } from "react";
import { BotonNavegar } from "../componentes/botones";
import type { Instrumento } from "../componentes/formInstrumentos";
import { MostrarInstrumentos } from "../componentes/mostrarInstrumentos";

export function Catalogo() {
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/instrumentos")
      .then(res => res.json())
      .then(setInstrumentos)
      .catch(err => {
        console.error("Error al cargar instrumentos:", err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 space-y-6">
      {/* HEADER */}
      <header className="w-full max-w-5xl">
        <div className="w-full flex p-4 space-x-4">
          <BotonNavegar texto="Home" destino="/home" />
          <BotonNavegar texto="Donde Estamos" destino="/home/donde-estamos" />
        </div>
        <h1 className="text-black text-5xl font-bold border-b pb-2 mb-4">
          Catálogo de Instrumentos
        </h1>
      </header>

      {/* CONTENIDO */}
      <main className="w-full max-w-5xl">
        <MostrarInstrumentos instrumentos={instrumentos} />
      </main>
    </div>
  );
}


