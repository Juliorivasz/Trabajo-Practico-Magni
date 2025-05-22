import type { CategoriaInstrumento } from "./CategoriaInstrumento";

export class Instrumento {
  private id?: number;
  private instrumento: string;
  private marca: string;
  private modelo: string;
  private imagen: string;
  private precio?: number;
  private costoEnvio: string;
  private cantidadVendida?: number;
  private descripcion: string;
  private categoria?: CategoriaInstrumento;

  constructor(
    id: number | undefined,
    instrumento: string,
    marca: string,
    modelo: string,
    imagen: string,
    precio: number | undefined,
    costoEnvio: string,
    cantidadVendida: number | undefined,
    descripcion: string,
    categoria?: CategoriaInstrumento,
  ) {
    this.id = id;
    this.instrumento = instrumento;
    this.marca = marca;
    this.modelo = modelo;
    this.imagen = imagen;
    this.precio = precio;
    this.costoEnvio = costoEnvio;
    this.cantidadVendida = cantidadVendida;
    this.descripcion = descripcion;
    this.categoria = categoria;
  }

  // Getters
  public getId(): number | undefined {
    return this.id;
  }

  public getInstrumento(): string {
    return this.instrumento;
  }

  public getMarca(): string {
    return this.marca;
  }

  public getModelo(): string {
    return this.modelo;
  }

  public getImagen(): string {
    return this.imagen;
  }

  public getPrecio(): number | undefined {
    return this.precio;
  }

  public getCostoEnvio(): string {
    return this.costoEnvio;
  }

  public getCantidadVendida(): number | undefined {
    return this.cantidadVendida;
  }

  public getDescripcion(): string {
    return this.descripcion;
  }

  public getCategoria(): CategoriaInstrumento | undefined {
    return this.categoria;
  }

  // Setters
  public setId(id: number): void {
    this.id = id;
  }

  public setInstrumento(instrumento: string): void {
    this.instrumento = instrumento;
  }

  public setMarca(marca: string): void {
    this.marca = marca;
  }

  public setModelo(modelo: string): void {
    this.modelo = modelo;
  }

  public setImagen(imagen: string): void {
    this.imagen = imagen;
  }

  public setPrecio(precio: number | undefined): void {
    this.precio = precio;
  }

  public setCostoEnvio(costoEnvio: string): void {
    this.costoEnvio = costoEnvio;
  }

  public setCantidadVendida(cantidadVendida: number | undefined): void {
    this.cantidadVendida = cantidadVendida;
  }

  public setDescripcion(descripcion: string): void {
    this.descripcion = descripcion;
  }

  public setCategoria(categoria: CategoriaInstrumento): void {
    this.categoria = categoria;
  }
}
