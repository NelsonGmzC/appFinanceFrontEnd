import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Label } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class LabelService {

  URL_API = 'http://localhost:4001/api/transactions/settings/labels'
  start = new Date(Date.now());

  label : Label[] | undefined;
  selectedTransaction: Label = {
    labels: [],
    userId: ''
  }

  constructor(private http: HttpClient) {}

  getLabels(userId: string) {
    //return this.http.get<Label[]>(this.URL_API);
    return this.http.get<Label[]>(`${this.URL_API}/${userId}`);
  }

  createLabel(label: Label) {
    return this.http.post(this.URL_API, label);
  }

  updateLabel(label: Label) {
    return this.http.put(`${this.URL_API}/${label._id}`, label);
  }

  deleteLabel(_id: string | undefined) {
    return this.http.delete(`${this.URL_API}/${_id}`);
  }

}