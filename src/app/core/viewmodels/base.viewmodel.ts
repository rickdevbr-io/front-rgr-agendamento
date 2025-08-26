import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from '../services/base.service';
import { BaseModel } from '../interfaces/base.interface';

@Injectable()
export abstract class BaseViewModel<T extends BaseModel> {
  protected itemsSubject = new BehaviorSubject<T[]>([]);
  protected loadingSubject = new BehaviorSubject<boolean>(false);
  protected errorSubject = new BehaviorSubject<string | null>(null);

  public items$ = this.itemsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(protected service: BaseService<T>) {}

  loadItems(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.service.getAll().subscribe({
      next: (items) => {
        this.itemsSubject.next(items);
        this.loadingSubject.next(false);
      },
      error: (error) => {
        this.errorSubject.next('Erro ao carregar dados: ' + error.message);
        this.loadingSubject.next(false);
      }
    });
  }

  createItem(item: T): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.service.create(item).subscribe({
      next: (newItem) => {
        const currentItems = this.itemsSubject.value;
        this.itemsSubject.next([...currentItems, newItem]);
        this.loadingSubject.next(false);
      },
      error: (error) => {
        this.errorSubject.next('Erro ao criar item: ' + error.message);
        this.loadingSubject.next(false);
      }
    });
  }

  updateItem(id: number, item: T): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.service.update(id, item).subscribe({
      next: (updatedItem) => {
        const currentItems = this.itemsSubject.value;
        const updatedItems = currentItems.map(i => i.id === id ? updatedItem : i);
        this.itemsSubject.next(updatedItems);
        this.loadingSubject.next(false);
      },
      error: (error) => {
        this.errorSubject.next('Erro ao atualizar item: ' + error.message);
        this.loadingSubject.next(false);
      }
    });
  }

  deleteItem(id: number): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.service.delete(id).subscribe({
      next: () => {
        const currentItems = this.itemsSubject.value;
        const filteredItems = currentItems.filter(i => i.id !== id);
        this.itemsSubject.next(filteredItems);
        this.loadingSubject.next(false);
      },
      error: (error) => {
        this.errorSubject.next('Erro ao deletar item: ' + error.message);
        this.loadingSubject.next(false);
      }
    });
  }

  clearError(): void {
    this.errorSubject.next(null);
  }
}

