import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MarkResponse, PassPercentage } from '../../models/mark.model';

@Injectable({
  providedIn: 'root'
})
export class MarkService {
  private markApi: string;
  
  constructor(private authService: AuthService, private http: HttpClient) {
    this.markApi = `${this.authService.apiUrl}/mark`;
  }
  
  getMarkListByExam(examId: number): Observable<MarkResponse[]> {
    return this.http.get<MarkResponse[]>(`${this.markApi}/find-all/${examId}`, this.authService.httpOptions);
  }

  updateMark(examId: number, studentIds: number[]): Observable<MarkResponse[]> {
    return this.http.put<MarkResponse[]>(`${this.markApi}/${examId}`, studentIds, this.authService.httpOptions);
  }

  getPassPercentageBySubject(): Observable<PassPercentage[]> {
    return this.http.get<PassPercentage[]>(`${this.markApi}/pass-percentage`, this.authService.httpOptions);
  }
}