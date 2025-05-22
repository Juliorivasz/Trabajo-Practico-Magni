import { CategoriaInstrumento } from "../models/CategoriaInstrumento";
import { Instrumento } from "../models/Instrumento";
import { parseCategoriaInstrumentoApiToClass } from "./categoriaInstrumentoServicio";
import type { InstrumentoApi } from "./types/apiTypes";

const portUrl = `http://localhost:8080`;

// Función para parsear InstrumentoApi a Instrumento (clase)
export const parseInstrumentoApiToClass = (data: InstrumentoApi): Instrumento => {
  let categoriaInstance: CategoriaInstrumento;
  // Si la categoria no viene en la API por algún motivo, podrías manejar un caso por defecto
  if (data.categoria) {
    categoriaInstance = parseCategoriaInstrumentoApiToClass(data.categoria);
  } else {
    // Si la categoría es estrictamente necesaria, maneja este caso (ej. lanzar error o categoría por defecto)
    console.warn("InstrumentoApi sin categoría, creando una por defecto.");
    categoriaInstance = new CategoriaInstrumento(0, "Sin Categoría"); // O la lógica que prefieras
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

export const fetchInstrumentos = async (): Promise<Instrumento[]> => {
  try {
    const response = await fetch(`${portUrl}/api/instrumentos`);
    if (!response.ok) {
      throw new Error(`Error al obtener instrumentos: ${response.status} ${response.statusText}`);
    }
    const data: InstrumentoApi[] = await response.json(); // TypeScript espera InstrumentoApi[]
    return data.map(parseInstrumentoApiToClass);
  } catch (error) {
    console.error("Error en fetchInstrumentos:", error);
    throw error;
  }
};

export const fetchInstrumento = async (id: string): Promise<Instrumento> => {
  try {
    const response = await fetch(`${portUrl}/api/instrumentos/${id}`);
    if (!response.ok) {
      throw new Error(`Error al obtener instrumento con ID ${id}: ${response.status} ${response.statusText}`);
    }
    const data: InstrumentoApi = await response.json(); // TypeScript espera InstrumentoApi
    return parseInstrumentoApiToClass(data);
  } catch (error) {
    console.error(`Error en fetchInstrumento para ID ${id}:`, error);
    throw error;
  }
};

export const actualizarInstrumento = async (instrumento: Instrumento): Promise<Instrumento> => {
  // Asegúrate de que el instrumento tenga un ID para actualizar
  if (instrumento.getId() === undefined || instrumento.getId() === null) {
    throw new Error("El instrumento debe tener un ID para ser actualizado.");
  }

  const url = `${portUrl}/api/instrumentos/${instrumento.getId()}`;
  const requestBody = {
    id: instrumento.getId(), // Enviar el ID para PUT
    instrumento: instrumento.getInstrumento(),
    marca: instrumento.getMarca(),
    modelo: instrumento.getModelo(),
    imagen: instrumento.getImagen(),
    precio: instrumento.getPrecio(),
    costoEnvio: instrumento.getCostoEnvio(),
    cantidadVendida: instrumento.getCantidadVendida(),
    descripcion: instrumento.getDescripcion(),
    categoria: { id: instrumento.getCategoria()?.getIdCategoriaInstrumento() },
  };

  console.log("Enviando instrumento para actualizar:", requestBody);

  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al actualizar instrumento: ${response.status} - ${errorText}`);
  }
  const data: InstrumentoApi = await response.json();
  return parseInstrumentoApiToClass(data);
};

export const guardarInstrumento = async (instrumento: Instrumento): Promise<Instrumento> => {
  const url = `${portUrl}/api/instrumentos`;
  const requestBody = {
    // No enviar el ID si es un POST (nuevo instrumento)
    instrumento: instrumento.getInstrumento(),
    marca: instrumento.getMarca(),
    modelo: instrumento.getModelo(),
    imagen: instrumento.getImagen(),
    precio: instrumento.getPrecio(),
    costoEnvio: instrumento.getCostoEnvio(),
    cantidadVendida: instrumento.getCantidadVendida(),
    descripcion: instrumento.getDescripcion(),
    // Solo enviar el ID de la categoría
    categoria: { id: instrumento.getCategoria()?.getIdCategoriaInstrumento() },
  };

  console.log("Enviando instrumento para guardar:", requestBody);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al guardar instrumento: ${response.status} - ${errorText}`);
  }
  const data: InstrumentoApi = await response.json();
  return parseInstrumentoApiToClass(data);
};

export const deleteInstrumento = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${portUrl}/api/instrumentos/${id}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error(`Error al eliminar instrumento con ID ${id}: ${response.status} ${response.statusText}`);
    }
    return response.ok;
  } catch (error) {
    console.error(`Error en deleteInstrumento para ID ${id}:`, error);
    throw error;
  }
};
