import { AuthorizeComponent } from './../authorize.component';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HomeComponent } from '../../home.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AdminComponent } from '../../../admin.component';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit{
  constructor(
    private authService: AuthService,
    private titleService: Title,
    public admin : AdminComponent,
    private home: HomeComponent,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public authorizeComponent: AuthorizeComponent
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
    this.router.navigate([`/admin/home/authorize/detail/${id}`])
  }

}
