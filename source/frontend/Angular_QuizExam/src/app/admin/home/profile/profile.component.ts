import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  showEditForm() {
    (document.getElementById('infor') as HTMLElement).style.display = 'none';
    (document.getElementById('form-infor') as HTMLElement).style.display = 'block';
    (document.getElementById('change-password-form') as HTMLElement).style.display = 'none';
  }

  showPasswordForm() {
    (document.getElementById('infor') as HTMLElement).style.display = 'none';
    (document.getElementById('form-infor') as HTMLElement).style.display = 'none';
    (document.getElementById('change-password-form') as HTMLElement).style.display = 'block';
  }

  showInformation() {
    (document.getElementById('infor') as HTMLElement).style.display = 'block';
    (document.getElementById('form-infor') as HTMLElement).style.display = 'none';
    (document.getElementById('change-password-form') as HTMLElement).style.display = 'none';
  }

  edit(){

  }

  chagePassword(){

  }
}
