import { useEffect, useState } from "react";

const imagenes = [
  "/images/fotoportada.jpg",
  "/images/guitarrasportada.jpg",
  "/images/marca-piano-cola-yamaha.jpg",
];

export function CarruselSlide() {
  const [indice, setIndice] = useState(0);

  // Avanza cada 3 segundos
  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndice((prev) => (prev + 1) % imagenes.length);
    }, 3000);

    // Limpiar el intervalo al desmontar
    return () => clearInterval(intervalo);
  }, []);

  const siguiente = () => {
    setIndice((prev) => (prev + 1) % imagenes.length);
  };

  const anterior = () => {
    setIndice((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden">
      {/* Contenedor deslizante */}
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${indice * 100}%)` }}
      >
        {imagenes.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Imagen ${i + 1}`}
            className="w-full flex-shrink-0 h-64 object-cover"
          />
        ))}
      </div>

      {/* Botón anterior */}
      <button
        onClick={anterior}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded hover:bg-opacity-75"
      >
        ←
      </button>

      {/* Botón siguiente */}
      <button
        onClick={siguiente}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded hover:bg-opacity-75"
      >
        →
      </button>

      {/* Indicadores */}
      <div className="flex justify-center mt-4 space-x-2">
        {imagenes.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === indice ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
