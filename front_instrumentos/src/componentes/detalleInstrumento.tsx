import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BotonAgregarCarrito, BotonNavegar } from "./botones";
import { envioGratis } from "./envioGratits";
import { Instrumento } from "../models/Instrumento";
import { useCart } from "../context/useCart";
import { fetchInstrumento } from "../services/instrumentosServicio";

export function DetalleInstrumento() {
  const { id } = useParams<{ id: string }>();
  const { agregarAlCarrito } = useCart();
  const [instrumento, setInstrumento] = useState<Instrumento | null>(null);

  useEffect(() => {
    if (id) {
      fetchInstrumento(id).then((data) => {
        setInstrumento(data);
      });
    }
  }, [id]);

  if (!instrumento) return <p>Cargando...</p>;

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start p-4">
      {/* Columna izquierda: imagen + descripción */}
      <div className="flex flex-col items-center md:w-1/2">
        <img
          src={`${instrumento.getImagen()}`}
          alt={instrumento.getInstrumento()}
          className="w-80 h-80 object-cover rounded shadow"
        />
        <p className="mt-4 text-justify">{instrumento.getDescripcion()}</p>
      </div>

      {/* Columna derecha: datos */}
      <div className="md:w-1/2 space-y-4">
        <p className="text-md text-gray-800"> {instrumento.getCantidadVendida()} Vendidos</p>
        <h1 className="text-2xl font-bold">{instrumento.getInstrumento()}</h1>
        <p className="text-3xl">
          <strong className="font-bold">Precio:</strong> ${instrumento.getPrecio()}
        </p>
        <p>
          <strong>Marca:</strong> {instrumento.getMarca()}
        </p>
        <p>
          <strong>Modelo:</strong> {instrumento.getModelo()}
        </p>
        <p>
          <strong>Costo de Envío:</strong>
        </p>
        <p className="text-md">{envioGratis(instrumento.getCostoEnvio())}</p>
        <div className="flex items-center gap-4 mt-4">
          <BotonAgregarCarrito
            stock={String(instrumento.getCantidadVendida())}
            agregarInstrumentoAlCarrito={() => agregarAlCarrito(instrumento)}
          />
          <BotonNavegar
            texto="Volver al inicio"
            destino="/home"
          />
        </div>
      </div>
    </div>
  );
}
