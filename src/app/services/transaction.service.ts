import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/customers`);
  }

  getTransactions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/transactions`);
  }
  getCustomersWithTransactions(): Observable<any> {
    return forkJoin({
      customers: this.getCustomers(),
      transactions: this.getTransactions()
    }).pipe(
      map((data: any) => {
        const customers = data.customers;
        const transactions = data.transactions;

        return customers.map((customer: any) => ({
          ...customer,
          transactions: transactions.filter((transaction: any) => transaction.customer_id.toString() === customer.id)
        }));
      })
    );
  }
}
