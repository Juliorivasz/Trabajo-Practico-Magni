// src/types/ApiTypes.ts

// --- Tipos existentes para Instrumento ---
export type CategoriaInstrumentoApi = {
  id?: number;
  denominacion: string;
};

export type InstrumentoApi = {
  id: number;
  instrumento: string;
  marca: string;
  modelo: string;
  imagen: string;
  precio: number;
  costoEnvio: string; // ¡Confirmado que es string desde el backend!
  cantidadVendida: number;
  descripcion: string;
  categoria: CategoriaInstrumentoApi; // Aquí usamos la interfaz, no la clase directamente
};

// --- Nuevos tipos para Pedidos ---

// Cuando enviamos un Pedido al backend (POST)
// Solo necesitamos la cantidad y el ID del instrumento
export type PedidoDetalleApiRequest = {
  cantidad: number;
  instrumento: { id: number }; // Solo se envía el ID del instrumento
};

export type PedidoApiRequest = {
  detalles: PedidoDetalleApiRequest[];
  // No se envía id, fechaPedido, totalPedido aquí, el backend los genera
};

// Cuando recibimos un Pedido del backend (GET/POST Response)
// El backend devolverá el pedido completo con IDs, fecha, total, y detalles completos
export type PedidoDetalleApiResponse = {
  id: number; // El ID del detalle ya generado
  cantidad: number;
  instrumento: InstrumentoApi; // El instrumento completo viene en la respuesta
  // No se incluye 'pedido' para evitar referencias circulares en el JSON
};

export type PedidoApiResponse = {
  id: number; // El ID del pedido ya generado
  fechaPedido: string; // La fecha siempre viene como string ISO del backend
  totalPedido: number; // El total ya calculado por el backend
  detalles: PedidoDetalleApiResponse[];
};
