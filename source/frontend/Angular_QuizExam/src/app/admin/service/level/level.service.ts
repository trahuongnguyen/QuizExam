import { Injectable } from '@angular/core';
import { AuthService } from '../../../shared/service/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LevelResponse, LevelRequest } from '../../../shared/models/level.model';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  constructor(private authService: AuthService, private http: HttpClient) { }

  getLevelList(): Observable<LevelResponse[]> {
    return this.http.get<LevelResponse[]>(`${this.authService.apiUrl}/level`, this.authService.httpOptions);
  }

  getLevelById(id: number): Observable<LevelResponse> {
    return this.http.get<LevelResponse>(`${this.authService.apiUrl}/level/${id}`, this.authService.httpOptions);
  }

  createLevel(levelForm: LevelRequest): Observable<LevelResponse> {
    return this.http.post<LevelResponse>(`${this.authService.apiUrl}/level`, levelForm, this.authService.httpOptions);
  }

  updateLevel(id: number, levelForm: LevelRequest): Observable<LevelResponse> {
    return this.http.put<LevelResponse>(`${this.authService.apiUrl}/level/${id}`, levelForm, this.authService.httpOptions);
  }

  deleteLevel(id: number): Observable<LevelResponse> {
    return this.http.put<LevelResponse>(`${this.authService.apiUrl}/level/delete/${id}`, {}, this.authService.httpOptions);
  }
}