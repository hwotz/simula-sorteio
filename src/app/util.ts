import {DiretoriaModel} from "./diretoria.model";

export class Util {

  public static copiaDiretorias(diretorias: DiretoriaModel[], limpaProcessosRecebidos?: boolean, ignoraChecked?: boolean): DiretoriaModel[] {
    const diretoriaList: DiretoriaModel[] = [];
    diretorias.forEach(f => {
      if (f.checked || ignoraChecked) {
        const copy = {...f};
        if (limpaProcessosRecebidos) {
          copy.processosRecebidos = 0;
        }
        diretoriaList.push(copy);
      }
    });
    return diretoriaList;
  }
}
