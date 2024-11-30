import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = 'http://localhost:8080/api';

  tokenKey = 'jwtToken';

  roleKey = 'role';
  
  myUser: any;

  entityExporter = '';

  listExporter: any;

  httpOptions: { headers: HttpHeaders; responseType: 'json'; withCredentials: true } = {
    headers: new HttpHeaders({'Accept': 'application/json'}),
    responseType: 'json',
    withCredentials: true
  };

  constructor(private http: HttpClient, private router: Router) { }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, loginRequest, { responseType: 'json' });
  }

  takeRole(options: any): any {
    return this.http.get<any>(`${this.apiUrl}/auth/role`, options);
  }

  // Kiểm tra xem localStorage có sẵn không trước khi sử dụng
  isLocalStorageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }

  loadToken(pageType: 'USER' | 'ADMIN') {
    if (this.isLoggedIn(pageType)) {
      const token = localStorage.getItem(this.tokenKey);
      this.httpOptions = {
        headers: new HttpHeaders({ 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }),
        responseType: 'json',
        withCredentials: true
      };
    }
    else {
      this.router.navigate([pageType == 'USER' ? '/login' : 'admin/login']);
    }
  }

  logout(pageType: 'USER' | 'ADMIN') {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    this.router.navigate([pageType == 'USER' ? '/login' : 'admin/login']);
  }

  isLoggedIn(pageType: 'USER' | 'ADMIN'): boolean {
    if (this.isLocalStorageAvailable()) {
      const token = localStorage.getItem(this.tokenKey);
      const roles = localStorage.getItem(this.roleKey);

      // Ensure both token and roles exist
      if (!token || !roles) {
        return false;
      }

      try {
        // Decode the token and extract the expiration time
        const jwtToken = JSON.parse(atob(token.split('.')[1]));
        const tokenExpired = Date.now() > (jwtToken.exp * 1000);
        const checkRole = (pageType == 'USER' ? ['STUDENT'].includes(roles) : ['ADMIN', 'DIRECTOR', 'TEACHER', 'SRO'].includes(roles));

        // Check if token is valid and not expired, and if the role is correct
        return !tokenExpired && checkRole;
      }
      catch (error) {
        // If there's an issue with decoding the token, treat the token as invalid
        console.error('Error decoding token:', error);
        return false;
      }
    }
    return false;
  }

  getToken(pageType: 'USER' | 'ADMIN'): string | null {
    return this.isLoggedIn(pageType) ? localStorage.getItem(this.tokenKey) : null;
  }

  exportDataExcel() {
    const token = this.getToken('ADMIN');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token).set('Content-Type', 'application/json');

    return this.http.post(`${this.apiUrl}/${this.entityExporter}/export/excel`, this.listExporter, { headers: headers, responseType: 'blob', });
  }

  exportDataPDF() {
    const token = this.getToken('ADMIN');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token).set('Content-Type', 'application/json');

    return this.http.post(`${this.apiUrl}/${this.entityExporter}/export/pdf`, this.listExporter, { headers: headers, responseType: 'blob', });
  }
}