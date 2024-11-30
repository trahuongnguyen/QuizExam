import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/service/auth.service';
import { Title } from '@angular/platform-browser';
import { AdminComponent } from '../../admin.component';
import { HomeComponent } from '../home.component';
import { ProfileService } from '../../service/profile/profile.service';
import { EmployeeService } from '../../service/employee/employee.service';
import { Role } from '../../../shared/models/role.model';
import { UserResponse, UserRequest } from '../../../shared/models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: [
    './../../../shared/styles/admin/style.css',
    './profile.component.css'
  ]
})
export class ProfileComponent implements OnInit {
  role: Role;
  profile: UserResponse;
  profileId: number = 0;
  profileForm: UserRequest = { gender: 1, roleId: 4 };

  currentPassword: any;
  newPassword: any;
  confirmPassword: any;

  constructor(
    private authService: AuthService,
    private titleService: Title,
    public admin: AdminComponent,
    private home: HomeComponent,
    private profileService: ProfileService,
    private employeeService: EmployeeService,
    private http: HttpClient,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) {
    this.role = {
      id: 0,
      name: '',
      description: ''
    };

    this.profile = {
      id: 0,
      fullName: '',
      dob: new Date(),
      gender: 0,
      address: '',
      phoneNumber: '',
      email: '',
      role: this.role
    };
  }

  ngOnInit(): void {
    this.titleService.setTitle('Profile');
    this.loadData();
  }

  loadData(): void {
    this.profileService.getProfile().subscribe({
      next: (profileResponse) => {
        this.profile = profileResponse;
        this.convertToRequest();
      },
      error: (err) => {
        this.toastr.error(err.error.message, 'Error', { timeOut: 4000 });
      }
    });
  }

  convertToRequest(): void {
    this.profileForm.fullName = this.profile.fullName;
    this.profileForm.dob = this.profile.dob;
    this.profileForm.gender = this.profile.gender;
    this.profileForm.address = this.profile.address;
    this.profileForm.phoneNumber = this.profile.phoneNumber;
    this.profileForm.email = this.profile.email;
    this.profileForm.roleId = this.profile.role?.id;
  }

  convertDateFormat(dateObj: Date | undefined): string {
    // Dùng DatePipe để chuyển đổi đối tượng Date sang định dạng 'yyyy-MM-dd'
    return this.datePipe.transform(dateObj, 'dd-MM-yyyy')!;
  }

  showEditForm() {
    (document.getElementById('infor') as HTMLElement).style.display = 'none';
    (document.getElementById('form-infor') as HTMLElement).style.display = 'block';
    (document.getElementById('change-password-form') as HTMLElement).style.display = 'none';
  }

  showPasswordForm() {
    (document.getElementById('infor') as HTMLElement).style.display = 'none';
    (document.getElementById('form-infor') as HTMLElement).style.display = 'none';
    (document.getElementById('change-password-form') as HTMLElement).style.display = 'block';
  }

  showInformation() {
    this.loadData();
    (document.getElementById('infor') as HTMLElement).style.display = 'block';
    (document.getElementById('form-infor') as HTMLElement).style.display = 'none';
    (document.getElementById('change-password-form') as HTMLElement).style.display = 'none';
  }

  updateProfile() {
    if (this.profile.id !== undefined) {
      this.employeeService.updateEmployee(this.profile.id, this.profileForm).subscribe({
        next: () => {
          this.toastr.success('Update Successful!', 'Success', { timeOut: 2000 });
          this.showInformation();
        },
        error: (err) => {
          if (err.status === 401) {
            this.toastr.error('Unauthorized', 'Failed', { timeOut: 2000 });
          }
          else {
            let msg = '';
            if (err.error.message) {
              msg = err.error.message;
            }
            else {
              err.error.forEach((err: any) => {
                msg += ' ' + err.message;
              })
            }
            this.toastr.error(msg, 'Failed', { timeOut: 2000 });
          }
          console.log('Error', err);
          this.toastr.error('Update Employee Fail!', 'Error', { timeOut: 2000 });
        }
      });
    }
  }

  chagePassword() {
    const passwordRequest = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword,
    }

    this.http.put(`${this.authService.apiUrl}/auth/change-password`, passwordRequest, this.home.httpOptions).subscribe(
      response => {
        this.toastr.success('Change password Successful!', 'Success', {
          timeOut: 2000,
        });
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        // this.user = employee;    
        this.showInformation();
      },
      error => {
        if (error.status === 401) {
          this.toastr.error('Unauthorized', 'Failed', {
            timeOut: 2000,
          });
        } else {
          let msg = '';
          if (error.error.message) {
            msg = error.error.message;
          } else {
            error.error.forEach((err: any) => {
              msg += ' ' + err.message;
            })
          }
          this.toastr.error(msg, 'Failed', {
            timeOut: 2000,
          });
        }
        console.log('Error', error);
      }
    )

  }

  visiblePassword(inputId: string, iconId: string): void {
    // Tìm phần tử đầu vào mật khẩu và icon bằng ID
    const passwordInput = document.getElementById(inputId) as HTMLInputElement | null;
    const toggleIcon = document.getElementById(iconId) as HTMLElement | null;

    if (passwordInput && toggleIcon) {
      // Kiểm tra và thay đổi thuộc tính 'type' giữa 'password' và 'text'
      //const isPassword = passwordInput.getAttribute("type") === "password";
      const isPassword = passwordInput.type == 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      //passwordInput.setAttribute("type", isPassword ? "text" : "password");

      // Thay đổi icon dựa trên trạng thái của trường mật khẩu
      if (isPassword) {
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
      } else {
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
      }
    } else {
      console.error(`Element with id ${inputId} or ${iconId} not found.`);
    }
  }
}