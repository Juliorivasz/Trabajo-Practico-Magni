import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AbmInstrumentos } from "./componentes/abmInstrumentos.tsx";
import "./index.css";
import { Detalle } from "./pages/Detalle.tsx";
import { Home } from "./pages/Home.tsx";
import { CartProvider } from "./context/CartProvider.tsx";
import Cart from "./componentes/Cart.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <CartProvider>
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
            path="/abm"
            element={<AbmInstrumentos />}
          />
          <Route
            path="/carrito"
            element={<Cart />}
          />
        </Routes>
      </CartProvider>
    </StrictMode>
  </BrowserRouter>,
);
