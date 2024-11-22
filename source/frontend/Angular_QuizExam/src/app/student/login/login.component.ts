import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private authService: AuthService, private titleService: Title, private router: Router, public toastr: ToastrService, private formBuilder: FormBuilder, private http: HttpClient) {
    this.titleService.setTitle('Login');
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    if (this.isLocalStorageAvailable()) {
      const role = localStorage.getItem('role');
      if (role && role == 'STUDENT') {
        this.router.navigate(['']);
      }
    }
  }
  
  private isLocalStorageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.login({ email: this.loginForm.get('email')?.value, password: this.loginForm.get('password')?.value }).subscribe(
        response => {
          const headers = new HttpHeaders().set('Email', this.loginForm.get('email')?.value);
          this.http.get<any>(`${this.authService.apiUrl}/auth/role`, { headers: headers, responseType: 'json' }).subscribe((data: any) => {
            let role = data.name;
            if (['STUDENT'].includes(role)) {
              this.toastr.success('Login Successful!', 'Success', {
                timeOut: 2000,
              });
              window.localStorage.setItem('jwtToken', JSON.stringify(response.token));
              window.localStorage.setItem('role', data.name);
              console.log('User logged in successfully', response);
              window.localStorage.setItem('userLogged', response);
              this.authService.userLogged = response;
              this.router.navigate(['']);
            } else {
              this.toastr.error('Full authentication is required to access this resource', 'Failed', {
                timeOut: 2000,
              });
            }
          });
        },
        error => {
          if (error.status === 401) {
            this.toastr.error('Invalid password', 'Failed', {
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
          console.error('Error logging in user', error);
        }
      );
    } else {
      this.toastr.error('Please fill in the form correctly.');
    }
  }
}