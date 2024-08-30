import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { AppComponent } from '../../../../app.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  darkMode: boolean = false;

  constructor(public app: AppComponent, public authService: AuthService) {}

  // Logout process
  onLogout() {
    this.authService.logout(); // call method logout
  }
}
