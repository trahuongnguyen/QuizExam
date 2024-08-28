import { Component } from '@angular/core';
import { profile } from 'node:console';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  visiblePassword(inputId: string, iconId: string): void {
    // Tìm phần tử đầu vào mật khẩu và icon bằng ID
    const passwordInput = document.getElementById(inputId) as HTMLInputElement | null;
    const toggleIcon = document.getElementById(iconId) as HTMLElement | null;

    if (passwordInput && toggleIcon) {
        // Kiểm tra và thay đổi thuộc tính 'type' giữa 'password' và 'text'
        const isPassword = passwordInput.getAttribute("type") === "password";
        passwordInput.setAttribute("type", isPassword ? "text" : "password");

        // Thay đổi icon dựa trên trạng thái của trường mật khẩu
        if (isPassword) {
          toggleIcon.classList.remove('fa-eye-slash');
          toggleIcon.classList.add('fa-eye');
        } else {       
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        }
    } else {
        console.error(`Element with id ${inputId} or ${iconId} not found.`);
    }

    
}

// Gọi hàm togglePasswordVisibility khi click vào icon


}

