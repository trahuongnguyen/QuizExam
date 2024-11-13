import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AdminComponent } from '../admin.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  title = 'Angular_QuizExam';
  thisRouter = '/admin/home'
  windowScrolled = false;

  userName: string = '';
  userRole: string = '';

  role: any;

  httpOptions: { headers: HttpHeaders; responseType: 'json'; withCredentials: true } = {
    headers: new HttpHeaders({'Accept': 'application/json'}),
    responseType: 'json',
    withCredentials: true
  };

  constructor(public authService: AuthService, public admin : AdminComponent, private http: HttpClient, private router: Router) {
    this.loadToken();
    this.role = localStorage.getItem(authService.roleKey);
  }

  ngOnInit() {
    this.http.get<any>(`${this.authService.apiUrl}/auth/profile`, this.httpOptions).subscribe((user: any) => {
      this.authService.myUser = user;
      console.log(user);
      this.userName = user.fullName;
      this.userRole = user.role.name;
    });
  }

  private loadToken() {
    if (this.authService.isLoggedIn()) {
      const token = localStorage.getItem('jwtToken');
      this.httpOptions = {
        headers: new HttpHeaders({ 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }),
        responseType: 'json',
        withCredentials: true
      };
    }
    else {
      this.router.navigate(['admin/login']);
    }
  }

  isActive(roles: Array<String>): boolean {
    return roles.includes(this.role);
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }

  scrolled() : void {
    this.windowScrolled = Math.round(window.scrollY) !=0;
  }

  onLogout() {
    this.authService.logoutAdmin();
  }
}