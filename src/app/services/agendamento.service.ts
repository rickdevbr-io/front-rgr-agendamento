import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AgendamentoDtoGetRes } from '../models/response/agendamento-dto-get-res';
import { AgendamentoDtoGetReq } from '../models/request/agendamento-dto-get-req';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  protected apiUrl = environment.apiUrl + '/agendamento';

  constructor(private http: HttpClient) {}

  getAll(): Observable<AgendamentoDtoGetRes[]> {
    return this.http.get<AgendamentoDtoGetRes[]>(this.apiUrl);
  }

  postAgendamento(agendamento: AgendamentoDtoGetReq): Observable<AgendamentoDtoGetRes> {
    return this.http.post<AgendamentoDtoGetRes>(this.apiUrl, agendamento);
  }
  
}
