import {DiretoriaModel} from "./diretoria.model";

export class SorteioModel {
  constructor(
    public id?: number,
    public qtdeProcessos?: number,
    public qtdeGeral?: number,
    public diretorias?: DiretoriaModel[]
  ) {
  }
}
