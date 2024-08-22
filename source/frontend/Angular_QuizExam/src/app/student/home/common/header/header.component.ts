import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
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
    const nav = document.getElementById('nav-id');
    const body = document.getElementById('body');
    if (nav && body) {
      if (isDarkMode) {
        nav.setAttribute('data-bs-theme', 'dark');
        body.setAttribute('data-bs-theme', 'dark');
      } else {
        nav.setAttribute('data-bs-theme', 'light');
        body.setAttribute('data-bs-theme', 'light');
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
