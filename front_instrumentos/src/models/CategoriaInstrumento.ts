import type { Instrumento } from "./Instrumento";

export class CategoriaInstrumento {
  private id?: number;
  private denominacion?: string;
  private instrumentos?: Instrumento[];

  constructor(id: number | undefined, denominacion: string | undefined, instrumentos?: Instrumento[]) {
    this.id = id;
    this.denominacion = denominacion;
    this.instrumentos = instrumentos;
  }

  public getIdCategoriaInstrumento(): number | undefined {
    return this.id;
  }

  public getDenominacion(): string | undefined {
    return this.denominacion;
  }

  public getAllInstrumentos(): Instrumento[] | undefined {
    return this.instrumentos;
  }

  public setIdCategoriaInstrumento(id: number) {
    this.id = id;
  }

  public setDenominacion(denominacion: string) {
    this.denominacion = denominacion;
  }

  public setAllInstrumentos(instrumentos: Instrumento[]) {
    this.instrumentos = instrumentos;
  }
}
