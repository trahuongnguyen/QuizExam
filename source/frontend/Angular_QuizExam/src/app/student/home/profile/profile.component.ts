import { Component, OnInit } from '@angular/core';
import { profile } from 'node:console';
import { AuthService } from '../../service/auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HomeComponent } from '../home.component';
declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  constructor(private authService: AuthService, private http: HttpClient, public toastr: ToastrService, private router: Router, public home: HomeComponent) { }

  user: any;

  ngOnInit(): void {
    // this.loadToken();
    // this.httpOptions = this.home.httpOptions;
    this.http.get<any>(`${this.authService.apiUrl}/auth/profile`, this.home.httpOptions).subscribe((data: any) => {
      this.user = data;
      console.log(this.user);
      // this.fullName = this.user.fullName;
      // this.email = this.user.email;
      // this.dob = this.user.dob;
      // this.phoneNumber = this.user.phoneNumber;
      // this.address = this.user.address;
      // this.gender = this.user.gender;
      // this.id = this.user.id;
    });
  }

  // fullName: String = '';
  // email: String = '';
  // dob: any;
  // phoneNumber: String = '';
  // address: String = '';
  // gender: number = 1;
  // roleId: number = 4;
  oldPassword: any;
  newPassword: any;
  confirmPassword: any;
  id: number = 1;

  chagePassword() {
    const passwordRequest = {
      currentPassword: this.oldPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword,
    }

    this.http.post(`${this.authService.apiUrl}/auth/changePassword/${this.id}`, passwordRequest, this.home.httpOptions).subscribe(
      response => {
        this.toastr.success('Change password Successful!', 'Success', {
          timeOut: 2000,
        });
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        // this.user = employee;    
        //this.showInformation();
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
      const isPassword = passwordInput.getAttribute("type") === "password";
      passwordInput.setAttribute("type", isPassword ? "text" : "password");

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

