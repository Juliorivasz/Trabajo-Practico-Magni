import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface BotonAgregarCarritoProps {
  stock: string;
  agregarInstrumentoAlCarrito: VoidFunction;
}

export function BotonAgregarCarrito({ stock, agregarInstrumentoAlCarrito }: BotonAgregarCarritoProps) {
  const texto = parseInt(stock) > 0 ? `Agregar al carrito` : "Sin stock";

  return (
    <button
      onClick={agregarInstrumentoAlCarrito}
      disabled={parseInt(stock) === 0}
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
      {texto}
    </button>
  );
}

export function BotonDetalles({ id }: { id: number }) {
  const navigate = useNavigate();

  const handleDetalles = () => {
    navigate(`/instrumento/${id}`);
  };

  return (
    <button
      onClick={handleDetalles}
      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
      Ver detalles
    </button>
  );
}

interface BotonNavegarProps {
  texto: string;
  destino?: string;
  onclick?: VoidFunction;
}

export function BotonNavegar({ texto, destino, onclick }: BotonNavegarProps) {
  const esAncla = destino?.startsWith("#") || destino?.includes("#");

  if (esAncla) {
    return (
      <a
        href={destino}
        onClick={onclick}
        className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
        {texto}
      </a>
    );
  }
  return (
    <Link
      to={destino ?? ""}
      onClick={onclick}
      className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
      {texto}
    </Link>
  );
}
