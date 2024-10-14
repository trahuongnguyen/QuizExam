import { Component, OnInit } from '@angular/core';

@Component({

  selector: 'app-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
  title = 'Angular_QuizExam';

  darkMode: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.loadTheme();
  }

  // Kiểm tra xem localStorage có sẵn không trước khi sử dụng
  private isLocalStorageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }

  saveTheme(isDarkMode: boolean): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('theme-admin', isDarkMode ? 'dark-admin' : 'light-admin');
      this.updateBodyClass(isDarkMode);
    }
  }

  // Tải trạng thái chế độ từ localStorage
  loadTheme(): void {
    if (this.isLocalStorageAvailable()) {
      const theme = localStorage.getItem('theme-admin');
      this.darkMode = theme === 'dark-admin';
      this.updateBodyClass(this.darkMode);
    }
  }

  // Cập nhật lớp CSS
  updateBodyClass(isDarkMode: boolean): void {
    const body = document.getElementById('body');
    if (body) {
      if (isDarkMode) {
        body.setAttribute('QuizTech-theme', 'dark-admin');
      } else {
        body.setAttribute('QuizTech-theme', 'light-admin');
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