import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AdminComponent } from '../../../admin.component';
import { Role, Permission } from '../../../../shared/models/role.model';
import { RoleService } from '../../../service/role/role.service';
import { UrlService } from '../../../../shared/service/url.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: [
    './../../../../shared/styles/admin/style.css',
    './detail.component.css'
  ]
})
export class DetailComponent implements OnInit {
  dataTable: any;
  role: Role;
  roleId: number = 0;
  permissionList: Permission[] = [];

  constructor(
    private titleService: Title,
    public admin : AdminComponent,
    private roleService: RoleService,
    public urlService: UrlService,
    private activatedRoute: ActivatedRoute
  ) {
    this.role = {
      id: 0,
      name: '',
      description: ''
    };
  }

  ngOnInit(): void {
    this.titleService.setTitle('Authorize Details');
    this.roleId = Number(this.activatedRoute.snapshot.params['roleId']) ?? 0;
    this.loadData();
  }

  loadData(): void {
    forkJoin([this.roleService.getRoleById(this.roleId), this.roleService.getPermissionList(this.roleId)])
      .subscribe(([roleResponse, permissionResponse]) => {
        this.role = roleResponse;
        this.permissionList = permissionResponse;
        this.initializeDataTable();
    });
  }

  initializeDataTable(): void {
    this.dataTable = $('#example').DataTable({
      data: this.permissionList,
      autoWidth: false, // Bỏ width của table
      pageLength: 10, // Đặt số lượng mục hiển thị mặc định là 10
      lengthMenu: [10, 15, 20, 25], // Tùy chọn trong dropdown: 10, 15, 20, 25
      language: {
        search: '' // Xóa chữ "Search:"
      },
      info: false, // Xóa dòng chữ Showing 1 to 10 of 22 entries
      columns: [
        {
          title: 'STT',
          data: null, // Không cần dữ liệu từ nguồn API
          render: (data: any, type: any, row: any, meta: any) => {
            return meta.row + 1; // Trả về số thứ tự, `meta.row` là chỉ số của hàng bắt đầu từ 0
          }
        },
        { title: 'Name', data: 'name' },
        { title: 'Description', data: 'description' }
      ],

      drawCallback: () => {
        // Sửa input search thêm button vào
        if (!$('.dataTables_filter button').length) {
          $('.dataTables_filter').append(`<button type="button"><i class="fa-solid fa-magnifying-glass search-icon"></i></button>`);
        }
        
        // Thêm placeholder vào input của DataTables
        $('.dataTables_filter input[type="search"]').attr('placeholder', 'Search');
      }
    });
  }
}