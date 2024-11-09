import { AuthorizeComponent } from './../authorize.component';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HomeComponent } from '../../home.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit{
  constructor(private authService: AuthService, public home: HomeComponent, private http: HttpClient, public toastr: ToastrService, private router: Router, public authorizeComponent: AuthorizeComponent) { }

  roleList: any;

  roleId: any;
  name: String = '';
  description: String = '';

  ngOnInit(): void {
    this.http.get<any>(`${this.authService.apiUrl}/role`, this.home.httpOptions).subscribe((data: any) => {
      this.roleList = data;
    });
  }

  getExamDetail(id: any) {
    this.authorizeComponent.step = false;
    this.router.navigate([`/admin/home/authorize/detail/${id}`])
  }

}
