import { Component } from '@angular/core';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  title = 'Angular_QuizExam';
  thisRouter = '/admin/home#'
  windowScrolled = false;
  scrollToTop(): void {
    window.scrollTo(0, 0);
  }
  scrolled() : void {
    this.windowScrolled = Math.round(window.scrollY) !=0;
  }

  constructor(public app : AppComponent) {}
}