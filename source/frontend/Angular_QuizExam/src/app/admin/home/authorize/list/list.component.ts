import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Title } from '@angular/platform-browser';
import { AdminComponent } from '../../../admin.component';
import { HomeComponent } from '../../home.component';
import { AuthorizeComponent } from './../authorize.component';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { UrlService } from '../../../../shared/service/url.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: [
    './../../../../shared/styles/admin/style.css',
    './list.component.css'
  ]
})
export class ListComponent implements OnInit{
  constructor(
    private authService: AuthService,
    private titleService: Title,
    public admin : AdminComponent,
    private home: HomeComponent,
    private authorizeComponent: AuthorizeComponent,
    private http: HttpClient,
    private toastr: ToastrService,
    public urlService: UrlService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  roleList: any;

  roleId: any;
  name: String = '';
  description: String = '';

  ngOnInit(): void {
    this.titleService.setTitle('Authorize');
    this.http.get<any>(`${this.authService.apiUrl}/role`, this.home.httpOptions).subscribe((data: any) => {
      this.roleList = data;
    });
  }

  getExamDetail(id: any) {
    this.authorizeComponent.step = false;
    this.router.navigate([this.urlService.authorizeDetailUrl(id)])
  }

}
