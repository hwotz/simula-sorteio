export class DiretoriaModel {

  static seq = 0;
  constructor(
    public nome?: string,
    public proporcao?: number,
    public processosRecebidos?: number,
    public checked?: boolean,
    public proporcaoReal?: number,
    public id?: number,
    public desbalanceamentoQuantitativo?: number,
    public jaContemplado?: boolean,
    public totalProcessoRelativo?: number
  ) {
    this.jaContemplado = false;
    DiretoriaModel.seq += 1;
    this.id = DiretoriaModel.seq;
    this.checked = true;
    this.processosRecebidos = 0;
    this.desbalanceamentoQuantitativo = 0;
    this.proporcaoReal = 0;
    this.totalProcessoRelativo = 0;
  }
}
