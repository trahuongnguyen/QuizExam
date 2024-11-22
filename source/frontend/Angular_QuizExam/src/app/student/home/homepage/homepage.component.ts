import { Component} from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: [
    './../../../shared/styles/student/style.css',
    './homepage.component.css'
  ]
})
export class HomepageComponent {
  constructor(
    private authService: AuthService,
    private titleService: Title,
  ) {
    this.titleService.setTitle('Home');
  }
}