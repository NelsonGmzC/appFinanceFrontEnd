import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Category } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  URL_API = 'http://localhost:4001/api/transactions/settings/categories'
  start = new Date(Date.now());

  categories : Category[] | undefined;
  selectedTransaction: Category = {
    category: '',
    icon: '',
    color: '',
    name: '',
    userId: ''
  }

  constructor(private http: HttpClient) {}

  getCategories(userId: string) {
    //return this.http.get<Category[]>(this.URL_API);
    return this.http.get<Category[]>(`${this.URL_API}/${userId}`);
  }

  createCategory(category: Category) {
    return this.http.post(this.URL_API, category);
  }

  updateCategory(category: Category) {
    return this.http.put(`${this.URL_API}/${category._id}`, category);
  }

  updateCategories(categories: any) {
    return this.http.put(this.URL_API, categories);
  }

  deleteCategory(_id: string | undefined) {
    return this.http.delete(`${this.URL_API}/${_id}`);
  }

}
