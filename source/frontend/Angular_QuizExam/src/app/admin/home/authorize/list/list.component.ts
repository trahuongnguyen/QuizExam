import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AdminComponent } from '../../../admin.component';
import { Role } from '../../../../shared/models/role.model';
import { RoleService } from '../../../service/role/role.service';
import { UrlService } from '../../../../shared/service/url.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: [
    './../../../../shared/styles/admin/style.css',
    './list.component.css'
  ]
})
export class ListComponent implements OnInit{
  roleList: Role[] = [];

  constructor(
    private titleService: Title,
    public admin: AdminComponent,
    private roleService: RoleService,
    public urlService: UrlService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Authorize');
    this.loadData();
  }

  loadData(): void {
    this.roleService.getRoleList().subscribe({
      next: (roleResponse) => {
        this.roleList = roleResponse;
      },
      error: (err) => {
        console.log('Error:', err.error.message);
      }
    });
  }

  getPermission(id: any) {
    this.router.navigate([this.urlService.authorizeDetailUrl(id)])
  }
}