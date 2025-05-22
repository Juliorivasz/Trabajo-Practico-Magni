import { useState, type ReactNode } from "react";
import { Instrumento } from "../models/Instrumento";
import { CartContext } from "./CartContext";

export type ItemCarrito = {
  instrumento: Instrumento;
  cantidad: number;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  const agregarAlCarrito = (instrumento: Instrumento) => {
    alert(`EL instrumento ${instrumento.getId()} se cargo al carrito`);
    setCarrito((prev) => {
      const existente = prev.find((item) => item.instrumento.getId() === instrumento.getId());
      if (existente) {
        return prev.map((item) =>
          item.instrumento.getId() === instrumento.getId() ? { ...item, cantidad: item.cantidad + 1 } : item,
        );
      } else {
        return [...prev, { instrumento, cantidad: 1 }];
      }
    });
  };

  const restarDelCarrito = (id: number) => {
    alert(`EL instrumento ${id} se resto del carrito`);
    setCarrito((prev) =>
      prev
        .map((item) => (item.instrumento.getId() === id ? { ...item, cantidad: item.cantidad - 1 } : item))
        .filter((item) => item.cantidad > 0),
    );
  };

  const quitarDelCarrito = (id: number) => {
    alert(`EL instrumento ${id} se elimino del carrito`);
    setCarrito((prev) => prev.filter((item) => item.instrumento.getId() !== id));
  };

  const limpiarCarrito = () => setCarrito([]);

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        quitarDelCarrito,
        restarDelCarrito,
        limpiarCarrito,
      }}>
      {children}
    </CartContext.Provider>
  );
};
