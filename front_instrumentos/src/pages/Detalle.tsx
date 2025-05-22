import { DetalleInstrumento } from "../componentes/detalleInstrumento";

export function Detalle() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 space-y-6">
      {/* HEADER */}
      <header className="w-full max-w-5xl">
        <h1 className="text-black text-5xl font-bold border-b pb-2 mb-4">Conoce mejor nuestros instrumentos</h1>
      </header>

      {/* CONTENIDO */}
      <main className="w-full max-w-5xl">
        <DetalleInstrumento />
      </main>
    </div>
  );
}
