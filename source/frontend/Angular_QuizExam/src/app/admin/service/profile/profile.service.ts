import { Injectable } from '@angular/core';
import { AuthService } from '../../../shared/service/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserResponse } from '../../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private authService: AuthService, private http: HttpClient) { }

  getProfile(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.authService.apiUrl}/auth/profile`, this.authService.httpOptions);
  }
}