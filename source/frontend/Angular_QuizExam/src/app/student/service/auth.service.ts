import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


interface User {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private router: Router) { }

  // Login user
  login(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user, {responseType: 'text'});
  }

  // Logout user
  logout() {
    localStorage.removeItem('token'); // Delete JWT from localStorage
    this.router.navigate(['/login']); // redirect to login
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Check if token exist
  }
}
