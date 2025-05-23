// src/componentes/charts/ChartsPedidoInstrumento.tsx
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Pedido } from "../../models/Pedido"; // Importa tu clase Pedido
import { PedidoService } from "../../services/pedidoServicio";

interface ChartData {
  nombreInstrumento: string;
  cantidadPedidos: number;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF197C",
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
]; // Más colores

export const ChartsPedidoInstrumento: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPedidos = async () => {
      try {
        setLoading(true);
        const pedidos: Pedido[] = await PedidoService.getAllPedidos();

        // Agrupar pedidos por instrumento
        const groupedData = pedidos.reduce((acc: { [key: string]: number }, pedido) => {
          // Itera sobre los detalles de cada pedido
          pedido.getDetalles().forEach((detalle) => {
            const instrumento = detalle.getInstrumento();
            if (instrumento) {
              const nombreInstrumento = instrumento.getInstrumento(); // Accede al nombre del instrumento
              // Suma la cantidad de cada instrumento en los detalles del pedido
              acc[nombreInstrumento] = (acc[nombreInstrumento] || 0) + detalle.getCantidad();
            }
          });
          return acc;
        }, {});

        // Convertir el objeto agrupado a un array de objetos para Recharts
        const formattedData: ChartData[] = Object.keys(groupedData)
          .map((key) => ({
            nombreInstrumento: key,
            cantidadPedidos: groupedData[key],
          }))
          .filter((item) => item.cantidadPedidos > 0); // Filtra instrumentos sin pedidos

        setChartData(formattedData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Error al cargar los pedidos para el gráfico de instrumento: ${err.message}`);
        } else {
          setError("Error desconocido al cargar los pedidos para el gráfico de instrumento.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadPedidos();
  }, []);

  if (loading) return <div className="text-center py-4">Cargando gráfico de pedidos por instrumento...</div>;
  if (error) return <div className="text-center py-4 text-red-600">Error: {error}</div>;
  if (chartData.length === 0)
    return <div className="text-center py-4">No hay datos de pedidos por instrumento para mostrar.</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-center">Cantidad de Instrumentos Vendidos por Tipo</h3>
      <ResponsiveContainer
        width="100%"
        height={400}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="cantidadPedidos"
            nameKey="nombreInstrumento"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            labelLine={false}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
            {chartData.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
