import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  title = 'Angular_QuizExam';
  thisRouter = '/admin/home'
  windowScrolled = false;
  isSidebarCollapsed = false;

  userName: string = '';
  userRole: string = ''; 

  ngOnInit() {
    const user = this.authService.userLogged;
    this.userName = user.fullName;
    this.userRole = user.role;
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }
  scrolled() : void {
    this.windowScrolled = Math.round(window.scrollY) !=0;
  }

  httpOptions: any;
  role: any;

  private loadToken() {
    if (this.authService.isLoggedIn()) {
      const token = localStorage.getItem('jwtToken');
      this.httpOptions = {
        headers: new HttpHeaders({ 
          'Content-Type': 'application/json' ,
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }),
        responeType: 'json',
        withCredentials: true
      };
    }
    else {
      this.router.navigate(['admin/login']);
    }
  }

  constructor(public app : AppComponent, private router: Router,  public authService: AuthService) {
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
    this.authService.logoutAdmin(); // call method logout
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}