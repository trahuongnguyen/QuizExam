import { Injectable } from '@angular/core';
import { AuthService } from '../../../shared/service/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../../../shared/models/role.model';
import { UserResponse, UserRequest } from '../../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private authService: AuthService, private http: HttpClient) { }

  getRoleList(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.authService.apiUrl}/user/employee`, this.authService.httpOptions);
  }

  getEmployeeList(statusId: number): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.authService.apiUrl}/user/${statusId}`, this.authService.httpOptions);
  }

  getEmployeeById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.authService.apiUrl}/user/find/${id}`, this.authService.httpOptions);
  }

  createEmployee(employeeForm: UserRequest): Observable<UserRequest> {
    return this.http.post<UserRequest>(`${this.authService.apiUrl}/user`, employeeForm, this.authService.httpOptions);
  }

  updateEmployee(id: number, employeeForm: UserRequest): Observable<UserRequest> {
    return this.http.put<UserRequest>(`${this.authService.apiUrl}/user/${id}`, employeeForm, this.authService.httpOptions);
  }

  resetPasswordEmployee(id: number): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.authService.apiUrl}/user/reset-password/${id}`, {}, this.authService.httpOptions);
  }

  removeEmployee(id: number): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.authService.apiUrl}/user/remove/${id}`, {}, this.authService.httpOptions);
  }

  restoreEmployee(id: number): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.authService.apiUrl}/user/restore/${id}`, {}, this.authService.httpOptions);
  }
}