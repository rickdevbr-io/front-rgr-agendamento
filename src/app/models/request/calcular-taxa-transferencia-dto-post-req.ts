export interface CalcularTaxaTransferenciaDtoPostReq {

    contaOrigem: string;
    contaDestino: string;
    valor: number;
    dataTransferencia: Date;
    dataAgendamento: Date;

}