// Home.tsx
import { useEffect, useState } from "react";
import { BotonNavegar } from "../componentes/botones";
import { CarruselSlide } from "../componentes/carrouselPortada";
import { MostrarInstrumentos } from "../componentes/mostrarInstrumentos";
import { Ubicacion } from "./DondeEstamos";
import { useCart } from "../context/useCart";
import { fetchInstrumentos } from "../services/instrumentosServicio";
import type { Instrumento } from "../models/Instrumento";

export function Home() {
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);

  const { carrito } = useCart();
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  console.log(carrito);

  useEffect(() => {
    fetchInstrumentos().then((data) => {
      setInstrumentos(data);
    });
  }, []);

  return (
    <div className="min-h-screen w-full bg-cyan-100 flex flex-col items-center p-6">
      <header className="w-full max-w-screen bg-white p-4 rounded shadow">
        <h1 className="text-5xl font-serif font-bold text-center text-cyan-700">Musical Hendrix</h1>
        <div className="w-full flex p-4 space-x-4">
          <BotonNavegar
            texto="Home"
            destino="/home"
          />
          <BotonNavegar
            texto="Catálogo"
            destino="/home#catalogo"
          />
          <BotonNavegar
            texto="Donde Estamos"
            destino="/home#ubicacion"
          />
          <BotonNavegar
            texto="Gestión ABM"
            destino="/abm"
          />
          <BotonNavegar
            texto={`Carrito ( ${totalItems} )`}
            destino="/carrito"
          />
        </div>
      </header>

      <main className="w-full max-w-7xl mt-6 space-y-6">
        <CarruselSlide />
        <p className="text-lg text-gray-800 text-center font-bold">
          Musical Hendrix es una tienda de instrumentos musicales con ya más de 15 años de experiencia.
          <br /> Tenemos el conocimiento y la capacidad como para informarte acerca de las mejores elecciones para tu
          compra musical.
        </p>

        <section id="ubicacion">
          <Ubicacion />
        </section>

        <section id="catalogo">
          <h2 className="text-2xl text-gray-800 text-center font-bold mt-4">Catálogo de Productos</h2>
          <div className="max-w-5xl mx-auto">
            <MostrarInstrumentos instrumentos={instrumentos} />
          </div>
        </section>
      </main>
    </div>
  );
}
