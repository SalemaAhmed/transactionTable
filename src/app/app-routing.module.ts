import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'transaction-list',
    loadComponent: () => import('./features/transaction/transaction-list/transaction-list.component').then(m => m.TransactionListComponent)
  },
{ path: '**', redirectTo: '/transaction-list' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
