import { Component } from '@angular/core';
import { AppComponent } from '../../app.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  title = 'Angular_QuizExam';
  thisRouter = '/admin/home'
  windowScrolled = false;
  scrollToTop(): void {
    window.scrollTo(0, 0);
  }
  scrolled() : void {
    this.windowScrolled = Math.round(window.scrollY) !=0;
  }

  constructor(public app : AppComponent, private router: Router) {
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
}