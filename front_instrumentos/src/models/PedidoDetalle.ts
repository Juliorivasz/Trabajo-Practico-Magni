import type { Instrumento } from "./Instrumento";
import type { Pedido } from "./Pedido";

export class PedidoDetalle {
  private id?: number;
  private cantidad: number;
  private instrumento: Instrumento;
  private pedido?: Pedido;

  constructor(cantidad: number, instrumento: Instrumento, id?: number, pedido?: Pedido) {
    this.id = id;
    this.cantidad = cantidad;
    this.instrumento = instrumento;
    this.pedido = pedido;
  }

  // --- Getters ---

  public getId(): number | undefined {
    return this.id;
  }

  public getCantidad(): number {
    return this.cantidad;
  }

  public getInstrumento(): Instrumento {
    return this.instrumento;
  }

  public getPedido(): Pedido | undefined {
    return this.pedido;
  }

  // --- Setters ---

  public setId(id: number): void {
    this.id = id;
  }

  public setCantidad(cantidad: number): void {
    this.cantidad = cantidad;
  }

  public setInstrumento(instrumento: Instrumento): void {
    this.instrumento = instrumento;
  }

  public setPedido(pedido: Pedido): void {
    this.pedido = pedido;
  }
}
