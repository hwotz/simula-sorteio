import {SorteioModel} from "./sorteio.model";
import {DiretoriaModel} from "./diretoria.model";
import {Util} from "./util";
import {Balanceador} from "./balanceador";
import {Divisor} from "./divisor";

export class Sorteador {

  public static sortear(sorteio: SorteioModel) {
    sorteio.qtdeGeral = sorteio.qtdeProcessos;
    if (sorteio.diretorias && Balanceador.temDesbalanceamento(sorteio.diretorias)) {
      Balanceador.balancear(sorteio);
    }
    Divisor.divide(sorteio);
    sorteio.qtdeProcessos = sorteio.qtdeGeral;
  }



}
