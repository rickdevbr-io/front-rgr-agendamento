import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseViewModel } from '../core/viewmodels/base.viewmodel';
import { TransferenciaService } from '../services/transferencia.service';
import { Transferencia, TaxaTransferencia } from '../models/transferencia.model';

@Injectable()
export class TransferenciaViewModel extends BaseViewModel<Transferencia> {
  private formDataSubject = new BehaviorSubject<Partial<Transferencia>>({
    contaOrigem: 'XXXXXXXXXX',
    contaDestino: 'XXXXXXXXXX',
    valor: 0,
    taxa: 0,
    dataTransferencia: new Date(),
    dataAgendamento: new Date(),
    status: 'PENDENTE'
  });

  private taxaCalculadaSubject = new BehaviorSubject<number | null>(null);
  private taxaInfoSubject = new BehaviorSubject<TaxaTransferencia | null>(null);

  public formData$ = this.formDataSubject.asObservable();
  public taxaCalculada$ = this.taxaCalculadaSubject.asObservable();
  public taxaInfo$ = this.taxaInfoSubject.asObservable();

  constructor(service: TransferenciaService) {
    super(service);
  }

  updateFormData(data: Partial<Transferencia>): void {
    const currentData = this.formDataSubject.value;
    const updatedData = { ...currentData, ...data };
    this.formDataSubject.next(updatedData);

    if (data.valor !== undefined) {
      this.calcularTaxa(data.valor);
    }
  }

  private calcularTaxa(valor: number): void {
    const service = this.service as TransferenciaService;
    const taxa = service.calcularTaxa(valor);
    this.taxaCalculadaSubject.next(taxa);

    if (taxa !== null) {
      const taxas = service.getTaxasTransferencia();
      const taxaInfo = taxas.find(t => t.taxa === taxa);
      this.taxaInfoSubject.next(taxaInfo || null);
    } else {
      this.taxaInfoSubject.next(null);
    }
  }

  getFormData(): Partial<Transferencia> {
    return this.formDataSubject.value;
  }

  resetForm(): void {
    this.formDataSubject.next({
      contaOrigem: 'XXXXXXXXXX',
      contaDestino: 'XXXXXXXXXX',
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
    const taxa = this.taxaCalculadaSubject.value;
    
    return !!(
      data.contaOrigem &&
      data.contaDestino &&
      (data.valor ?? 0) > 0 &&
      taxa !== null &&
      data.dataTransferencia &&
      data.contaOrigem !== data.contaDestino
    );
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

    const transferencia: Transferencia = {
      ...formData as Transferencia,
      taxa: taxa,
      dataAgendamento: new Date()
    };

    this.createItem(transferencia);
    this.resetForm();
  }

  getTaxasDisponiveis(): TaxaTransferencia[] {
    const service = this.service as TransferenciaService;
    return service.getTaxasTransferencia();
  }
}

