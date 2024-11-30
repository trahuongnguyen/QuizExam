import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { AuthService } from '../../shared/service/auth.service';
import { Title } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { UrlService } from '../../shared/service/url.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginRequest } from '../../shared/models/models';

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
    private el: ElementRef,
    private renderer: Renderer2,
    private http: HttpClient,
    private toastr: ToastrService,
    public urlService: UrlService,
    private router: Router,
    private activatedRoute: ActivatedRoute
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
    if (this.loginForm.email?.trim() && this.loginForm.password?.trim()) {
      this.authService.login(this.loginForm).subscribe({
        next: (loginResponse) => {
          const headers = new HttpHeaders().set('Email', this.loginForm.email || '');
          this.authService.takeRole({ headers: headers, responseType: 'json' }).subscribe({
            next: (roleResponse: any) => {
              if (['ADMIN', 'DIRECTOR', 'TEACHER', 'SRO'].includes(roleResponse.name)) {
                localStorage.setItem('jwtToken', JSON.stringify(loginResponse.token));
                localStorage.setItem('role', roleResponse.name);
                this.toastr.success('Login Successful!', 'Success', { timeOut: 2000 });
                this.router.navigate(['/admin']);
              }
              else {
                this.toastr.error('Full authentication is required to access this resource', 'Failed', { timeOut: 2000 });
              }
            }
          });
        },
        error: (err: any) => {
          if (err.status === 401) {
            this.toastr.error('Invalid password', 'Failed', { timeOut: 2000 });
          }
          else {
            let msg = '';
            if (err.error.message) {
              msg = err.error.message;
            }
            else {
              err.error.forEach((err: any) => {
                msg += ' ' + err.message;
              })
            }
            this.toastr.error(msg, 'Failed', { timeOut: 2000 });
          }
        }
      });
    }
    else {
      this.toastr.error('Please fill in the form correctly.');
    }
  }
}