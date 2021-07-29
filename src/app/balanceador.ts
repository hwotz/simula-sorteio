import {DiretoriaModel} from "./diretoria.model";
import {SorteioModel} from "./sorteio.model";
import {Util} from "./util";
import {Divisor} from "./divisor";
import {Calculador} from "./calculador";

export class Balanceador {


  public static balancear(sorteio: SorteioModel) {
    if (!sorteio.diretorias || !sorteio.qtdeProcessos) {
      return;
    }
    if (!this.temDesbalanceamento(sorteio.diretorias)) {
      return;
    }
    let desbalanceadas = this.obtemDesbalanceados(sorteio.diretorias);
    const quantidadeDeficit = -(this.somaDeficit(sorteio.diretorias));
    const numeroReservado = Math.ceil(sorteio.qtdeProcessos * 0.3);
    const isSuficiente = quantidadeDeficit <= numeroReservado;
    if (isSuficiente) {
      this.quantidadeReservadaSuficiente(desbalanceadas);
    } else {
      desbalanceadas = this.quantidadeReservadaInsuficiente(desbalanceadas, numeroReservado);
    }
    this.atualizaSorteio(sorteio, desbalanceadas, isSuficiente ? quantidadeDeficit : numeroReservado);
  }

  private static quantidadeReservadaInsuficiente(desbalanceadas: DiretoriaModel[], numeroReservado: number) {
    const novoSorteio = new SorteioModel();
    const diretoriaList = Util.copiaDiretorias(desbalanceadas);
    diretoriaList.forEach(f =>{
      if (f.desbalanceamentoQuantitativo) {
        f.proporcao = -(f.desbalanceamentoQuantitativo);
      }
    });
    novoSorteio.qtdeProcessos = numeroReservado;
    novoSorteio.diretorias = diretoriaList;
    novoSorteio.qtdeGeral = numeroReservado;
    debugger;
    Divisor.divide(novoSorteio);
    return diretoriaList;
  }

  private static atualizaSorteio(sorteio: SorteioModel, desbalanceadas: DiretoriaModel[] , numeroReservado: number) {
    if (!sorteio.diretorias || ! sorteio.qtdeProcessos) {
      return;
    }
    const diretorias = sorteio.diretorias;
    sorteio.qtdeProcessos -= numeroReservado;
    desbalanceadas.forEach(f => {
      const desbalanceada =  diretorias.filter(g => g.id === f.id);
      if (desbalanceada && desbalanceada.length > 0) {
        desbalanceada[0].jaContemplado = true;
        desbalanceada[0].processosRecebidos = f.processosRecebidos;
        if (!!desbalanceada[0].desbalanceamentoQuantitativo &&  !!f.processosRecebidos) {
          desbalanceada[0].desbalanceamentoQuantitativo += f.processosRecebidos;
        }
      }
    });
  }

  private static quantidadeReservadaSuficiente(desbalanceadas: DiretoriaModel[]) {
    desbalanceadas.forEach(f => {
      if (f.desbalanceamentoQuantitativo && f.desbalanceamentoQuantitativo < 0) {
        f.processosRecebidos = -(f.desbalanceamentoQuantitativo);
      }
    });
  }

  public static somaDeficit(diretorias: DiretoriaModel[]) {
    let soma = 0;
    diretorias.forEach(f => {
      if (f.desbalanceamentoQuantitativo && f.desbalanceamentoQuantitativo < 0) {
        soma += f.desbalanceamentoQuantitativo
      }
    });
    return soma;
  }

  public static temDesbalanceamento(diretorias: DiretoriaModel[]) {
    let temDesbalanceamento = false;
    diretorias.forEach( f => {
      if (f.desbalanceamentoQuantitativo && f.desbalanceamentoQuantitativo < 0 && !temDesbalanceamento) {
        temDesbalanceamento = true;
      }
    });
    return temDesbalanceamento;
  }

  public static obtemDesbalanceados(diretorias: DiretoriaModel[]) {
    const diretoriaList: DiretoriaModel[] = [];
    diretorias.forEach(f => {
      if (f.desbalanceamentoQuantitativo && f.desbalanceamentoQuantitativo < 0) {
        diretoriaList.push(f);
      }
    });
    return diretoriaList;
  }

  public static balanceiaResto(diretorias: DiretoriaModel[], numeroSemSortear: number) {
    if (!this.temDesbalanceamento(diretorias)) {
      return numeroSemSortear;
    }
    let desbalanceadas = this.obtemDesbalanceados(diretorias);
    const quantidadeDeficit = -(this.somaDeficit(diretorias));
    const isSuficiente = quantidadeDeficit <= numeroSemSortear;
    if (isSuficiente) {
      diretorias.forEach(f => {
        if (f.processosRecebidos && f.desbalanceamentoQuantitativo) {
          f.processosRecebidos += -(f.desbalanceamentoQuantitativo);
        }
        f.desbalanceamentoQuantitativo = 0;
      });
      return numeroSemSortear - quantidadeDeficit;
    }
    for (let i = numeroSemSortear; i > 0; ) {
      desbalanceadas.forEach(f => {
        if (i > 0 && f.desbalanceamentoQuantitativo && f.desbalanceamentoQuantitativo < 0) {
          f.desbalanceamentoQuantitativo += 1;
          if (f.processosRecebidos) {
            f.processosRecebidos += 1;
          } else {
            f.processosRecebidos = 1;
          }
          i --;
        }
      });
    }
    return 0;
  }



}
