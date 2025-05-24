export default class PreferenceMP {
  id: string = "";
  statusCode: number = 0;

  constructor(id: string, statusCode: number) {
    this.id = id;
    this.statusCode = statusCode;
  }
}
