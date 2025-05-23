import type { Pedido } from "../models/Pedido";
import type PreferenceMP from "../models/PreferenceMP";

export async function createPreferenceMP(pedido?:Pedido){
    let urlServer = 'http://localhost:8080/api/create_preference_mp';
	let method:string = "POST";
    const response = await fetch(urlServer, {
	"method": method,
	"body": JSON.stringify(pedido),
	"headers": {
		"Content-Type": 'application/json'
	}
	});
    return await response.json() as PreferenceMP;   
}  