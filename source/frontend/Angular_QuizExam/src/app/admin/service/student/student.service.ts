import { Injectable } from '@angular/core';
import { AuthService } from '../../../shared/service/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentRequest, StudentResponse, UpdateStudentClassRequest } from '../../../shared/models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private authService: AuthService, private http: HttpClient) { }

  getStudentList(classId: number, statusId: number): Observable<StudentResponse[]> {
    const endpointUrl = (isNaN(classId) || classId == 0) ? `${statusId}` : `${statusId}/${classId}`;
    return this.http.get<StudentResponse[]>(`${this.authService.apiUrl}/student-management/${endpointUrl}`, this.authService.httpOptions);
  }

  getStudentById(id: number): Observable<StudentResponse> {
    return this.http.get<StudentResponse>(`${this.authService.apiUrl}/student-management/find/${id}`, this.authService.httpOptions);
  }

  createStudent(studentForm: StudentRequest): Observable<StudentResponse> {
    return this.http.post<StudentResponse>(`${this.authService.apiUrl}/student-management`, studentForm, this.authService.httpOptions);
  }

  updateStudent(id: number, studentForm: StudentRequest): Observable<StudentResponse> {
    return this.http.put<StudentResponse>(`${this.authService.apiUrl}/student-management/${id}`, studentForm, this.authService.httpOptions);
  }

  getStudentsMovingToClass(userIds: number[]): Observable<StudentResponse[]> {
    return this.http.get<StudentResponse[]>(`${this.authService.apiUrl}/student-management/moving-to-class?userIds=${userIds.join('&userIds=')}`, this.authService.httpOptions);
  }

  updateStudentClass(studentClass: UpdateStudentClassRequest): Observable<StudentResponse[]> {
    return this.http.put<StudentResponse[]>(`${this.authService.apiUrl}/student-management/update-class`, studentClass, this.authService.httpOptions);
  }

  resetPasswordStudent(id: number): Observable<StudentResponse> {
    return this.http.put<StudentResponse>(`${this.authService.apiUrl}/student-management/reset-password/${id}`, {}, this.authService.httpOptions);
  }

  removeStudent(id: number): Observable<StudentResponse> {
    return this.http.put<StudentResponse>(`${this.authService.apiUrl}/student-management/remove/${id}`, {}, this.authService.httpOptions);
  }

  restoreStudent(id: number): Observable<StudentResponse> {
    return this.http.put<StudentResponse>(`${this.authService.apiUrl}/student-management/restore/${id}`, {}, this.authService.httpOptions);
  }
}