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
    const user = {password: this.password, email: this.email}
    this.authService.login(user).subscribe(
      response  => {
        console.log('User logged in successfully', response );
        this.router.navigate(['/header']);
      },
      error => {
        console.error('Error logging in user', error);
      }
    );
  }
}
