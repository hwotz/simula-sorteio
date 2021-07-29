import {DiretoriaModel} from "./diretoria.model";
import {SorteioModel} from "./sorteio.model";
import {Util} from "./util";
import {Balanceador} from "./balanceador";

export class Divisor {

  public static divide(sorteio: SorteioModel) {
    if (!sorteio.diretorias || !sorteio.qtdeProcessos) {
      return;
    }
    const diretoriaList = sorteio.diretorias;
    const qtdeProcessos = sorteio.qtdeProcessos;

    if (qtdeProcessos <= diretoriaList.length) {
      const novoSorteio = new SorteioModel();
      novoSorteio.qtdeProcessos = sorteio.qtdeProcessos;
      novoSorteio.diretorias = diretoriaList;
      novoSorteio.qtdeGeral = sorteio.qtdeGeral;
      this.sorteiaResto(novoSorteio);
      return;
    }

    const k = this.obtemConstanteDeProporcionalidade(qtdeProcessos, sorteio.diretorias);

    sorteio.diretorias.forEach(f => {
      if (f && f.proporcao) {
        const processosRecebidos = Math.floor(k * f.proporcao);
        if (f.processosRecebidos) {
          f.processosRecebidos += processosRecebidos;
        } else {
          f.processosRecebidos = processosRecebidos;
        }
      }
    });
    this.sorteiaResto(sorteio);
  }


  private static obtemDiretoriasNaoContempladas(diretorias: DiretoriaModel[]) {
    return diretorias.filter(f => !f.jaContemplado);
  }


  private static obtemConstanteDeProporcionalidade(quantidadeProcessos: number, diretorias: DiretoriaModel[]) {
    let somatorio = 0;
    diretorias.forEach(f => {
      if (f.proporcao) {
        somatorio += Number.parseInt(f.proporcao + '');
      }
    });
    return quantidadeProcessos / somatorio;
  }

  private static sorteiaResto(sorteio: SorteioModel) {
    if (!sorteio.diretorias || !sorteio.qtdeGeral) {
      return;
    }
    const qtdeProcessos = sorteio.qtdeGeral;
    let processosSemSortear = this.processosSemSortear(qtdeProcessos, sorteio.diretorias);
    if (processosSemSortear === 0) {
      return;
    }
    let diretoriaList = Util.copiaDiretorias(sorteio.diretorias);
    const copyOfDiretoria=  Util.copiaDiretorias(sorteio.diretorias);
    processosSemSortear = Balanceador.balanceiaResto(sorteio.diretorias, processosSemSortear);
    this.retiraMaiorDesbalanceamento(diretoriaList);
    for (let i = processosSemSortear; i > 0; i--) {
      const sorteado = this.sorteiaUm(diretoriaList);
      const idSorteado = diretoriaList[sorteado].id;
      if (idSorteado) {
        this.incremataSorteadoPorId(idSorteado, sorteio.diretorias);
        diretoriaList.splice(sorteado, 1);
        if (diretoriaList.length == 0) {
          diretoriaList = Util.copiaDiretorias(copyOfDiretoria);
        }
      }
    }
  }

  private static retiraMaiorDesbalanceamento(diretorias: DiretoriaModel[]) {
    debugger;
    let desbalanceado = -1;
    let toRemove = 0;
    const todosIguais  = this.desbalanceamentoIgual(diretorias);
    if (!todosIguais) {
      diretorias.forEach( (f, index) => {
        if ((f.desbalanceamentoQuantitativo || f.desbalanceamentoQuantitativo == 0) && f.desbalanceamentoQuantitativo > desbalanceado) {
          toRemove = index;
          desbalanceado = f.desbalanceamentoQuantitativo;
        }
      });
    } else {
      toRemove = this.sorteiaUm(diretorias);
    }
    diretorias.splice(toRemove, 1);
  }

  private static desbalanceamentoIgual(diretorias: DiretoriaModel[]) {
    if (diretorias.length == 0) {
      return false;
    }
    if (!diretorias[0].desbalanceamentoQuantitativo && diretorias[0].desbalanceamentoQuantitativo != 0) {
      return false
    }
    let primeiroDesbalanceamento = diretorias[0].desbalanceamentoQuantitativo;
    let todosIguais = true;
    diretorias.forEach(f => {
      if (f.desbalanceamentoQuantitativo != primeiroDesbalanceamento && todosIguais) {
        todosIguais = false;
      }
    });
    return todosIguais;
  }



  private static incremataSorteadoPorId(id: number, diretorias: DiretoriaModel[]) {
    diretorias.forEach(f => {
      if ((f.processosRecebidos || f.processosRecebidos == 0) && f.id && f.id === id) {
        f.processosRecebidos += 1;
      }
    })
  }

  private static sorteiaUm(diretorias: DiretoriaModel[]) {
    return Math.round(this.getRandomArbitrary(0, diretorias.length - 1));
  }

  private static getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  private static processosSemSortear(qtdeProcessos: number, diretorias: DiretoriaModel[]): number {
    let somaProcessos = 0;
    diretorias.forEach(f => {
      if (f.processosRecebidos) {
        somaProcessos += Number.parseInt(f.processosRecebidos + '');
      }
    });
    return qtdeProcessos - somaProcessos;
  }

  public static regraPeloMenosUm(sorteio: SorteioModel) {
    if (!sorteio.diretorias || !sorteio.qtdeProcessos) {
      return true;
    }
    if (sorteio.qtdeProcessos >= sorteio.diretorias.length) {
      sorteio.qtdeProcessos -= sorteio.diretorias.length;
      sorteio.diretorias.forEach(f => f.processosRecebidos = 1);
      return false;
    }
    return true;
  }

}
