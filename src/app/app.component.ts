import {Component, OnInit} from '@angular/core';
import {Constantes} from "./constantes";
import {DiretoriaModel} from "./diretoria.model";
import {SorteioModel} from "./sorteio.model";
import {Sorteador} from "./sorteador";
import {Util} from "./util";
import {Calculador} from "./calculador";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'simula-sorteio';

  diretorias = Constantes.diretorias;

  sorteio = new SorteioModel();

  total = new DiretoriaModel();

  sorteios: SorteioModel[] = [];

  isDrawing = false;

  done = false;

  qtdeProcessos = 0;

  diretoriaHistoricoList: DiretoriaModel[][] = [];

  showHistory = false;


  ngOnInit(): void {
    this.atualizaTotal();
  }

  comecarSorteio() {
    this.isDrawing = true;
    this.done = false;
    this.sorteio = new SorteioModel();
    this.sorteio.id = this.sorteios.length + 1;
  }

  sortear() {
    this.sorteio.diretorias = Util.copiaDiretorias(this.diretorias, true).filter(f => f.checked);
    Sorteador.sortear(this.sorteio);
    this.sorteios.push({...this.sorteio});
    this.qtdeProcessos = this.qtdeProcessos + Number.parseInt((this.sorteio.qtdeProcessos ? this.sorteio.qtdeProcessos : 0) + '');
    this.isDrawing = false;
    this.done = true;
    if (!this.sorteio.qtdeGeral) {
      return;
    }
    this.atualizaRelativos(this.sorteio.qtdeGeral);
    Calculador.atualizaEstatisticas(this.diretorias, this.sorteio, this.qtdeProcessos);
    this.atualizaTotal();
    this.diretoriaHistoricoList.push(Util.copiaDiretorias(this.diretorias, false, true));
  }


  check(diretoria: DiretoriaModel) {
    diretoria.checked = !diretoria.checked;
  }


  private atualizaRelativos(numeroProcessos: number) {
    this.diretorias.forEach(f => {
      if (f.proporcao) {
        if (this.total.proporcao) {
          this.total.proporcao += f.proporcao;
        } else {
          this.total.proporcao = f.proporcao;
        }
      }

      if (f.totalProcessoRelativo || f.totalProcessoRelativo == 0) {
        f.totalProcessoRelativo += Number.parseInt(numeroProcessos + '') ;
      } else {
        f.totalProcessoRelativo = Number.parseInt(numeroProcessos + '');
      }

    });
  }

  private atualizaTotal() {
    this.total.proporcao = 0;
    this.total.proporcaoReal = 0;
    this.total.processosRecebidos = 0;
    this.total.desbalanceamentoQuantitativo = 0;
    this.diretorias.forEach(f => {
      if (f.proporcao) {
        if (this.total.proporcao) {
          this.total.proporcao += f.proporcao;
        } else {
          this.total.proporcao = f.proporcao;
        }
      }
      if (f.processosRecebidos) {
        if (this.total.proporcaoReal) {
          this.total.proporcaoReal += Calculador.obtemProporcaoReal(f.processosRecebidos, this.qtdeProcessos);
        } else {
          this.total.proporcaoReal = Calculador.obtemProporcaoReal(f.processosRecebidos, this.qtdeProcessos);
        }
        if (this.total.processosRecebidos) {
          this.total.processosRecebidos += f.processosRecebidos;
        } else {
          this.total.processosRecebidos = f.processosRecebidos;
        }
      }
    });
  }

  limparProcessos(diretoria: DiretoriaModel) {
    diretoria.totalProcessoRelativo = 0;
    diretoria.proporcaoReal = 0;
    diretoria.desbalanceamentoQuantitativo = 0;
    diretoria.processosRecebidos = 0;
  }

}
