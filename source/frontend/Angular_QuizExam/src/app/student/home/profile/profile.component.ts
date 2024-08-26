import { Component } from '@angular/core';
import { profile } from 'node:console';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  // Hàm để ẩn/hiện mật khẩu
  visiblePassword(inputId: string): void {
    // Tìm phần tử đầu vào mật khẩu bằng ID
    const passwordInput = document.getElementById(inputId) as HTMLInputElement;

    if (passwordInput) {
      // Kiểm tra và thay đổi thuộc tính 'type' giữa 'password' và 'text'
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
    } else {
      console.error(`Element with id ${inputId} not found.`);
    }
  }
}

