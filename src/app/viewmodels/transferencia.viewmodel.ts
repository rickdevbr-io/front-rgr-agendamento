import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TaxaTransferenciaService } from '../services/taxa-transferencia.service';
import { AgendamentoService } from '../services/agendamento.service';
import { Transferencia } from '../models/taxa-transferencia.model';
import { TaxaTransferencia as TaxaTransferenciaResponse } from '../models/response/taxas-transferencia-dto-get-res';
import { AgendamentoDtoGetRes } from '../models/response/agendamento-dto-get-res';
import { AgendamentoDtoGetReq } from '../models/request/agendamento-dto-get-req';
import { CalcularTaxaTransferenciaDtoPostReq } from '../models/request/calcular-taxa-transferencia-dto-post-req';
import { CalcularTaxaTransferenciaDtoPostRes } from '../models/response/calcular-taxa-transferencia-dto-post-res';

@Injectable()
export class TransferenciaViewModel {
  private formDataSubject = new BehaviorSubject<Partial<Transferencia>>({
    contaOrigem: '',
    contaDestino: '',
    valor: 0,
    taxa: 0,
    dataTransferencia: new Date(),
    dataAgendamento: new Date(),
    status: 'PENDENTE'
  });

  private taxaCalculadaSubject = new BehaviorSubject<number | null>(null);
  private taxaInfoSubject = new BehaviorSubject<CalcularTaxaTransferenciaDtoPostRes | null>(null);
  private taxasDisponiveisSubject = new BehaviorSubject<TaxaTransferenciaResponse[]>([]);
  private agendamentosSubject = new BehaviorSubject<AgendamentoDtoGetRes[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private itemsSubject = new BehaviorSubject<Transferencia[]>([]);

  public formData$ = this.formDataSubject.asObservable();
  public taxaCalculada$ = this.taxaCalculadaSubject.asObservable();
  public taxaInfo$ = this.taxaInfoSubject.asObservable();
  public taxasDisponiveis$ = this.taxasDisponiveisSubject.asObservable();
  public agendamentos$ = this.agendamentosSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();
  public items$ = this.itemsSubject.asObservable();

  constructor(
    private taxaTransferenciaService: TaxaTransferenciaService,
    private agendamentoService: AgendamentoService
  ) {
    this.loadTaxasDisponiveis();
    this.loadAgendamentos();
  }

  updateFormData(data: Partial<Transferencia>): void {
    const currentData = this.formDataSubject.value;
    const updatedData = { ...currentData, ...data };
    this.formDataSubject.next(updatedData);

    if (data.valor !== undefined || data.dataTransferencia !== undefined) {
      this.calcularTaxa();
    }
  }

  private calcularTaxa(): void {
    const formData = this.getFormData();
    if (formData.valor !== null && formData.contaOrigem && formData.contaDestino && formData.dataTransferencia && formData.dataAgendamento) {
      this.errorSubject.next(null);
      
      this.taxaTransferenciaService.calcularTaxaTransferencia({
        contaOrigem: formData.contaOrigem!,
        contaDestino: formData.contaDestino!,
        valor: formData.valor!,
        dataTransferencia: formData.dataTransferencia!,
        dataAgendamento: formData.dataAgendamento!
      }).subscribe({
        next: (taxas: CalcularTaxaTransferenciaDtoPostRes) => {
          this.taxaCalculadaSubject.next(taxas.valorTaxaTransferencia + taxas.valorAdicional);
          this.taxaInfoSubject.next(taxas);
          this.errorSubject.next(null);
        },
        error: (error: any) => {
          console.error('Erro ao calcular taxa:', error.error.message);
          this.taxaCalculadaSubject.next(null);
          this.taxaInfoSubject.next(null);
          this.errorSubject.next('Erro ao calcular taxa: ' + (error.error.message|| 'Erro'));
        }
      });
    } else {
      this.taxaInfoSubject.next(null);
      this.taxaCalculadaSubject.next(null);
    }
  }

  getFormData(): Partial<Transferencia> {
    return this.formDataSubject.value;
  }

  resetForm(): void {
    this.formDataSubject.next({
      contaOrigem: '',
      contaDestino: '',
      valor: 0,
      taxa: 0,
      dataTransferencia: new Date(),
      dataAgendamento: new Date(),
      status: 'PENDENTE'
    });
    this.taxaCalculadaSubject.next(null);
    this.taxaInfoSubject.next(null);
  }

  canSubmit(): boolean {
    const data = this.formDataSubject.value;
    
    let result = false;
    if(data.contaOrigem &&
      data.contaDestino &&
      (data.valor ?? 0) > 0 &&
      data.dataTransferencia &&
      data.contaOrigem !== data.contaDestino){
        result = true;
      }

    return result;
  }

  submitTransferencia(): void {
    if (!this.canSubmit()) {
      return;
    }

    const formData = this.getFormData();
    const taxa = this.taxaCalculadaSubject.value;

    if (taxa === null) {
      return;
    }

    const agendamentoRequest: CalcularTaxaTransferenciaDtoPostReq = {
      contaOrigem: formData.contaOrigem!,
      contaDestino: formData.contaDestino!,
      valor: formData.valor!,
      dataTransferencia: formData.dataTransferencia!,
      dataAgendamento: new Date()
    };

    this.loadingSubject.next(true);
    this.agendamentoService.postAgendamento(agendamentoRequest).subscribe({
      next: (response: AgendamentoDtoGetRes) => {
        console.log('Agendamento criado com sucesso:', response);
        this.loadingSubject.next(false);
        this.resetForm();
        
        this.loadAgendamentos();
        
        this.errorSubject.next(null);
      },
      error: (error: any) => {
        console.error('Erro ao criar agendamento:', error.error.message);
        this.errorSubject.next('Erro ao criar agendamento: ' + (error.error.message || 'Erro'));
        this.loadingSubject.next(false);
      }
    });
  }

  loadTaxasDisponiveis(): void {
    this.taxaTransferenciaService.getAll().subscribe({
      next: (taxas: TaxaTransferenciaResponse[]) => {
        this.taxasDisponiveisSubject.next(taxas);
      },
      error: (error: any) => {
        console.error('Erro ao carregar taxas:', error);
        this.taxasDisponiveisSubject.next([]);
      }
    });
  }

  loadAgendamentos(): void {
    this.loadingSubject.next(true);
    this.agendamentoService.getAll().subscribe({
      next: (agendamentos: AgendamentoDtoGetRes[]) => {
        this.agendamentosSubject.next(agendamentos);
        this.loadingSubject.next(false);
      },
      error: (error: any) => {
        console.error('Erro ao carregar agendamentos:', error);
        this.errorSubject.next('Erro ao carregar agendamentos: ' + error.message);
        this.loadingSubject.next(false);
      }
    });
  }

  getTaxasDisponiveis(): TaxaTransferenciaResponse[] {
    return this.taxasDisponiveisSubject.value;
  }

  clearError(): void {
    this.errorSubject.next(null);
  }
}

