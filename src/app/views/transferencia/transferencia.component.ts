import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BaseComponent } from '../../core/components/base.component';
import { TransferenciaViewModel } from '../../viewmodels/transferencia.viewmodel';
import { Transferencia } from '../../models/taxa-transferencia.model';
import { TaxaTransferenciaService } from '../../services/taxa-transferencia.service';

@Component({
  selector: 'app-transferencia',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [TransferenciaViewModel],
  templateUrl: './transferencia.component.html',
  styleUrls: ['./transferencia.component.scss']
})
export class TransferenciaComponent extends BaseComponent implements OnInit {
  activeTab: string = 'agendamento';
  today = new Date();
  mensagemErroContaOrigem: string = '';
  mensagemErroContaDestino: string = '';
  
  formData: Partial<Transferencia> = {
    contaOrigem: 'XXXXXXXXXX',
    contaDestino: 'XXXXXXXXXX',
    valor: 0,
    taxa: 0,
    dataTransferencia: new Date(),
    dataAgendamento: new Date(),
    status: 'PENDENTE'
  };

  constructor(public vm: TransferenciaViewModel) {
    super();
  }

  ngOnInit(): void {
    this.vm.loadTaxasDisponiveis();
    
    this.vm.formData$
      .pipe(this.takeUntilDestroy())
      .subscribe(data => {
        this.formData = { ...data };
      });

    this.vm.error$
      .pipe(this.takeUntilDestroy())
      .subscribe(error => {
        if (error) {
          console.log('Erro capturado:', error);
        }
      });
  }

  onContaOrigemChange(event: any): void {
    this.vm.updateFormData({ contaOrigem: event.target.value });
  }

  onContaDestinoChange(event: any): void {
    this.vm.updateFormData({ contaDestino: event.target.value });
  }

  onValorChange(event: any): void {
    this.vm.updateFormData({ valor: parseFloat(event.target.value) || 0 });
  }

  onDataTransferenciaChange(event: any): void {
    this.vm.updateFormData({ dataTransferencia: new Date(event.target.value) });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  formatDateForInput(date: Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit(): void {
    this.vm.clearError();
    this.vm.submitTransferencia();
  }

  onReset(): void {
    this.vm.resetForm();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDENTE': return 'status-pendente';
      case 'REALIZADA': return 'status-realizada';
      case 'CANCELADA': return 'status-cancelada';
      default: return '';
    }
  }

  errorContaOrigem(contaOrigem: string, contaDestino: string): boolean {
    let result = false;
    
    if(contaOrigem === contaDestino){
      this.mensagemErroContaOrigem = 'Conta de origem não pode ser igual à conta de destino';
      result = true;
    }

    if(contaOrigem === 'XXXXXXXXXX' || contaOrigem === ''){
      this.mensagemErroContaOrigem = 'Conta de origem é obrigatória';
      result = true;
    }
    
    return result;
  }

  errorContaDestino(contaDestino: string, contaOrigem: string): boolean {
    let result = false;
    
    if(contaDestino === contaOrigem){
      this.mensagemErroContaDestino = 'Conta de destino não pode ser igual à conta de origem';
      result = true;
    }

    if(contaDestino === 'XXXXXXXXXX' || contaDestino === ''){
      this.mensagemErroContaDestino = 'Conta de destino é obrigatória';
      result = true;
    }
    
    return result;
  }
}

