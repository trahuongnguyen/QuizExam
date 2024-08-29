import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit {
  constructor(private authService: AuthService, private http: HttpClient) {}

  responseData: any;

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.http.get<any>(`${this.authService.apiUrl}user`).subscribe(
      (data) => {
        this.responseData = data;// Log dữ liệu nhận được từ API
      },
      (error) => {
      }
    );
  }
}
