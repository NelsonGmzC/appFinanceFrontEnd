import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Login } from '../models/transaction';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //URL_API = 'http://localhost:4001/api/transactions/signin'
  URL_API = 'https://app-finance.adaptable.app/api/transactions/signin'
  user : Login[] | undefined;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  //singin user 
  singIn(user: Login) {
    return this.http.post(this.URL_API, user);
  }

  //get token 
  loggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  //get token
  getToken() {
    return localStorage.getItem('token');
  }

  //delete token logout
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
