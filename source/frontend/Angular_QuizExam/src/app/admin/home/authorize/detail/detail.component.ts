import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { AuthorizeComponent } from '../authorize.component';
import { HomeComponent } from '../../home.component';
import { Title } from '@angular/platform-browser';
import { AdminComponent } from '../../../admin.component';
declare var $: any;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit{
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

  dataTable: any;
  apiData: any;
  roleId: number = 0;
  roleName: string = '';
  name: String = '';
  description: String = '';

  ngOnInit(): void {
    this.titleService.setTitle('Authorize Details');
    this.roleId = Number(this.activatedRoute.snapshot.params['roleId']) ?? 0;
    this.http.get<any>(`${this.authService.apiUrl}/role/permission/${this.roleId}`, this.home.httpOptions).subscribe((data: any) => {
      this.apiData = data;
      this.initializeDataTable();
    });
    this.http.get<any>(`${this.authService.apiUrl}/role/${this.roleId}`, this.home.httpOptions).subscribe((data: any) => {
      this.roleName = data.name;
      console.log(this.roleName);
    });
  }

  initializeDataTable(): void {
    this.dataTable = $('#example').DataTable({
      data: this.apiData,
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
