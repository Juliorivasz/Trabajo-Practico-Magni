// src/componentes/charts/ChartsPedidoDate.tsx
import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import moment from "moment";
import { Pedido } from "../../models/Pedido"; // Importa tu clase Pedido
import { PedidoService } from "../../services/pedidoServicio";

interface ChartData {
  mesAnio: string; // Ej: "Ene 2023", "Feb 2023"
  cantidadPedidos: number;
}

export const ChartsPedidoDate: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPedidos = async () => {
      try {
        setLoading(true);
        // Usamos getAllPedidos de tu PedidoService
        const pedidos: Pedido[] = await PedidoService.getAllPedidos();

        // Agrupar pedidos por mes y año
        const groupedData = pedidos.reduce((acc: { [key: string]: number }, pedido) => {
          const fechaPedido = pedido.getFechaPedido();
          if (fechaPedido) {
            // Usamos moment para formatear la fecha
            // El formato 'MMM YYYY' es como "Jan 2023"
            const mesAnio = moment(fechaPedido).format("MMM YYYY");
            acc[mesAnio] = (acc[mesAnio] || 0) + 1;
          }
          return acc;
        }, {});

        // Convertir el objeto agrupado a un array de objetos para Recharts
        const formattedData: ChartData[] = Object.keys(groupedData)
          .map((key) => ({
            mesAnio: key,
            cantidadPedidos: groupedData[key],
          }))
          // Ordenar por fecha para una visualización cronológica
          .sort((a, b) => moment(a.mesAnio, "MMM YYYY").diff(moment(b.mesAnio, "MMM YYYY")));

        setChartData(formattedData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Error al cargar los pedidos para el gráfico de fecha: ${err.message}`);
        } else {
          setError("Error desconocido al cargar los pedidos para el gráfico de fecha.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadPedidos();
  }, []);

  if (loading) return <div className="text-center py-4">Cargando gráfico de pedidos por fecha...</div>;
  if (error) return <div className="text-center py-4 text-red-600">Error: {error}</div>;
  if (chartData.length === 0)
    return <div className="text-center py-4">No hay datos de pedidos por fecha para mostrar.</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4 text-center">Cantidad de Pedidos por Mes y Año</h3>
      <ResponsiveContainer
        width="100%"
        height={300}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mesAnio" />
          <YAxis allowDecimals={false} /> {/* Asegura que el eje Y muestre números enteros */}
          <Tooltip />
          <Legend />
          <Bar
            dataKey="cantidadPedidos"
            fill="#8884d8"
            name="Pedidos"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
