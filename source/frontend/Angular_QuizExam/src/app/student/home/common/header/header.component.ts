import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { StudentComponent } from '../../../student.component';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  darkMode: boolean = false;

  constructor(public student: StudentComponent, public authService: AuthService, public home: HomeComponent) {}

  // Logout process
  onLogout() {
    this.authService.logout(); // call method logout
  }
}
