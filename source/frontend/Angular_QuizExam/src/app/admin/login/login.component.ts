import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  constructor(private authService: AuthService, private router: Router, public toastr: ToastrService) { }
  //Login
  password: string = '';
  email: string = '';

  login() {
    if (!this.email) {
      this.toastr.error('Email is required', 'Failed', {
        timeOut: 2000,
      });
      return;
    }
  
    if (!this.password) {
      this.toastr.error('Password is required', 'Failed', {
        timeOut: 2000,
      });
      return;
    }
  
    const user = { password: this.password, email: this.email };
    this.authService.login(user).subscribe(
      response => {
        this.toastr.success('Login Successful!', 'Success', {
          timeOut: 2000,
        });
        window.localStorage.setItem('jwtToken', JSON.stringify(response.token));
        console.log('User logged in successfully', response);
        this.router.navigate(['/admin/home/employee']);
      },
      error => {
        if (error.status === 401) {  
          this.toastr.error('Invalid email or password', 'Failed', {
            timeOut: 2000,
          });
        } else {
          this.toastr.error('Login failed due to server error', 'Failed', {
            timeOut: 2000,
          });
        }
        console.error('Error logging in user', error);
      }
    );
  }
}

