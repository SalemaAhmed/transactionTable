import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TransactionService {
  private apiUrl = 'http://localhost:3000';
  DUMMY_CUSTOMERS =  [
    { id: 0, name: 'Dummy User' },
    { id: 1, name: 'Ahmed Ali' },
    { id: 2, name: 'Aya Elsayed' },
    { id: 3, name: 'Mina Adel' },
    { id: 4, name: 'Sarah Reda' },
    { id: 5, name: 'Mohamed Sayed' }
  ]
  DUMMY_TRANSACTIONS=  [
    { id: 0, customer_id: 0, date: '2022-01-01', amount: 200 },
    { id: 1, customer_id: 1, date: '2022-01-01', amount: 1000 },
    { id: 2, customer_id: 1, date: '2022-01-02', amount: 2000 },
    { id: 3, customer_id: 2, date: '2022-01-01', amount: 550 },
    { id: 4, customer_id: 3, date: '2022-01-01', amount: 500 },
    { id: 5, customer_id: 2, date: '2022-01-02', amount: 1300 },
    { id: 6, customer_id: 4, date: '2022-01-01', amount: 750 },
    { id: 7, customer_id: 3, date: '2022-01-02', amount: 1250 },
    { id: 8, customer_id: 5, date: '2022-01-01', amount: 2500 },
    { id: 9, customer_id: 5, date: '2022-01-02', amount: 875 }
  ]
  constructor(private http: HttpClient) {}

  getCustomers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/customers`).pipe(
      catchError(error => {
        console.error('API call failed, using dummy data:', error);
        return of(this.DUMMY_CUSTOMERS); // Return dummy data if the API call fails
      }))
  }

  getTransactions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/transactions`).pipe(
      catchError(error => {
        console.error('API call failed, using dummy data:', error);
        return of(this.DUMMY_TRANSACTIONS); // Return dummy data if the API call fails
      }))
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
