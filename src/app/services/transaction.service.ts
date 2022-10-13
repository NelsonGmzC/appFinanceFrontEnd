import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  URL_API = 'http://localhost:4001/api/transactions'
  start = new Date(Date.now());

  transactions : Transaction[] | undefined;
  selectedTransaction: Transaction = {
    category: '',
    categoryOpc: '',
    date: this.start,
    notes: '',
    labels: [],
    amoint: 0,
    coin: '',
    img: '',
    userId: ''
  }

  constructor(private http: HttpClient) {}

  getTransactions(userId: string) {
    //return this.http.get<Transaction[]>(this.URL_API, userId);
    return this.http.get<Transaction[]>(`${this.URL_API}/${userId}`);
  }

  createTransaction(transaction: Transaction) {
    return this.http.post(this.URL_API, transaction);
  }

  updateTransaction(transaction: Transaction) {
    return this.http.put(`${this.URL_API}/${transaction._id}`, transaction);
  }

  deleteTransaction(_id: string | undefined) {
    return this.http.delete(`${this.URL_API}/${_id}`);
  }

}
