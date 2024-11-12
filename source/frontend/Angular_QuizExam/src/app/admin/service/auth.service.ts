import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  public roleKey = 'role';

  public userLogged: any = localStorage.getItem('userLogged');
  public myUser: any;

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
    localStorage.removeItem(this.roleKey);
    this.userLogged = null;
    this.isValidToken = false;
    this.router.navigate(['admin/login']);
  }

  nagivateToPrePage(): void {
    this.router.navigate(['admin'])
  }

  isValidToken: any;

  isLoggedIn(): boolean {
    if (this.isLocalStorageAvailable()) {
      const token = localStorage.getItem(this.tokenKey);
      const role = localStorage.getItem(this.roleKey);

      // Ensure both token and role exist
      if (!token || !role) {
        return false;
      }

      try {
        // Decode the token and extract the expiration time
        const jwtToken = JSON.parse(atob(token.split('.')[1]));
        const tokenExpired = Date.now() > (jwtToken.exp * 1000);
        // Check if token is valid and not expired, and if the role is correct
        return !tokenExpired && ['ADMIN', 'DIRECTOR', 'TEACHER', 'SRO'].includes(role);
      } catch (error) {
        // If there's an issue with decoding the token, treat the token as invalid
        console.error('Error decoding token:', error);
        return false;
      }
    }
    return false;
  }

  public getToken(): string | null {
    return this.isLoggedIn() ? localStorage.getItem(this.tokenKey) : null;
  }

  public entityExporter = '';
  public listExporter: any;

  exportDataExcel() {
    const token = this.getToken(); // Lấy token từ AuthService
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token).set('Content-Type', 'application/json');

    return this.http.post(`${this.apiUrl}/${this.entityExporter}/export/excel`, this.listExporter, { headers: headers, responseType: 'blob', });
  }

  exportDataPDF() {
    const token = this.getToken(); // Lấy token từ AuthService
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token).set('Content-Type', 'application/json');

    return this.http.post(`${this.apiUrl}/${this.entityExporter}/export/pdf`, this.listExporter, { headers: headers, responseType: 'blob', });
  }
}
