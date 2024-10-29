import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { StudentComponent } from '../student.component';
import { AuthService } from '../service/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  title = 'Angular_QuizExam';
  thisRouter = '/student/home#'
  windowScrolled = false;
  scrollToTop(): void {
    window.scrollTo(0, 0);
  }
  scrolled(): void {
    this.windowScrolled = Math.round(window.scrollY) != 0;
  }

  userId: number = 0;
  fullName: string = '';

  ngOnInit() {
    this.http.get<any>(`${this.authService.apiUrl}/auth/profile`, this.httpOptions).subscribe((student: any) => {
      this.authService.myUser = student;
      this.userId = student.user.id;
      this.fullName = student.user.fullName;
    });
  }

  httpOptions: any;

  private loadToken() {
    if (this.authService.isLoggedIn()) {
      const token = localStorage.getItem('jwtToken');
      this.httpOptions = {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }),
        responeType: 'json',
        withCredentials: true
      };
    }
    else {
      this.router.navigate(['student/login']);
    }
  }

  role: any;

  constructor(public student: StudentComponent, private router: Router, public authService: AuthService, private http: HttpClient) {
    this.loadToken();
    this.role = localStorage.getItem(authService.roleKey);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.currentRoute = this.router.url;
      console.log(this.currentRoute)
    });
  }

  currentRoute: string = '';

  isActive(roles: Array<String>): boolean {
    return roles.includes(this.role);
  }

  // Logout process
  onLogout() {
    this.authService.logout(); // call method logout
  }
}
