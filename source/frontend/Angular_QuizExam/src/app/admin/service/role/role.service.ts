import { Injectable } from '@angular/core';
import { AuthService } from '../../../shared/service/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../../../shared/models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private id: number = 0;

  setId(id: number): void {
    this.id = id;
  }

  getId(): number {
    return this.id;
  }
  
  constructor(private authService: AuthService, private http: HttpClient) { }

  getRoleList(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.authService.apiUrl}/role`, this.authService.httpOptions);
  }

  getRoleById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.authService.apiUrl}/role/${id}`, this.authService.httpOptions);
  }

  getPermissionList(roleId: number): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.authService.apiUrl}/permission/${roleId}`, this.authService.httpOptions);
  }
}