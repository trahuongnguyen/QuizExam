import { Component } from '@angular/core';
import { HomeComponent } from '../home.component';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(public home : HomeComponent, private router: Router,  public authService: AuthService, private http: HttpClient) { }
}
