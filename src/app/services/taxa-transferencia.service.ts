import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TaxaTransferencia } from '../models/response/taxas-transferencia-dto-get-res';
import { environment } from '../../environments/environment';
import { CalcularTaxaTransferenciaDtoPostRes } from '../models/response/calcular-taxa-transferencia-dto-post-res';
import { CalcularTaxaTransferenciaDtoPostReq } from '../models/request/calcular-taxa-transferencia-dto-post-req';

@Injectable({
  providedIn: 'root'
})
export class TaxaTransferenciaService {
  protected apiUrl = environment.apiUrl + '/taxa-transferencia';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TaxaTransferencia[]> {
    return this.http.get<TaxaTransferencia[]>(this.apiUrl);
  }

  calcularTaxaTransferencia(data: CalcularTaxaTransferenciaDtoPostReq): Observable<CalcularTaxaTransferenciaDtoPostRes> {
    let url = this.apiUrl + '/calcular';
    return this.http.post<CalcularTaxaTransferenciaDtoPostRes>(url, data);
  }
}
