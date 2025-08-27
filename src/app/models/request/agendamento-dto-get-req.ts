export interface AgendamentoDtoGetReq {

    contaOrigem: string;
    contaDestino: string;
    valor: number;
    dataTransferencia: Date;
    dataAgendamento: Date;

}