import { useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";
import { Pedido } from "../models/Pedido";
import { PedidoDetalle } from "../models/PedidoDetalle";
import { PedidoService } from "../services/pedidoServicio";
import { BotonNavegar } from "./botones";
import CheckoutMP from "./CheckoutMP";

export const Cart = () => {
  const { carrito, agregarAlCarrito, restarDelCarrito, quitarDelCarrito, limpiarCarrito } = useCart();

  const navigate = useNavigate();

  const total = carrito.reduce((acc, item) => acc + item.instrumento.getPrecio() * item.cantidad, 0);

  const enviarPedido = async () => {
    // 1. Crear instancias de PedidoDetalle con las clases reales (Instrumento)
    const detallesParaPedido: PedidoDetalle[] = carrito.map((item) => {
      return new PedidoDetalle(item.cantidad, item.instrumento);
    });

    // 2. Crear una instancia de la clase Pedido con los detalles
    const nuevoPedido = new Pedido(detallesParaPedido);

    try {
      // 3. Usar el PedidoService para guardar el pedido
      const pedidoGuardado = await PedidoService.guardarPedido(nuevoPedido);

      alert(`Pedido guardado con éxito. ID de pedido: ${pedidoGuardado.getId()}`);
      limpiarCarrito();
      navigate("/home");
    } catch (error) {
      console.log("Error al enviar pedido:", error);
      alert("Hubo un error al guardar el pedido. Intente de nuevo más tarde.");
    }
  };

  if (carrito.length === 0) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div className="flex justify-between items-center mb-4">
          <BotonNavegar
            texto="Volver al inicio"
            destino="/home"
          />
        </div>
        ;<h2>🛒 Carrito vacío</h2>
        <p>Agregá productos desde la tienda para verlos acá.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>
      <div className="flex justify-between items-center mb-4">
        <BotonNavegar
          texto="Volver al inicio"
          destino="/home"
        />
      </div>
      <h2 style={{ marginBottom: "24px" }}>🛒 Carrito de compras</h2>

      {carrito.map((item) => (
        <div
          key={item.instrumento.getId()}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <div>
            <h3 style={{ margin: 0 }}>{item.instrumento.getInstrumento()}</h3>
            <p style={{ margin: "4px 0" }}>Precio unitario: ${item.instrumento.getPrecio().toLocaleString("es-AR")}</p>
            <p style={{ margin: "4px 0" }}>
              Cantidad:
              <button
                onClick={() => restarDelCarrito(item.instrumento.getId()!)}
                style={{
                  marginLeft: "10px",
                  marginRight: "5px",
                  padding: "2px 8px",
                  fontSize: "16px",
                }}>
                −
              </button>
              {item.cantidad}
              <button
                onClick={() => agregarAlCarrito(item.instrumento)}
                style={{
                  marginLeft: "5px",
                  padding: "2px 8px",
                  fontSize: "16px",
                }}>
                +
              </button>
            </p>
            <p style={{ margin: "4px 0" }}>
              Subtotal: ${(item.instrumento.getPrecio() * item.cantidad).toLocaleString("es-AR")}
            </p>
          </div>
          <button
            onClick={() => quitarDelCarrito(item.instrumento.getId()!)}
            style={{
              backgroundColor: "#ff4d4f",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "4px",
              cursor: "pointer",
            }}>
            Quitar
          </button>
        </div>
      ))}

      <hr />
      <div style={{ textAlign: "right", marginTop: "24px" }}>
        <h3>Total: ${total.toLocaleString("es-AR")}</h3>
        <button
          onClick={enviarPedido}
          style={{
            backgroundColor: "#1a73e8",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
          }}>
          Guardar carrito
        </button>
        <CheckoutMP />
      </div>
    </div>
  );
};
