import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { response } from 'express';

interface User {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public apiUrl = 'http://localhost:8080/api';

  private tokenKey = 'jwtToken';
  constructor(private http: HttpClient, private router: Router) { }

  // Kiểm tra xem localStorage có sẵn không trước khi sử dụng
  private isLocalStorageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }


  // Login user
  login(user: User): Observable<any> {

    return this.http.post(`${this.apiUrl}/auth/login`, user, { responseType: 'json' });
  }

  // Logout user
  // logout() {
  //   localStorage.removeItem(this.tokenKey);
  //   this.router.navigate(['/login']);
  // }
  // Logout admin
  logoutAdmin() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['admin/login']);
  }

  isLoggedIn(): boolean {
    if (this.isLocalStorageAvailable()) {
      let token = localStorage.getItem(this.tokenKey);
      return token != null && token.length > 0;
    }
    return false;
  }

  public getToken(): string | null {
    return this.isLoggedIn() ? localStorage.getItem(this.tokenKey) : null;
  }
}
