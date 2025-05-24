import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useEffect, useState } from "react";
import { useCart } from "../context/useCart";
import { Pedido } from "../models/Pedido";
import { PedidoDetalle } from "../models/PedidoDetalle";
import { createPreferenceMP } from "../services/PreferenceMPServicio";

function CheckoutMP() {
  const [idPreference, setIdPreference] = useState<string>("");
  const { carrito } = useCart();
  const total = carrito.reduce((acc, item) => acc + (item.instrumento?.getPrecio?.() ?? 0) * item.cantidad, 0);
  const [pedido, setPedido] = useState<Pedido | undefined>(undefined);

  useEffect(() => {
    if (carrito.length > 0) {
      const detalles = carrito.map((item) => {
        return new PedidoDetalle(item.cantidad, item.instrumento);
      });
      const nuevoPedido = new Pedido(detalles, total);
      console.log("Nuevo pedido creado:", nuevoPedido);
      setPedido(nuevoPedido);
    }
  }, [carrito, total]);

  const getPreferenceMP = async () => {
    if (total > 0) {
      if (!pedido) {
        console.error("No hay pedido creado");
        return;
      }
      try {
        const response = await createPreferenceMP(pedido);
        console.log("Respuesta de preferencia:", response.id);
        if (response && response.id) {
          setIdPreference(response.id);
        } else {
          console.error("No se recibió ID de preferencia");
        }
      } catch (error) {
        console.error("Error al crear preferencia:", error);
        alert("Error al crear la preferencia de pago");
      }
    } else {
      alert("Agregue al menos un producto al carrito");
    }
  };

  //es la Public Key se utiliza generalmente en el frontend.
  initMercadoPago("TEST-b40e14ba-4d9d-40d1-aa0d-b37e1bf96dc7", { locale: "es-AR" });

  //redirectMode es optativo y puede ser self, blank o modal
  return (
    <div>
      <button
        onClick={getPreferenceMP}
        className="btMercadoPago">
        COMPRAR con <br></br> Mercado Pago
      </button>
      <div className={idPreference ? "divVisible" : "divInvisible"}>
        <Wallet
          initialization={{ preferenceId: idPreference, redirectMode: "blank" }}
          customization={{ texts: { valueProp: "smart_option" } }}
        />
      </div>
    </div>
  );
}

export default CheckoutMP;
