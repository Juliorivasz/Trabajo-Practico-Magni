import type {
  CategoriaInstrumentoApi,
  InstrumentoApi,
  PedidoApiRequest,
  PedidoApiResponse,
  PedidoDetalleApiResponse,
} from "./types/apiTypes";
import { CategoriaInstrumento } from "../models/CategoriaInstrumento";
import { Instrumento } from "../models/Instrumento";
import { PedidoDetalle } from "../models/PedidoDetalle";
import { Pedido } from "../models/Pedido";

const portUrl = `http://localhost:8080`;

// --- Funciones de Parseo (De tipo API a instancia de Clase) ---

const parseCategoriaInstrumentoApiToClass = (data: CategoriaInstrumentoApi): CategoriaInstrumento => {
  // Asumiendo que CategoriaInstrumento constructor acepta (id, denominacion)
  return new CategoriaInstrumento(data.id || 0, data.denominacion);
};

const parseInstrumentoApiToClass = (data: InstrumentoApi): Instrumento => {
  let categoriaInstance: CategoriaInstrumento;
  if (data.categoria) {
    categoriaInstance = parseCategoriaInstrumentoApiToClass(data.categoria);
  } else {
    console.warn("InstrumentoApi sin categoría, creando una por defecto.");
    categoriaInstance = new CategoriaInstrumento(0, "Sin Categoría");
  }

  return new Instrumento(
    data.id,
    data.instrumento,
    data.marca,
    data.modelo,
    data.imagen,
    data.precio,
    data.costoEnvio,
    data.cantidadVendida,
    data.descripcion,
    categoriaInstance,
  );
};

const parsePedidoDetalleApiResponseToClass = (data: PedidoDetalleApiResponse): PedidoDetalle => {
  const instrumentoInstance = parseInstrumentoApiToClass(data.instrumento);
  return new PedidoDetalle(data.cantidad, instrumentoInstance, data.id);
};

const parsePedidoApiResponseToClass = (data: PedidoApiResponse): Pedido => {
  const detallesInstances: PedidoDetalle[] = data.detalles.map((detalleApi) => {
    return parsePedidoDetalleApiResponseToClass(detalleApi);
  });

  const fechaPedidoDate = new Date(data.fechaPedido);

  const pedido = new Pedido(detallesInstances, data.id, fechaPedidoDate, data.totalPedido);

  pedido.getDetalles().forEach((detalle) => detalle.setPedido(pedido));

  return pedido;
};

// --- Objeto Servicio PedidoService ---
export const PedidoService = {
  guardarPedido: async (pedido: Pedido): Promise<Pedido> => {
    try {
      // **Ajuste aquí:** Construimos el requestBody para que coincida exactamente
      // con la forma del objeto 'Pedido' que el controlador de Java espera en el @RequestBody.
      const requestBody: PedidoApiRequest = {
        detalles: pedido.getDetalles().map((detalle) => ({
          cantidad: detalle.getCantidad(),
          // El backend solo necesita el ID del instrumento para buscarlo
          instrumento: { id: detalle.getInstrumento().getId()! },
        })),
        // No incluimos 'id', 'fechaPedido', 'totalPedido' aquí
        // porque son generados por el backend y podrían causar errores si se envían como 'null' o '0'
        // dependiendo de la configuración de deserialización de Spring Boot.
        // Spring Boot es lo suficientemente inteligente como para crear un objeto Pedido
        // con estos campos nulos y solo mapear la lista de detalles.
      };

      console.log("Enviando pedido al backend:", requestBody);

      const response = await fetch(`${portUrl}/api/pedidos/crear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en la petición: ${response.status} - ${errorText}`);
      }

      const data: PedidoApiResponse = await response.json();
      return parsePedidoApiResponseToClass(data);
    } catch (error: unknown) {
      let errorMessage = "Hubo un error desconocido al guardar el pedido.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Error al guardar el pedido:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Los demás métodos (getPedidoById, getAllPedidos, deletePedido) se mantienen igual
  // ya que asumen que siempre reciben PedidoApiResponse y lo transforman.

  getPedidoById: async (id: number): Promise<Pedido> => {
    try {
      const response = await fetch(`${portUrl}/api/pedidos/${id}`);
      if (!response.ok) {
        throw new Error(`Error al obtener el pedido con ID ${id}: ${response.statusText}`);
      }
      const data: PedidoApiResponse = await response.json();
      return parsePedidoApiResponseToClass(data);
    } catch (error: unknown) {
      let errorMessage = "Hubo un error desconocido al cargar el pedido.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Error al cargar pedido:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  getAllPedidos: async (): Promise<Pedido[]> => {
    try {
      const response = await fetch(`${portUrl}/api/pedidos`);
      if (!response.ok) {
        throw new Error(`Error al obtener todos los pedidos: ${response.statusText}`);
      }
      const data: PedidoApiResponse[] = await response.json();
      return data.map(parsePedidoApiResponseToClass);
    } catch (error: unknown) {
      let errorMessage = "Hubo un error desconocido al cargar los pedidos.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Error al cargar pedidos:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  deletePedido: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${portUrl}/api/pedidos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Error al eliminar el pedido con ID ${id}: ${response.statusText}`);
      }
    } catch (error: unknown) {
      let errorMessage = "Hubo un error desconocido al eliminar el pedido.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Error al eliminar pedido:", errorMessage);
      throw new Error(errorMessage);
    }
  },
};
