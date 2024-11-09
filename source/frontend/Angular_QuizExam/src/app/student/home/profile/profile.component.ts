import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HomeComponent } from '../home.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  constructor(public authService: AuthService, private http: HttpClient, public toastr: ToastrService, private router: Router, public home: HomeComponent) { }

  ngOnInit(): void {
  }

  currentPassword: any;
  newPassword: any;
  confirmPassword: any;

  isPasswordChangeOpen: boolean = false;
  isChangePasswordButtonVisible: boolean = true;

  changePassword() {
    const passwordRequest = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword,
    }

    this.http.put(`${this.authService.apiUrl}/auth/changePassword`, passwordRequest, this.home.httpOptions).subscribe(
      response => {
        this.toastr.success('Change password Successful!', 'Success', { timeOut: 2000, });
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
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
            timeOut: 5000,
          });
        }
        console.log('Error', error);
      }
    );
  }

  // Hiển thị form đổi mật khẩu
  showChangePasswordForm(): void {
    this.isPasswordChangeOpen = true;
    this.isChangePasswordButtonVisible = false;
  }

  // Ẩn form đổi mật khẩu
  hideChangePasswordForm(): void {
    this.isPasswordChangeOpen = false;
    setTimeout(() => {
      this.isChangePasswordButtonVisible = true;
    }, 500);
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
        toggleIcon.classList.remove('mdi-eye-off-outline');
        toggleIcon.classList.add('mdi-eye-outline');
      } else {
        toggleIcon.classList.remove('mdi-eye-outline');
        toggleIcon.classList.add('mdi-eye-off-outline');
      }
    } else {
      console.error(`Element with id ${inputId} or ${iconId} not found.`);
    }

  }
}

