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
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    this.userLogged = null;
    this.isValidToken = false;
    this.router.navigate(['student/login']);
  }

  nagivateToPrePage(): void {
    this.router.navigate(['student/home'])
  }

  isValidToken: any;

  isLoggedIn(): boolean {
    if (this.isLocalStorageAvailable()) {
      let token = localStorage.getItem(this.tokenKey);
      let role = localStorage.getItem(this.roleKey);
      const jwtToken = JSON.parse(atob(token!.split('.')[1]));
      const tokenExpired = Date.now() > (jwtToken.exp * 1000);
      return token != null && token.length > 0 && !tokenExpired && ['ADMIN', 'STUDENT'].includes(role!);
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
