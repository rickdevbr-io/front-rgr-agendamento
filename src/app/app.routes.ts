import { Routes } from '@angular/router';
import { TransferenciaComponent } from './views/transferencia/transferencia.component';

export const routes: Routes = [
  { path: '', component: TransferenciaComponent },
  { path: 'transferencia', component: TransferenciaComponent },
  { path: '**', redirectTo: '' }
];
