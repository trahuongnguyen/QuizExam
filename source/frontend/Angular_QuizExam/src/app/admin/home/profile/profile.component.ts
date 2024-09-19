import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HomeComponent } from '../home.component';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
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
    (document.getElementById('infor') as HTMLElement).style.display = 'block';
    (document.getElementById('form-infor') as HTMLElement).style.display = 'none';
    (document.getElementById('change-password-form') as HTMLElement).style.display = 'none';
  }

  edit() {

    const employee =
    {
      fullName: this.fullName, email: this.email, dob: this.dob,
      phoneNumber: this.phoneNumber, address: this.address,
      gender: this.gender, id: this.id,
    }

    this.http.post(`${this.authService.apiUrl}/user/update/${this.id}`, employee, this.httpOptions).subscribe(
      response => {
        this.toastr.success('Update Successful!', 'Success', {
          timeOut: 2000,
        });
        // window.location.reload();
        this.user = employee;
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

  onGenderSelectionChange(gen: any): void {
    this.gender = gen;
  }

  chagePassword() {
    const passwordRequest = {
      currentPassword: this.oldPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword,
    }

    this.http.post(`${this.authService.apiUrl}/user/changePassword/${this.id}`, passwordRequest, this.httpOptions).subscribe(
      response => {
        this.toastr.success('Change password Successful!', 'Success', {
          timeOut: 2000,
        });
        this.oldPassword = '';
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

  constructor(private authService: AuthService, private http: HttpClient, public toastr: ToastrService, private router: Router, public home: HomeComponent) { }

  user: any;
  httpOptions: any;


  ngOnInit(): void {
    //this.loadToken();
    this.httpOptions = this.home.httpOptions;
    this.http.get<any>(`${this.authService.apiUrl}/auth/profile`, this.httpOptions).subscribe((data: any) => {
      this.user = data;
      this.fullName = this.user.fullName;
      this.email = this.user.email;
      this.dob = this.user.dob;
      this.phoneNumber = this.user.phoneNumber;
      this.address = this.user.address;
      this.gender = this.user.gender;
      this.id = this.user.id;
    });

  }

  fullName: String = '';
  email: String = '';
  dob: any;
  phoneNumber: String = '';
  address: String = '';
  gender: number = 1;
  roleId: number = 4;
  oldPassword: any;
  newPassword: any;
  confirmPassword: any;
  id: number = 1;

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
