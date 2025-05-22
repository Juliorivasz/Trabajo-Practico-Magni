import type { PedidoDetalle } from "./PedidoDetalle";

export class Pedido {
  private id?: number;
  private fechaPedido?: Date;
  private totalPedido?: number;
  private detalles: PedidoDetalle[];

  constructor(detalles: PedidoDetalle[], id?: number, fechaPedido?: Date, totalPedido?: number) {
    this.id = id;
    this.fechaPedido = fechaPedido;
    this.totalPedido = totalPedido;
    this.detalles = detalles;
  }

  // --- Getters ---

  /**
   * Obtiene el ID del pedido.
   */
  public getId(): number | undefined {
    return this.id;
  }

  /**
   * Obtiene la fecha del pedido.
   */
  public getFechaPedido(): Date | undefined {
    return this.fechaPedido;
  }

  /**
   * Obtiene el total del pedido.
   */
  public getTotalPedido(): number | undefined {
    return this.totalPedido;
  }

  /**
   * Obtiene la lista de detalles del pedido.
   */
  public getDetalles(): PedidoDetalle[] {
    return this.detalles;
  }

  // --- Setters ---

  /**
   * Establece el ID del pedido.
   */
  public setId(id: number): void {
    this.id = id;
  }

  /**
   * Establece la fecha del pedido.
   */
  public setFechaPedido(fechaPedido: Date): void {
    this.fechaPedido = fechaPedido;
  }

  /**
   * Establece el total del pedido.
   */
  public setTotalPedido(totalPedido: number): void {
    this.totalPedido = totalPedido;
  }

  /**
   * Establece la lista de detalles del pedido.
   */
  public setDetalles(detalles: PedidoDetalle[]): void {
    this.detalles = detalles;
  }
}
