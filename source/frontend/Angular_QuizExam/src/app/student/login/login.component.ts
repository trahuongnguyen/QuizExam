import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, public toastr: ToastrService, private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }  //Login
  
  login() {
    if (this.loginForm.valid) {
      const user = { password: this.loginForm.get('password')?.value, email: this.loginForm.get('email')?.value };
      this.authService.login(user).subscribe(
        response => {
          this.toastr.success('Login Successful!', 'Success', {
            timeOut: 2000,
          });
          window.localStorage.setItem('jwtToken', JSON.stringify(response.token));
          console.log('User logged in successfully', response);
          this.router.navigate(['/student/home']);
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