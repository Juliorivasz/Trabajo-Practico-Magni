import type { ItemCarrito } from "./CartProvider";
import type { Instrumento } from "../models/Instrumento";
import { createContext } from "react";

type CartContextType = {
  carrito: ItemCarrito[];
  agregarAlCarrito: (instrumento: Instrumento) => void;
  quitarDelCarrito: (id: number) => void;
  restarDelCarrito: (id: number) => void;
  limpiarCarrito: () => void;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);
