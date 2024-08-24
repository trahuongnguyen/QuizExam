import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  visiblePassword(value: string): void {
    const passwordInput = document.getElementById(value) as HTMLInputElement;
    if (passwordInput) {
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;
    }
  }
}
