// src/componentes/CardInstrumento.tsx
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";
import { Instrumento } from "../models/Instrumento";
import { BotonAgregarCarrito, BotonDetalles } from "./botones";
import { envioGratis } from "./envioGratits";

interface CardInstrumentoProps {
  instrumento: Instrumento;
}

export const CardInstrumento: React.FC<CardInstrumentoProps> = ({ instrumento }) => {
  const { agregarAlCarrito } = useCart();
  const { isAuthenticated } = useAuth(); // Obtenemos el estado de autenticación

  const agregarInstrumentoAlCarrito = () => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      return;
    }
    agregarAlCarrito(instrumento);
  };

  return (
    <div>
      <div
        key={instrumento.getId()}
        className="flex bg-white shadow rounded overflow-hidden">
        {/* Imagen */}
        <img
          src={`${instrumento.getImagen().trim()}`}
          alt={instrumento.getInstrumento()}
          className="w-48 h-48 object-cover"
        />

        {/* Datos */}
        <div className="p-4 flex flex-col justify-between">
          <h2 className="text-xl font-bold text-gray-800">{instrumento.getInstrumento()}</h2>
          <p className="text-md text-gray-800">Marca: {instrumento.getMarca()}</p>
          <p className="text-md text-gray-800">Modelo: {instrumento.getModelo()}</p>
          <p className="text-lg font-bold text-gray-800">Precio: ${instrumento.getPrecio()}</p>
          <p className="text-md">{envioGratis(instrumento.getCostoEnvio())}</p>
          <p className="text-md text-gray-800">Cantidad Vendida: {instrumento.getCantidadVendida()}</p>
          <div>
            <BotonDetalles id={Number(instrumento.getId())} />
          </div>
          <div className="mt-2 flex space-x-4">
            {/* El botón "Agregar al Carrito" solo se muestra si el usuario está autenticado */}
            {isAuthenticated ? (
              <BotonAgregarCarrito
                stock={String(instrumento.getCantidadVendida())}
                agregarInstrumentoAlCarrito={agregarInstrumentoAlCarrito}
              />
            ) : (
              <p className="text-sm text-gray-500">Inicia sesión para agregar al carrito.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
