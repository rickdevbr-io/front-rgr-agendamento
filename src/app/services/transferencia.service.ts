import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../core/services/base.service';
import { Transferencia, TaxaTransferencia } from '../models/transferencia.model';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class TransferenciaService extends BaseService<Transferencia> {
  protected apiUrl = '/api/transferencias';

  constructor(
    http: HttpClient,
    private mockDataService: MockDataService
  ) {
    super(http);
  }

  override getAll(): Observable<Transferencia[]> {
    return this.mockDataService.getAll();
  }

  override create(item: Transferencia): Observable<Transferencia> {
    return this.mockDataService.create(item);
  }

  override update(id: number, item: Transferencia): Observable<Transferencia> {
    return this.mockDataService.update(id, item);
  }

  override delete(id: number): Observable<void> {
    return this.mockDataService.delete(id);
  }

  getTaxasTransferencia(): TaxaTransferencia[] {
    return [
      { valorMinimo: 0, valorMaximo: 1000, taxa: 0.5, descricao: 'Até R$ 1.000,00 - Taxa: R$ 0,50' },
      { valorMinimo: 1000.01, valorMaximo: 5000, taxa: 1.5, descricao: 'R$ 1.000,01 a R$ 5.000,00 - Taxa: R$ 1,50' },
      { valorMinimo: 5000.01, valorMaximo: 10000, taxa: 3.0, descricao: 'R$ 5.000,01 a R$ 10.000,00 - Taxa: R$ 3,00' },
      { valorMinimo: 10000.01, valorMaximo: 50000, taxa: 5.0, descricao: 'R$ 10.000,01 a R$ 50.000,00 - Taxa: R$ 5,00' },
      { valorMinimo: 50000.01, valorMaximo: 100000, taxa: 8.0, descricao: 'R$ 50.000,01 a R$ 100.000,00 - Taxa: R$ 8,00' },
      { valorMinimo: 100000.01, valorMaximo: 999999999, taxa: 12.0, descricao: 'Acima de R$ 100.000,00 - Taxa: R$ 12,00' }
    ];
  }

  calcularTaxa(valor: number): number | null {
    const taxas = this.getTaxasTransferencia();
    const taxa = taxas.find(t => valor >= t.valorMinimo && valor <= t.valorMaximo);
    return taxa ? taxa.taxa : null;
  }
}
