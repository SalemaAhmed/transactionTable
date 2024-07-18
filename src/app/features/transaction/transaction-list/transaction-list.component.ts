import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TransactionService } from 'src/app/services/transaction.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChartModule } from 'primeng/chart';
import { RippleModule } from 'primeng/ripple';
@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports:[CommonModule, RippleModule, TableModule ,DropdownModule,FormsModule,ChartModule,ButtonModule,InputNumberModule],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent {
  basicData: any;
  basicOptions: any;
  customers: any[] = [];
  customersWithTransactions: any[] = [];
  allCustomersWithTransactions: any[] = [];
  transactions: any[] = [];
  filteredCustomers: any[] = [];
  customerTransactions: any[]= [];
  customerSelected =null;
  transactionSelected:any;
  chartData: any = null;
  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.transactionService.getCustomers().subscribe(data => {
      this.customers = data;
      console.log("customers",this.customers);
    });
    this.transactionService.getTransactions().subscribe(data => {
      this.transactions = data;
      console.log("transactions",this.transactions);
      this.getCustomersWithTransactions();
    });
  }
  getCustomersWithTransactions(){
    this.customersWithTransactions = this.customers.map((customer: any) => {
      const customerTransactions = this.transactions.filter((transaction: any) => transaction.customer_id.toString() === customer.id);
      const totalTransactions = customerTransactions.reduce((total: number, transaction: any) => total + transaction.amount, 0);
  
      return {
        ...customer,
        transactions: customerTransactions,
        totalTransactions: totalTransactions
      };
    });
    console.log("customersWithTransactions",this.customersWithTransactions);
    this.allCustomersWithTransactions = [...this.customersWithTransactions];
  }

  filterTable(name: string, amount: string): void {
    this.filteredCustomers = this.customers.filter(customer => {
      const customerTransactions = this.transactions.filter(
        transaction => transaction.customer_id === customer.id
      );

      const matchesName = customer.name.toLowerCase().includes(name.toLowerCase());
      const matchesAmount = customerTransactions.some(transaction => transaction.amount.toString().includes(amount));

      return matchesName && matchesAmount;
    });
  }
  applyFilter(customer?: any | null, transactionSelected?: number) {
    if (customer !== null) {
      this.transactionSelected = null
      this.customersWithTransactions = this.allCustomersWithTransactions.filter(item => item.id === customer.id );
      this.setChart(this.customerSelected)
    } else {
      if (transactionSelected) {
        this.customersWithTransactions = this.allCustomersWithTransactions.filter(item => item.totalTransactions > transactionSelected);
      } else {
        this.customersWithTransactions = [...this.allCustomersWithTransactions];
      }
    }
  }
  handleTransaction(customer: any) {
    let customerTransactions = this.transactions.filter(
      transaction => transaction.customer_id === customer.id
    );
    return customerTransactions
  }
  clearFilter(){
    this.customerSelected = null ;
    this.applyFilter(this.customerSelected)
  }
  setChart(customerSelected:any) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const transactionMap = new Map<string, number>();
    const transactions = customerSelected.transactions;
    transactions.forEach((transaction:any) => {
      const date = transaction.date;
      const amount = transaction.amount;
      if (transactionMap.has(date)) {
        transactionMap.set(date, transactionMap.get(date) + amount);
      } else {
        transactionMap.set(date, amount);
      }
    });
    this.basicData = {
        labels: Array.from(transactionMap.keys()),
        datasets: [
            {
                label: 'Sales',
                data: Array.from(transactionMap.values()),
                backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                borderWidth: 1
            }
        ]
    };

    this.basicOptions = {
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };
}
}
