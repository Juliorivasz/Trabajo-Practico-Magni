import { useEffect, useState } from "react";
import { Instrumento } from "../models/Instrumento";
import { CategoriaInstrumento } from "../models/CategoriaInstrumento";
import { fetchCategoriaInstrumento } from "../services/categoriaInstrumentoServicio";
import { actualizarInstrumento, guardarInstrumento } from "../services/instrumentosServicio";

interface FormularioInstrumentoProps {
  instrumentoInicial?: Instrumento | null;
  onCerrar: () => void;
  onGuardado: (instrumentoGuardado: Instrumento) => void;
}

export function FormularioInstrumento({ instrumentoInicial = null, onCerrar, onGuardado }: FormularioInstrumentoProps) {
  const [instrumento, setInstrumento] = useState<Instrumento>(() => {
    if (instrumentoInicial) {
      return instrumentoInicial;
    } else {
      return new Instrumento(
        undefined, // id
        "", // instrumento
        "", // marca
        "", // modelo
        "", // imagen
        undefined, // <--- Aquí el cambio CLAVE: undefined para precio en nuevo instrumento
        "", // costoEnvio
        undefined, // <--- Aquí el cambio CLAVE: undefined para cantidadVendida en nuevo instrumento
        "", // descripcion
        new CategoriaInstrumento(0, ""), // categoria
      );
    }
  });
  const [categorias, setCategorias] = useState<CategoriaInstrumento[]>([]);

  useEffect(() => {
    if (instrumentoInicial) {
      setInstrumento(instrumentoInicial);
    }
  }, [instrumentoInicial]);

  // Cargar categorías
  useEffect(() => {
    fetchCategoriaInstrumento().then(setCategorias).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setInstrumento((prevInstrumento) => {
      const nuevaCategoria = prevInstrumento?.getCategoria()
        ? new CategoriaInstrumento(
            prevInstrumento.getCategoria()?.getIdCategoriaInstrumento(),
            prevInstrumento.getCategoria()?.getDenominacion(),
          )
        : new CategoriaInstrumento(0, "");

      const updatedInstrumento = new Instrumento(
        prevInstrumento?.getId() ?? 0,
        prevInstrumento?.getInstrumento() ?? "",
        prevInstrumento?.getMarca() ?? "",
        prevInstrumento?.getModelo() ?? "",
        prevInstrumento?.getImagen() ?? "",
        prevInstrumento?.getPrecio() ?? 0,
        prevInstrumento?.getCostoEnvio() ?? "",
        prevInstrumento?.getCantidadVendida() ?? 0,
        prevInstrumento?.getDescripcion() ?? "",
        nuevaCategoria,
      );

      // Usar setters para actualizar las propiedades
      if (name === "instrumento") updatedInstrumento.setInstrumento(value);
      else if (name === "marca") updatedInstrumento.setMarca(value);
      else if (name === "modelo") updatedInstrumento.setModelo(value);
      else if (name === "imagen") updatedInstrumento.setImagen(value);
      else if (name === "descripcion") updatedInstrumento.setDescripcion(value);
      // Para números, convertir a number, para costoEnvio es string
      else if (name === "precio") updatedInstrumento.setPrecio(value === "" ? undefined : parseFloat(value));
      else if (name === "cantidadVendida")
        updatedInstrumento.setCantidadVendida(value === "" ? undefined : parseInt(value));
      else if (name === "costoEnvio") updatedInstrumento.setCostoEnvio(value);

      return updatedInstrumento;
    });
  };

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoriaId = parseInt(e.target.value);
    const categoriaSeleccionada = categorias.find((cat) => cat.getIdCategoriaInstrumento() === categoriaId);
    setInstrumento((prevInstrumento) => {
      // Clona el instrumento previo para crear una nueva instancia
      const updatedInstrumento = new Instrumento(
        prevInstrumento?.getId() ?? 0,
        prevInstrumento?.getInstrumento() ?? "",
        prevInstrumento?.getMarca() ?? "",
        prevInstrumento?.getModelo() ?? "",
        prevInstrumento?.getImagen() ?? "",
        prevInstrumento?.getPrecio() ?? 0,
        prevInstrumento?.getCostoEnvio() ?? "",
        prevInstrumento?.getCantidadVendida() ?? 0,
        prevInstrumento?.getDescripcion() ?? "",
        // Si hay una categoría seleccionada, la usamos; de lo contrario, una vacía
        categoriaSeleccionada || new CategoriaInstrumento(0, ""),
      );
      return updatedInstrumento;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!instrumento?.getInstrumento().trim()) {
      alert("El nombre del instrumento es obligatorio");
      return;
    }
    if (!instrumento.getMarca().trim()) {
      alert("La marca es obligatoria");
      return;
    }
    if (instrumento.getCategoria()?.getIdCategoriaInstrumento() === 0) {
      alert("Debe seleccionar una categoría");
      return;
    }
    // Puedes agregar más validaciones según necesites

    try {
      let instrumentoGuardado: Instrumento;
      if (instrumento.getId()) {
        // Si tiene ID, es una actualización (PUT)
        instrumentoGuardado = await actualizarInstrumento(instrumento);
      } else {
        // Si no tiene ID, es una creación (POST)
        instrumentoGuardado = await guardarInstrumento(instrumento);
      }
      onGuardado(instrumentoGuardado); // Llama a la función de callback con el instrumento guardado
      onCerrar(); // Cierra el formulario
    } catch (err) {
      console.error("Error al guardar/actualizar:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded bg-white">
      <label
        htmlFor="instrumento"
        className="block font-semibold">
        Nombre del instrumento
      </label>
      <input
        id="instrumento"
        name="instrumento"
        value={instrumento?.getInstrumento()}
        onChange={handleChange}
        placeholder="Nombre del instrumento"
        className="border p-2 w-full"
      />

      <label
        htmlFor="marca"
        className="block font-semibold">
        Marca
      </label>
      <input
        id="marca"
        name="marca"
        value={instrumento?.getMarca()}
        onChange={handleChange}
        placeholder="Marca"
        className="border p-2 w-full"
      />

      <label
        htmlFor="modelo"
        className="block font-semibold">
        Modelo
      </label>
      <input
        id="modelo"
        name="modelo"
        value={instrumento?.getModelo()}
        onChange={handleChange}
        placeholder="Modelo"
        className="border p-2 w-full"
      />

      <label
        htmlFor="imagen"
        className="block font-semibold">
        URL de imagen
      </label>
      <input
        id="imagen"
        name="imagen"
        value={instrumento?.getImagen()}
        onChange={handleChange}
        placeholder="URL de imagen"
        className="border p-2 w-full"
      />

      <label
        htmlFor="precio"
        className="block font-semibold">
        Precio
      </label>
      <input
        id="precio"
        name="precio"
        value={instrumento.getPrecio() === undefined ? "" : instrumento.getPrecio()}
        onChange={handleChange}
        type="number"
        placeholder="Precio"
        className="border p-2 w-full"
      />

      <label
        htmlFor="costoEnvio"
        className="block font-semibold">
        Costo de envío
      </label>
      <input
        id="costoEnvio"
        name="costoEnvio"
        value={instrumento?.getCostoEnvio()}
        onChange={handleChange}
        placeholder="Costo de envío (ejemplo: 150 o G para Gratis)"
        className="border p-2 w-full"
      />

      <label
        htmlFor="cantidadVendida"
        className="block font-semibold">
        Cantidad vendida
      </label>
      <input
        id="cantidadVendida"
        name="cantidadVendida"
        value={instrumento.getCantidadVendida() === undefined ? "" : instrumento.getCantidadVendida()}
        onChange={handleChange}
        type="number"
        placeholder="Cantidad vendida"
        className="border p-2 w-full"
      />

      <label
        htmlFor="descripcion"
        className="block font-semibold">
        Descripción
      </label>
      <textarea
        id="descripcion"
        name="descripcion"
        value={instrumento?.getDescripcion()}
        onChange={handleChange}
        placeholder="Descripción"
        className="border p-2 w-full"
      />

      <label
        htmlFor="categoria"
        className="block font-semibold">
        Categoría
      </label>
      <select
        id="categoria"
        value={instrumento?.getCategoria()?.getIdCategoriaInstrumento()}
        onChange={handleCategoriaChange}
        className="border p-2 w-full">
        <option value={0}>Seleccionar categoría</option>
        {categorias.map((cat) => (
          <option
            key={cat.getIdCategoriaInstrumento()}
            value={cat.getIdCategoriaInstrumento()}>
            {cat.getDenominacion()}
          </option>
        ))}
      </select>

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded">
          Guardar
        </button>
        <button
          type="button"
          onClick={onCerrar}
          className="bg-gray-400 px-4 py-2 rounded">
          Cancelar
        </button>
      </div>
    </form>
  );
}
