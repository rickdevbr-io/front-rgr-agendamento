import { BaseModel } from '../core/interfaces/base.interface';

export interface Transferencia extends BaseModel {
  contaOrigem: string;
  contaDestino: string;
  valor: number;
  taxa: number;
  dataTransferencia: Date;
  dataAgendamento: Date;
  status: 'PENDENTE' | 'REALIZADA' | 'CANCELADA';
}

export interface TaxaTransferencia {
  valorMinimo: number;
  valorMaximo: number;
  taxa: number;
  descricao: string;
}

