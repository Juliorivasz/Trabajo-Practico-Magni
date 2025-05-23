export class Usuario {
  private id: number;
  private nombreUsuario: string;
  private clave?: string;
  private rol: string;

  constructor(id: number, nombreUsuario: string, rol: string, clave?: string) {
    this.id = id;
    this.nombreUsuario = nombreUsuario;
    this.clave = clave;
    this.rol = rol;
  }

  public getIdUsuario = (): number => {
    return this.id;
  };
  public getNombreUsuario = (): string => {
    return this.nombreUsuario;
  };
  public getClave = (): string | undefined => {
    return this.clave;
  };
  public getRol = (): string => {
    return this.rol;
  };

  public setIdUsuario = (nuevoID: number) => {
    this.id = nuevoID;
  };
  public setNombreUsuario = (nuevoNombre: string) => {
    this.nombreUsuario = nuevoNombre;
  };
  public setClave = (nuevaClave: string) => {
    this.clave = nuevaClave;
  };
  public setRol = (nuevoRol: string) => {
    this.rol = nuevoRol;
  };
}
