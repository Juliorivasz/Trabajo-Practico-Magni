import { useEffect, useState } from "react";
import { BotonNavegar } from "../componentes/botones"; // Asumo que BotonNavegar es un componente genérico de botón
import { CarruselSlide } from "../componentes/carrouselPortada";
import { MostrarInstrumentos } from "../componentes/mostrarInstrumentos";
import { Ubicacion } from "./DondeEstamos";
import { useCart } from "../context/useCart";
import { useAuth } from "../context/useAuth"; // ¡Importa el hook de autenticación!
import { fetchInstrumentos } from "../services/instrumentosServicio";
import type { Instrumento } from "../models/Instrumento";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para redirigir después del logout

export function Home() {
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);

  const { carrito } = useCart();
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const { isAuthenticated, logout } = useAuth(); // Obtén el estado de autenticación y la función de logout
  const navigate = useNavigate(); // Hook para la navegación

  useEffect(() => {
    fetchInstrumentos().then((data) => {
      setInstrumentos(data);
    });
  }, []);

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    logout(); // Llama a la función logout del contexto
    navigate("/login"); // Redirige al usuario a la página de login después de cerrar sesión
  };

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
          {/* El botón de Gestión ABM es una ruta privada, así que se mostrará
              siempre que la ruta sea accesible, pero el contenido interno de ABM
              se gestiona con el rol del usuario como ya lo hiciste. */}
          <BotonNavegar
            texto="Gestión ABM"
            destino="/abm"
          />
          <BotonNavegar
            texto={`Carrito ( ${totalItems} )`}
            destino="/carrito"
          />
          <BotonNavegar
            texto={`Charts`}
            destino="/charts"
          />

          {/* Lógica condicional para el botón de sesión */}
          {isAuthenticated ? (
            <BotonNavegar
              texto="Cerrar Sesión"
              onclick={handleLogout} // Llama a la función handleLogout al hacer click
              // No necesita 'destino' si usas onClick para redirigir
            />
          ) : (
            <BotonNavegar
              texto="Iniciar Sesión"
              destino="/login"
            />
          )}
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
