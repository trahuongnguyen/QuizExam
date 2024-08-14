import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  password: string = '';
  email: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login({password: this.password, email: this.email}).subscribe(
      response  => {
        console.log('User logged in successfully', response );
        localStorage.setItem('token', response.token);
      },
      error => {
        console.error('Error logging in user', error);
      }
    );
  }
}
