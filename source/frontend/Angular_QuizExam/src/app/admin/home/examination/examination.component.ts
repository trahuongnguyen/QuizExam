import { Component } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../service/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { HomeComponent } from '../home.component';

@Component({
  selector: 'app-examination',
  templateUrl: './examination.component.html',
})
export class ExaminationComponent {
  title = 'Angular_QuizExam';
  thisRouter = '/admin/home'
  windowScrolled = false;
  scrollToTop(): void {
    window.scrollTo(0, 0);
  }
  scrolled() : void {
    this.windowScrolled = Math.round(window.scrollY) !=0;
  }

  httpOptions: any;

  step: boolean = false;

  loadToken() {
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

  constructor(public app : AppComponent, private router: Router,  public authService: AuthService, public home: HomeComponent) {
    this.loadToken();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.currentRoute = this.router.url;
      console.log(this.currentRoute)
    });
  }

  currentRoute: string = '';

  isActive(route: string): boolean {
    return this.currentRoute ===  this.thisRouter + route;
  }

   // Logout process
   onLogout() {
    this.authService.logoutAdmin(); // call method logout
  }
}