import { Component, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Title } from '@angular/platform-browser';
import { AdminComponent } from '../../admin.component';
import { HomeComponent } from '../home.component';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { UrlService } from '../../../shared/service/url.service';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { Role, User } from '../../../shared/models/models';
declare var $: any;

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: [
    './../../../shared/styles/admin/style.css',
    './employee.component.css'
  ]
})

export class EmployeeComponent implements OnInit, OnDestroy {
  dataTable: any;
  employeeList: User[] = [];
  roleList: Role[] = [];

  statusId: number = 1;
  employeeId: number = 0;
  employeeForm: User = { gender: 1, role: { id: 4 } };
  
  isPopupCreate: boolean = false;
  isPopupDetail: boolean = false;
  isPopupDelete: boolean = false;

  isPopupResetPassword: boolean = false;
  isPopupBackupRestore: boolean = false;

  dialogTitle: string = '';
  dialogMessage: string = '';
  isConfirmationPopup: boolean = false;

  constructor(
    private authService: AuthService,
    private titleService: Title,
    public admin: AdminComponent,
    private home: HomeComponent,
    private el: ElementRef,
    private renderer: Renderer2,
    private http: HttpClient,
    private toastr: ToastrService,
    public urlService: UrlService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('List of Employees');
    this.authService.entityExporter = 'user';
    this.loadData();
  }

