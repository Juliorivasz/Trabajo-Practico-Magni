import { lazy, StrictMode, Suspense } from "react"; // Agregamos Suspense para los lazy imports
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import { CartProvider } from "./context/CartProvider.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx"; // Asegúrate de que AuthProvider.tsx exporte AuthProvider
import { RutasPrivada } from "./componentes/controlAcceso/RutaPrivada.tsx";

// Importación de componentes lazy
const Home = lazy(() => import("./pages/Home").then((module) => ({ default: module.Home })));
const Detalle = lazy(() => import("./pages/Detalle").then((module) => ({ default: module.Detalle })));
const AbmInstrumentos = lazy(() =>
  import("./componentes/abmInstrumentos").then((module) => ({ default: module.AbmInstrumentos })),
);
const Cart = lazy(() => import("./componentes/Cart").then((module) => ({ default: module.Cart })));
const Login = lazy(() => import("./componentes/Login").then((module) => ({ default: module.Login })));

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <AuthProvider>
        <CartProvider>
          <Suspense fallback={<div>Cargando...</div>}>
            <Routes>
              <Route
                path="/"
                element={<Home />}
              />
              <Route
                path="/home"
                element={<Home />}
              />
              <Route
                path="/instrumento/:id"
                element={<Detalle />}
              />
              <Route
                path="/login"
                element={<Login />}
              />
              <Route
                path="/abm"
                element={
                  <RutasPrivada>
                    <AbmInstrumentos />
                  </RutasPrivada>
                }
              />
              <Route
                path="/carrito"
                element={
                  <RutasPrivada>
                    <Cart />
                  </RutasPrivada>
                }
              />
            </Routes>
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </StrictMode>
  </BrowserRouter>,
);
