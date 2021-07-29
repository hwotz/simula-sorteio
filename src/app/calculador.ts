import {DiretoriaModel} from "./diretoria.model";
import {SorteioModel} from "./sorteio.model";

export class Calculador {

  public static atualizaEstatisticas(diretorias: DiretoriaModel[], sorteio: SorteioModel, qtdeProcessosTotal: number | undefined) {
    diretorias.forEach(f => {
      if (f.id &&  sorteio.diretorias) {
        const processoRecebidos = Number.parseInt(this.obtemProcessosRecebidosPorId(f.id, sorteio.diretorias) + '');
        if (f.processosRecebidos) {
          f.processosRecebidos += processoRecebidos;
        } else {
          f.processosRecebidos =  processoRecebidos;
        }
        f.proporcaoReal = this.obtemProporcaoReal(f.processosRecebidos,  f.totalProcessoRelativo);
        f.desbalanceamentoQuantitativo = this.calculaDesbalanceamentoQuantitativo(f.proporcao, f.proporcaoReal, f.totalProcessoRelativo);
      }
    });
  }

  public static obtemProporcaoReal(qtdeProcessos: number|undefined, qtdeProcessosTotal: number | undefined) {
    if (qtdeProcessos && qtdeProcessosTotal && qtdeProcessosTotal !== 0) {
      return qtdeProcessos / qtdeProcessosTotal;
    }
    return  0;
  }

  public static calculaDesbalancamentoPercentual(proporcaoEsperada: number|undefined, proporcaoReal: number|undefined): number {
    if ((!!proporcaoReal || proporcaoReal === 0) && proporcaoEsperada) {
      return (proporcaoReal / (proporcaoEsperada / 100)) - 1;
    }
    return 0;
  }

  public static calculaDesbalanceamentoQuantitativo(proporcaoEsperada: number|undefined, proporcaoReal: number|undefined, qtdeProcessosTotal: number | undefined) {
    if (proporcaoEsperada && (!!proporcaoReal || proporcaoReal === 0) && qtdeProcessosTotal) {
      return Math.round (( proporcaoReal - (proporcaoEsperada / 100)  ) * qtdeProcessosTotal);
    }
    return 0;
  }

  private static obtemProcessosRecebidosPorId(id: number, diretorias: DiretoriaModel[]) {
    let processosRecebidos = 0;
    diretorias.forEach(f => {
      if (f.id && f.id === id) {
        if (f.processosRecebidos) {
          processosRecebidos = f.processosRecebidos;
        }
      }
    });
    return processosRecebidos;
  }





}
