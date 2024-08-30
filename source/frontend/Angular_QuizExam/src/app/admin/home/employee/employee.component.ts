import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit {
  constructor(private authService: AuthService, private http: HttpClient, public toastr: ToastrService, private router: Router) {}

  responseData: any;

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.http.get<any>(`${this.authService.apiUrl}/user`).subscribe(
      (data) => {
        this.responseData = data;// Log dữ liệu nhận được từ API
      },
      (error) => {
      }
    );
  }


  fullName: String = '';
  email: String = '';
  dob: String = '';
  phoneNumber: String = '';
  address: String = '';
  gender: number = 1;
  roleId: number = 4;
  createEmployee(): void {
    const employee =
    { fullName: this.fullName, email: this.email, dob: this.dob,
      phoneNumber: this.phoneNumber, address: this.address,
      gender: this.gender, roleId: this.roleId
    }

    this.http.post(`${this.authService.apiUrl}/user/register`, employee).subscribe(
      response => {
        this.toastr.success('Create Successful!', 'Success', {
          timeOut: 2000,
        });
        console.log('Create successfully', response);
        this.router.navigate(['/admin/home/employee']);
      },
      error => {
        this.toastr.error('Error create Employee', 'Error', {
          timeOut: 2000,
        });
        console.log('Error', error);
      }
    )
  }
}
