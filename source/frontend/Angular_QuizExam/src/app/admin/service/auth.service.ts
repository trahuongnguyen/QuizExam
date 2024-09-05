import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { response } from 'express';

interface User {
  email: string;
  password: string;
}
const token = localStorage.getItem('jwtToken');
const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json' ,
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  }),
  responeType: 'json',
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public apiUrl = 'http://localhost:8080/api';

  private tokenKey = 'token';
  constructor(private http: HttpClient, private router: Router) { }
  

  // Login user
  login(user: User): Observable<any> {

    return this.http.post(`${this.apiUrl}/auth/login`, user, {responseType: 'json'});
  }

  // Logout user
  logout() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    let token = localStorage.getItem(this.tokenKey);
    return token != null && token.length > 0;  
  }

  public getToken(): string | null {
    return this.isLoggedIn() ? localStorage.getItem(this.tokenKey) : null;
  }
}
