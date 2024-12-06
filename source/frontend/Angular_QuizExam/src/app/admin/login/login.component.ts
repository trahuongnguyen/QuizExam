import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { AuthService } from '../../shared/service/auth.service';
import { Title } from '@angular/platform-browser';
import { HttpHeaders } from '@angular/common/http';
import { LoginRequest } from '../../shared/models/models';
import { UrlService } from '../../shared/service/url.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
  loginForm: LoginRequest = { };

  constructor(
    private authService: AuthService,
    private titleService: Title,
    public urlService: UrlService,
    private router: Router,
    private toastr: ToastrService,
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Login');

    if (this.isLocalStorageAvailable()) {
      const role = localStorage.getItem('role');
      if (role && role != 'STUDENT') {
        this.router.navigate(['/admin']);
      }
    }

    const carouselElement = this.el.nativeElement.querySelector('#carouselExampleSlidesOnly');
    this.renderer.addClass(carouselElement, 'carousel');
  }

  isLocalStorageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }

  onSubmit() {
    this.authService.login(this.loginForm).subscribe({
      next: (loginResponse) => {
        const headers = new HttpHeaders().set('Email', this.loginForm.email || '');
        this.authService.takeRole(headers).subscribe({
          next: (roleResponse) => {
            if (['ADMIN', 'DIRECTOR', 'TEACHER', 'SRO'].includes(roleResponse.name)) {
              localStorage.setItem('jwtToken', JSON.stringify(loginResponse.token));
              localStorage.setItem('role', roleResponse.name);
              this.toastr.success('Login Successful!', 'Success', { timeOut: 2000 });
              this.router.navigate(['/admin']);
            }
            else {
              this.toastr.error('Full authentication is required to access this resource', 'Failed', { timeOut: 3000 });
            }
          },
          error: (err) => {
            this.authService.handleError(err, undefined, '', 'load data');
          }
        });
      },
      error: (err) => {
        this.authService.handleError(err, undefined, '', 'load data');
      }
    });
  }
}