  getRoleListApi(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.authService.apiUrl}/user/employee`, this.home.httpOptions);
  }

  getEmployeeListApi(): Observable<User[]> {
    return this.http.get<User[]>(`${this.authService.apiUrl}/user/${this.statusId}`, this.home.httpOptions);
  }

  getEmployeeByIdApi(id: number): Observable<User> {
    return this.http.get<User>(`${this.authService.apiUrl}/user/find/${id}`, this.home.httpOptions);
  }

  createEmployeeApi(): Observable<User> {
    return this.http.post<User>(`${this.authService.apiUrl}/user`, this.employeeForm, this.home.httpOptions);
  }

  resetPasswordEmployeeApi(id: number): Observable<User> {
    return this.http.put<User>(`${this.authService.apiUrl}/user/reset-password/${id}`, {}, this.home.httpOptions);
  }

  removeEmployeeApi(id: number): Observable<User> {
    return this.http.put<User>(`${this.authService.apiUrl}/user/remove/${id}`, {}, this.home.httpOptions);
  }

  backupRestoreEmployeeApi(id: number): Observable<User> {
    return this.http.put<User>(`${this.authService.apiUrl}/user/restore/${id}`, {}, this.home.httpOptions);
  }

  loadData(): void {
    forkJoin([this.getRoleListApi(), this.getEmployeeListApi()])
      .subscribe(([roleResponse, employeeResponse]) => {
        this.roleList = roleResponse;
        this.employeeList = employeeResponse;

        this.authService.listExporter = employeeResponse;
        this.initializeDataTable();
    });
  }

  initializeDataTable(): void {
    this.dataTable = $('#example').DataTable({
      data: this.employeeList,
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
        { title: 'Full Name', data: 'fullName' },
        { title: 'Email', data: 'email' },
        { title: 'Phone Number', data: 'phoneNumber' },
        { title: 'Role', data: 'role.name' },
        {
          title: 'Action',
          data: null,
          render: (data: any, type: any, row: any) => {
            if (this.statusId == 1) {
              return `<span class="mdi mdi-information-outline icon-action info-icon" title="Info" data-id="${row.id}"></span>
              <span class="mdi mdi-lock-reset icon-action reset-password-icon" title="Reset Password" data-id="${row.id}"></span>
              <span class="mdi mdi-delete-forever icon-action delete-icon" title="Remove" data-id="${row.id}"></span>`;
            }
            return `<span class="mdi mdi-backup-restore icon-action backup-restore-icon" title="Backup Restore" data-id="${row.id}"></span>`;
          }
        }
      ],

      drawCallback: () => {
        this.addEventListeners();
        this.cssDataTable();
      }
    });
  }

  addEventListeners(): void {
    // Sửa input search thêm button vào
    if (!$('.dataTables_filter button').length) {
      $('.dataTables_filter').append(`<button type="button"><i class="fa-solid fa-magnifying-glass search-icon"></i></button>`);
    }

    // Thêm placeholder vào input của DataTables
    $('.dataTables_filter input[type="search"]').attr('placeholder', 'Search');

    $('.info-icon').on('click', (event: any) => {
      this.employeeId = $(event.currentTarget).data('id');
      this.openPopupDetail(this.employeeId);
    });

    $('.reset-password-icon').on('click', (event: any) => {
      this.employeeId = $(event.currentTarget).data('id');
      this.dialogTitle = 'Are you sure?';
      this.dialogMessage = 'Do you want to reset the password for this employee?';
      this.isConfirmationPopup = true;
      this.isPopupResetPassword = true;
    });

    $('.delete-icon').on('click', (event: any) => {
      this.employeeId = $(event.currentTarget).data('id');
      this.dialogTitle = 'Are you sure?';
      this.dialogMessage = 'Do you really want to delete this Employee?';
      this.isConfirmationPopup = true;
      this.isPopupDelete = true;
    });

    $('.backup-restore-icon').on('click', (event: any) => {
      this.employeeId = $(event.currentTarget).data('id');
      this.dialogTitle = 'Are you sure?';
      this.dialogMessage = "Do you really want to recover this employee's account?";
      this.isConfirmationPopup = true;
      this.isPopupBackupRestore = true;
    });
  }

  cssDataTable(): void {
    if (!$('#custom-select-status').length) {
      $('.dataTables_length').append(`
        <label for="" class="label-status">Status:</label>
        <select id="custom-select-status" class="select-status">
          <option value=1>Active</option>
          <option value=0>Inactive</option>
        </select>
      `);

      // Theo dõi sự thay đổi của dropdown
      $('#custom-select-status').on('change', () => {
        this.statusId = $('#custom-select-status').val();
        this.reloadTable();
      });
    }

    const dataTablesLength = this.el.nativeElement.querySelector('.dataTables_length');
    this.renderer.setStyle(dataTablesLength, 'display', 'inline-flex');
    
    const lengthElement = this.el.nativeElement.querySelector('.dataTables_length label');
    this.renderer.setStyle(lengthElement, 'width', '160px');

    const labelStatus = this.el.nativeElement.querySelector('.label-status');
    this.renderer.setStyle(labelStatus, 'margin', '0 5px 0 30px');
    this.renderer.setStyle(labelStatus, 'align-content', 'center');

    const selectStatus = this.el.nativeElement.querySelector('.select-status');
    this.renderer.setStyle(selectStatus, 'width', '120px');
    this.renderer.setStyle(selectStatus, 'cursor', 'pointer');
  }

  updateDataTable(newData: any): void {
    if (this.dataTable) {
      this.dataTable.clear(); // Xóa dữ liệu hiện tại
      this.dataTable.rows.add(newData); // Thêm dữ liệu mới
      this.dataTable.draw(); // Vẽ lại bảng
    }
  }

  reloadTable(): void {
    this.getEmployeeListApi().subscribe({
      next: (employeeResponse: User[]) => {
        this.employeeList = employeeResponse;
        this.updateDataTable(this.employeeList); // Cập nhật bảng với dữ liệu mới
        this.closePopup();
      },
      error: (err) => {
        this.toastr.error(err.error.message, 'Error', { timeOut: 4000 });
        setTimeout(() => { this.reloadTable(); }, 4000);
      }
    });
  }

  openPopupCreate(): void {
    this.isPopupCreate = true;
  }

  openPopupDetail(id: number): void {
    this.getEmployeeByIdApi(id).subscribe({
      next: (employeeResponse: User) => {
        this.employeeForm = employeeResponse;
        this.isPopupDetail = true;
      },
      error: (err) => {
        this.toastr.error(err.error.message, 'Error', { timeOut: 4000 });
        setTimeout(() => { this.reloadTable(); }, 4000);
      }
    });
  }

  closePopup(): void {
    this.employeeId = 0;
    this.employeeForm = { gender: 1, role: { id: 4 } };
    this.isPopupCreate = false;
    this.isPopupDetail = false;
    this.isPopupDelete = false;
    this.isPopupResetPassword = false;
    this.isPopupBackupRestore = false;
  }

  createEmployee(): void {
    this.createEmployeeApi().subscribe({
      next: () => {
        this.toastr.success('Create Successful!', 'Success', { timeOut: 2000 });
        this.reloadTable();
      },
      error: () => {
        this.toastr.error('Create Employee Fail!', 'Error', { timeOut: 2000 });
      }
    });
  }

  resetPasswordEmployee(): void {
    this.resetPasswordEmployeeApi(this.employeeId).subscribe({
      next: () => {
        this.toastr.success('Reset Successful!', 'Success', { timeOut: 2000 });
        this.reloadTable();
      },
      error: () => {
        this.toastr.error('Reset Fail!', 'Error', { timeOut: 2000 });
      }
    });
  }

  removeEmployee(): void {
    this.removeEmployeeApi(this.employeeId).subscribe({
      next: () => {
        this.toastr.success('Remove Successful!', 'Success', { timeOut: 2000 });
        this.reloadTable();
      },
      error: () => {
        this.toastr.error('Remove Employee Fail!', 'Error', { timeOut: 2000 });
      }
    });
  }

  backupRestoreEmployee(): void {
    this.backupRestoreEmployeeApi(this.employeeId).subscribe({
      next: () => {
        this.toastr.success('Backup Successful!', 'Success', { timeOut: 2000 });
        this.reloadTable();
      },
      error: () => {
        this.toastr.error('Backup Fail!', 'Error', { timeOut: 2000 });
      }
    });
  }

  exportExcel() {
    this.authService.listExporter = this.employeeList;
    this.authService.exportDataExcel().subscribe(
      (response) => {
        const url = window.URL.createObjectURL(new Blob([response], { type: 'blob' as 'json' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'employee_excel.xlsx'; // Thay đổi tên file nếu cần
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      (error) => {
        console.error('Export failed', error);
      }
    );
  }

  exportPDF() {
    this.authService.listExporter = this.employeeList;
    this.authService.exportDataPDF().subscribe(
      (response) => {
        const url = window.URL.createObjectURL(new Blob([response], { type: 'blob' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'employee_pdf.pdf'; // Thay đổi tên file nếu cần
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      (error) => {
        console.error('Export failed', error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }
}