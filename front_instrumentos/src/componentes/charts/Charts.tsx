// src/componentes/charts/Charts.tsx
import React, { useState, Suspense, lazy } from "react";
import moment from "moment"; // Importamos moment para el manejo de fechas
import { BotonNavegar } from "../botones"; // Asumo que BotonNavegar es un componente existente

// Importaciones lazy de tus componentes de gráfico
const ChartsPedidoDate = lazy(() =>
  import("./ChartsPedidoDate").then((module) => ({ default: module.ChartsPedidoDate })),
);
const ChartsPedidoInstrumento = lazy(() =>
  import("./ChartsPedidoInstrumento").then((module) => ({ default: module.ChartsPedidoInstrumento })),
);

export const Charts: React.FC = () => {
  // Añadimos 'pdf' como una opción más para activeTab
  const [activeTab, setActiveTab] = useState<"date" | "instrument" | "excel" | "pdf">("date");
  const [fechaDesde, setFechaDesde] = useState<string>(moment().subtract(1, "years").format("YYYY-MM-DD"));
  const [fechaHasta, setFechaHasta] = useState<string>(moment().format("YYYY-MM-DD"));
  const [loadingExcel, setLoadingExcel] = useState<boolean>(false);
  const [excelError, setExcelError] = useState<string | null>(null);

  // Estados para la generación de PDF
  const [instrumentoId, setInstrumentoId] = useState<string>(""); // Para el ID del instrumento
  const [loadingPdf, setLoadingPdf] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const handleTabClick = (tab: "date" | "instrument" | "excel" | "pdf") => {
    setActiveTab(tab);
  };

  const handleGenerateExcel = async () => {
    setLoadingExcel(true);
    setExcelError(null);

    try {
      if (!fechaDesde || !fechaHasta) {
        setExcelError("Por favor, selecciona ambas fechas.");
        return;
      }
      if (moment(fechaDesde).isAfter(moment(fechaHasta))) {
        setExcelError("La fecha 'Desde' no puede ser posterior a la fecha 'Hasta'.");
        return;
      }

      const API_BASE_URL = "http://localhost:8080";

      const response = await fetch(
        `${API_BASE_URL}/api/reportes/pedidos/excel?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error del servidor (${response.status}): ${errorText || "Error desconocido"}`);
      }

      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "reporte_pedidos.xlsx";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      alert("Reporte Excel generado y descargado exitosamente!");
    } catch (error) {
      console.error("Error al generar el reporte Excel:", error);
      if (error instanceof Error) {
        setExcelError(`Fallo al generar el reporte: ${error.message}`);
      } else {
        setExcelError("Fallo al generar el reporte: Error desconocido.");
      }
    } finally {
      setLoadingExcel(false);
    }
  };

  // Nueva función para generar el PDF
  const handleGeneratePdfInstrumento = async () => {
    setLoadingPdf(true);
    setPdfError(null);

    try {
      if (!instrumentoId) {
        setPdfError("Por favor, ingresa el ID del instrumento.");
        return;
      }

      const API_BASE_URL = "http://localhost:8080";
      const response = await fetch(`${API_BASE_URL}/api/reportes/instrumento/${instrumentoId}/pdf`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error del servidor (${response.status}): ${errorText || "Error desconocido"}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      // Abrir el PDF en una nueva pestaña
      window.open(url, "_blank");
      window.URL.revokeObjectURL(url); // Liberar el objeto URL

      alert("PDF del instrumento generado exitosamente!");
    } catch (error) {
      console.error("Error al generar el PDF del instrumento:", error);
      if (error instanceof Error) {
        setPdfError(`Fallo al generar el PDF: ${error.message}`);
      } else {
        setPdfError("Fallo al generar el PDF: Error desconocido.");
      }
    } finally {
      setLoadingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <BotonNavegar
        texto={`volver`}
        destino="/home"
      />
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Análisis y Reportes de Pedidos</h1>

      <div className="flex justify-center mb-8">
        <button
          className={`px-6 py-3 text-lg font-semibold rounded-l-lg focus:outline-none transition-colors duration-200
            ${
              activeTab === "date" ? "bg-blue-600 text-white shadow-md" : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          onClick={() => handleTabClick("date")}>
          Gráfico por Fecha
        </button>
        <button
          className={`px-6 py-3 text-lg font-semibold focus:outline-none transition-colors duration-200
            ${
              activeTab === "instrument"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          onClick={() => handleTabClick("instrument")}>
          Gráfico por Instrumento
        </button>
        <button
          className={`px-6 py-3 text-lg font-semibold focus:outline-none transition-colors duration-200
            ${
              activeTab === "excel" ? "bg-blue-600 text-white shadow-md" : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          onClick={() => handleTabClick("excel")}>
          Generar Excel
        </button>
        {/* Nueva pestaña para Generar PDF */}
        <button
          className={`px-6 py-3 text-lg font-semibold rounded-r-lg focus:outline-none transition-colors duration-200
            ${
              activeTab === "pdf" ? "bg-blue-600 text-white shadow-md" : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          onClick={() => handleTabClick("pdf")}>
          Generar PDF Instrumento
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-xl">
        <Suspense fallback={<div className="text-center py-8">Cargando contenido...</div>}>
          {activeTab === "date" && <ChartsPedidoDate />}
          {activeTab === "instrument" && <ChartsPedidoInstrumento />}
          {activeTab === "excel" && (
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
                Generar Reporte de Pedidos (Excel)
              </h3>
              <div className="flex flex-col gap-4 max-w-sm mx-auto">
                <label
                  htmlFor="fechaDesde"
                  className="block text-gray-700 text-sm font-bold mb-1">
                  Fecha Desde:
                </label>
                <input
                  type="date"
                  id="fechaDesde"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                />

                <label
                  htmlFor="fechaHasta"
                  className="block text-gray-700 text-sm font-bold mb-1">
                  Fecha Hasta:
                </label>
                <input
                  type="date"
                  id="fechaHasta"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                />

                {excelError && <p className="text-red-500 text-sm text-center font-medium">{excelError}</p>}

                <button
                  className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200
                    ${loadingExcel ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={handleGenerateExcel}
                  disabled={loadingExcel}>
                  {loadingExcel ? "Generando..." : "Generar Excel"}
                </button>
              </div>
            </div>
          )}
          {activeTab === "pdf" && (
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">Generar PDF de Instrumento</h3>
              <div className="flex flex-col gap-4 max-w-sm mx-auto">
                <label
                  htmlFor="instrumentoId"
                  className="block text-gray-700 text-sm font-bold mb-1">
                  ID del Instrumento:
                </label>
                <input
                  type="number" // Cambiado a type="number" para IDs
                  id="instrumentoId"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={instrumentoId}
                  onChange={(e) => setInstrumentoId(e.target.value)}
                  placeholder="Ej: 1, 2, 3..."
                />

                {pdfError && <p className="text-red-500 text-sm text-center font-medium">{pdfError}</p>}

                <button
                  className={`bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200
                    ${loadingPdf ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={handleGeneratePdfInstrumento}
                  disabled={loadingPdf}>
                  {loadingPdf ? "Generando..." : "Generar PDF"}
                </button>
              </div>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
};
