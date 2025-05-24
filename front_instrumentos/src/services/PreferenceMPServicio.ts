import type { Pedido } from "../models/Pedido";
// import type PreferenceMP from "../models/PreferenceMP";
import PreferenceMP from "../models/PreferenceMP";

export async function createPreferenceMP(pedido?: Pedido) {
  console.log(pedido);
  const urlServer = "http://localhost:8080/api/create_preference_mp";
  const method: string = "POST";
  const response = await fetch(urlServer, {
    method: method,
    body: JSON.stringify(pedido),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  const prefe = new PreferenceMP(data?.id, data?.statusCode);
  return prefe;
}
