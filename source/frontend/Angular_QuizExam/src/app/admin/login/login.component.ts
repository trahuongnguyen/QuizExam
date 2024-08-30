import { Component, Injectable, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router, public toastr: ToastrService, private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
  //Login
  // password: string = '';
  // email: string = '';

  ngOnInit(): void { }


  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      this.authService.login({ email: this.loginForm.get('email')?.value, password: this.loginForm.get('password')?.value }).subscribe(
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
    } else {
      this.toastr.error('Please fill in the form correctly.');
    }
    // if (!this.email) {
    //   this.toastr.error('Email is required', 'Failed', {
    //     timeOut: 2000,
    //   });
    //   return;
    // }

    // if (!this.password) {
    //   this.toastr.error('Password is required', 'Failed', {
    //     timeOut: 2000,
    //   });
    //   return;
    // }
    // const user = { password: this.password, email: this.email };
    // this.authService.login(user).subscribe(
    //   response => {
    //     this.toastr.success('Login Successful!', 'Success', {
    //       timeOut: 2000,
    //     });
    //     window.localStorage.setItem('jwtToken', JSON.stringify(response.token));
    //     console.log('User logged in successfully', response);
    //     this.router.navigate(['/admin/home/employee']);
    //   },

    // );
  }
}

