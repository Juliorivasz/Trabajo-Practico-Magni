import { CategoriaInstrumento } from "../models/CategoriaInstrumento";
import type { CategoriaInstrumentoApi } from "./types/apiTypes";

const portUrl = `http://localhost:8080`;

export const parseCategoriaInstrumentoApiToClass = (data: CategoriaInstrumentoApi): CategoriaInstrumento => {
  return new CategoriaInstrumento(data.id || 0, data.denominacion);
};

export const fetchCategoriaInstrumento = async (): Promise<CategoriaInstrumento[]> => {
  try {
    const response = await fetch(`${portUrl}/api/categorias`);
    if (!response.ok) {
      throw new Error(`Error al obtener instrumentos: ${response.status} ${response.statusText}`);
    }
    const data: CategoriaInstrumentoApi[] = await response.json(); // TypeScript espera InstrumentoApi[]
    return data.map(parseCategoriaInstrumentoApiToClass);
  } catch (error) {
    console.error("Error en fetchInstrumentos:", error);
    throw error;
  }
};
