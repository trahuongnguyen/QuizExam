import { Injectable } from '@angular/core';
import { AuthService } from '../../../shared/service/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClassResponse, ClassRequest } from '../../../shared/models/class.model';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  constructor(private authService: AuthService, private http: HttpClient) { }

  getClassList(): Observable<ClassResponse[]> {
    return this.http.get<ClassResponse[]>(`${this.authService.apiUrl}/class`, this.authService.httpOptions);
  }

  getClassById(id: number): Observable<ClassResponse> {
    return this.http.get<ClassResponse>(`${this.authService.apiUrl}/class/${id}`, this.authService.httpOptions);
  }

  createClass(classForm: ClassRequest): Observable<ClassRequest> {
    return this.http.post<ClassRequest>(`${this.authService.apiUrl}/class`, classForm, this.authService.httpOptions);
  }

  updateClass(id: number, classForm: ClassRequest): Observable<ClassRequest> {
    return this.http.put<ClassRequest>(`${this.authService.apiUrl}/class/${id}`, classForm, this.authService.httpOptions);
  }

  deleteClass(id: number): Observable<ClassRequest> {
    return this.http.put<ClassRequest>(`${this.authService.apiUrl}/class/remove/${id}`, {}, this.authService.httpOptions);
  }
}