export interface AgendamentoDtoGetRes {

    codigoAgendamento: string;
    statusAgendamento: string;
    contaOrigem: string;
    contaDestino: string;
    valor: number;
    taxa: number;
    dataTransferencia: Date;
    dataAgendamento: Date;

}