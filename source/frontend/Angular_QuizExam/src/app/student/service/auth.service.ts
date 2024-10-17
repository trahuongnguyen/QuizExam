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

  constructor(private http: HttpClient, private router: Router) { }

  // Login user
  login(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user, { responseType: 'json' });
  }

  // Logout user
  logout() {
    localStorage.removeItem('jwtToken'); // Delete JWT from localStorage
    this.router.navigate(['/login']); // redirect to login
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwtToken'); // Check if token exist
  }
}
