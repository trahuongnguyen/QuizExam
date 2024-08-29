import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  title = 'Angular_QuizExam';
  thisRouter = '/admin/home#'
  windowScrolled = false;
  scrollToTop(): void {
    window.scrollTo(0, 0);
  }
  scrolled() : void {
    this.windowScrolled = Math.round(window.scrollY) !=0;
  }

  darkMode: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.loadTheme();
  }

  // Kiểm tra xem localStorage có sẵn không trước khi sử dụng
  private isLocalStorageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }

  saveTheme(isDarkMode: boolean): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      this.updateBodyClass(isDarkMode);
    }
  }

  // Tải trạng thái chế độ từ localStorage
  loadTheme(): void {
    if (this.isLocalStorageAvailable()) {
      const theme = localStorage.getItem('theme');
      this.darkMode = theme === 'dark';
      this.updateBodyClass(this.darkMode);
    }
  }

  // Cập nhật lớp CSS
  updateBodyClass(isDarkMode: boolean): void {
    const body = document.getElementById('body');
    if (body) {
      if (isDarkMode) {
        body.setAttribute('QuizTech-theme', 'dark');
      } else {
        body.setAttribute('QuizTech-theme', 'light');
      }
    }
  }

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    this.saveTheme(this.darkMode);
  }

  menuToggle(): void {
    const toggleMenu = document.querySelector(".menu");
    toggleMenu?.classList.toggle("active");
  }
}
