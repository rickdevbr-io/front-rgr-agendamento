import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Transferencia } from '../models/transferencia.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private transferencias: Transferencia[] = [
    {
      id: 1,
      contaOrigem: '1234567890',
      contaDestino: '0987654321',
      valor: 1500.00,
      taxa: 1.50,
      dataTransferencia: new Date('2024-12-20'),
      dataAgendamento: new Date('2024-12-15'),
      status: 'PENDENTE',
      createdAt: new Date('2024-12-15'),
      updatedAt: new Date('2024-12-15')
    },
    {
      id: 2,
      contaOrigem: '1111111111',
      contaDestino: '2222222222',
      valor: 5000.00,
      taxa: 3.00,
      dataTransferencia: new Date('2024-12-18'),
      dataAgendamento: new Date('2024-12-14'),
      status: 'REALIZADA',
      createdAt: new Date('2024-12-14'),
      updatedAt: new Date('2024-12-18')
    },
    {
      id: 3,
      contaOrigem: '3333333333',
      contaDestino: '4444444444',
      valor: 25000.00,
      taxa: 5.00,
      dataTransferencia: new Date('2024-12-22'),
      dataAgendamento: new Date('2024-12-13'),
      status: 'PENDENTE',
      createdAt: new Date('2024-12-13'),
      updatedAt: new Date('2024-12-13')
    }
  ];

  private nextId = 4;

  getAll(): Observable<Transferencia[]> {
    return of([...this.transferencias]).pipe(delay(500));
  }

  getById(id: number): Observable<Transferencia | undefined> {
    const transferencia = this.transferencias.find(t => t.id === id);
    return of(transferencia).pipe(delay(300));
  }

  create(transferencia: Omit<Transferencia, 'id' | 'createdAt' | 'updatedAt'>): Observable<Transferencia> {
    const novaTransferencia: Transferencia = {
      ...transferencia,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.transferencias.push(novaTransferencia);
    return of(novaTransferencia).pipe(delay(800));
  }

  update(id: number, transferencia: Partial<Transferencia>): Observable<Transferencia> {
    const index = this.transferencias.findIndex(t => t.id === id);
    if (index !== -1) {
      this.transferencias[index] = {
        ...this.transferencias[index],
        ...transferencia,
        updatedAt: new Date()
      };
      return of(this.transferencias[index]).pipe(delay(600));
    }
    throw new Error('Transferência não encontrada');
  }

  delete(id: number): Observable<void> {
    const index = this.transferencias.findIndex(t => t.id === id);
    if (index !== -1) {
      this.transferencias.splice(index, 1);
      return of(void 0).pipe(delay(400));
    }
    throw new Error('Transferência não encontrada');
  }
}

