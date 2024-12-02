import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../shared/service/auth.service';
import { Title } from '@angular/platform-browser';
import { AdminComponent } from '../../admin.component';
import { ClassService } from '../../service/class/class.service';
import { ClassResponse, ClassRequest, ClassValidationError } from '../../../shared/models/class.model';
import { UrlService } from '../../../shared/service/url.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: [
    './../../../shared/styles/admin/style.css',
    './class.component.css'
  ]
})
export class ClassComponent implements OnInit, OnDestroy {
  dataTable: any;
  classList: ClassResponse[] = [];

  classId: number = 0;
  _class: ClassResponse;
  classForm: ClassRequest = { };
  classError: ClassValidationError = { };

  isPopupCreate: boolean = false;
  isPopupUpdate: boolean = false;
  isPopupDelete: boolean = false;

  dialogTitle: string = '';
  dialogMessage: string = '';
  isConfirmationPopup: boolean = false;

  constructor(
    private authService: AuthService,
    private titleService: Title,
    public admin: AdminComponent,
    private classService: ClassService,
    public urlService: UrlService,
    private router: Router,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) {
    this._class = {
      id: 0,
      name: '',
      classDay: '',
      classTime: '',
      admissionDate: new Date(),
      status: 0
    };

    this.initializeClassForm();
    this.initializeClassError();
  }

  initializeClassForm() {
    this.classForm = {
      classDay: '2, 4, 6',
      classTime: '08h00 - 10h00'
    };
  }

  initializeClassError() {
    this.classError = {
      name: '',
      classDay: '',
      classTime: '',
      admissionDate: ''
    };
  }

  ngOnInit(): void {
    this.titleService.setTitle('List of Classes');
    this.authService.entityExporter = 'class';
    this.loadData();
  }

  loadData(): void {
    this.classService.getClassList().subscribe({
      next: (classResponse) => {
        this.classList = classResponse;
        this.authService.listExporter = classResponse;
        this.initializeDataTable();
      },
      error: (err) => {
        console.log('Error:', err.error.message);
      }
    });
  }

  initializeDataTable(): void {
    this.dataTable = $('#example').DataTable({
      data: this.classList,
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
        { title: 'Day', data: 'classDay' },
        { title: 'Hour', data: 'classTime' },
        {
          title: 'Admission Date', 
          data: 'admissionDate',
          render: (data: any) => { return this.convertDateFormat(data); }
        },
        {
          title: 'Action',
          data: null,
          render: function (data: any, type: any, row: any) {
            return `<span class="mdi mdi-information-outline icon-action info-icon" title="Info" data-id="${row.id}"></span>
            <span class="mdi mdi-pencil icon-action edit-icon" title="Edit" data-id="${row.id}"></span>
            <span class="mdi mdi-delete-forever icon-action delete-icon" title="Delete" data-id="${row.id}"></span>`;
          }
        }

      ],

      drawCallback: () => {
        this.addEventListeners();
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

    // Click vào edit icon sẽ hiện ra popup
    $('.info-icon').on('click', (event: any) => {
      this.classId = $(event.currentTarget).data('id');
      this.router.navigate([this.urlService.classDetailUrl(this.classId)])
    });

    $('.edit-icon').on('click', (event: any) => {
      this.classId = $(event.currentTarget).data('id');
      this.openPopupUpdate(this.classId);
    });

    $('.delete-icon').on('click', (event: any) => {
      this.classId = $(event.currentTarget).data('id');
      this.openPopupConfirm('Are you sure?', 'Do you really want to delete this Class?<br>The students in this class will also be deleted, and this action cannot be undone.');
      this.isPopupDelete = true;
    });
  }

  updateDataTable(newData: any): void {
    if (this.dataTable) {
      this.dataTable.clear(); // Xóa dữ liệu hiện tại
      this.dataTable.rows.add(newData); // Thêm dữ liệu mới
      this.dataTable.draw(); // Vẽ lại bảng
    }
  }

  reloadTable(): void {
    this.classService.getClassList().subscribe({
      next: (classResponse) => {
        this.classList = classResponse;
        this.updateDataTable(this.classList);
        this.closePopup();
      },
      error: (err) => {
        console.log('Error:', err.error.message);
      }
    });
  }

  loadClassById(id: number, callback: (_class: ClassResponse) => void): void {
    this.classService.getClassById(id).subscribe({
      next: (classResponse) => {
        this._class = classResponse;
        callback(this._class); // Chạy hàm callback sau khi lấy thông tin thành công
      },
      error: (err) => {
        this.toastr.error(err.error.message, 'Error', { timeOut: 4000 });
        setTimeout(() => { this.reloadTable(); }, 4000);
      }
    });
  }

  convertDateFormat(dateObj: Date | undefined): string {
    // Dùng DatePipe để chuyển đổi đối tượng Date sang định dạng 'yyyy-MM-dd'
    return this.datePipe.transform(dateObj, 'dd-MM-yyyy')!;
  }

  convertToRequest(): void {
    this.classForm.name = this._class.name;
    this.classForm.classDay = this._class.classDay;
    this.classForm.classTime = this._class.classTime;
    this.classForm.admissionDate = this._class.admissionDate;
  }

  openPopupConfirm(title: string, message: string): void {
    this.dialogTitle = title;
    this.dialogMessage = message;
    this.isConfirmationPopup = true;
  }

  openPopupCreate(): void {
    this.isPopupCreate = true;
  }
  
  openPopupUpdate(id: number): void {
    this.loadClassById(id, () => {
      this.convertToRequest();
      this.isPopupUpdate = true;
    });
  }

  closePopup(): void {
    this.classId = 0;
    this.initializeClassForm();
    this.initializeClassError();
    this.isPopupCreate = false;
    this.isPopupUpdate = false;
    this.isPopupDelete = false;
  }

  errorForm(err: any, message: string): void {
    if (err.status === 401) {
      this.toastr.error('Unauthorized', 'Failed', { timeOut: 2000 });
    }
    else {
      if (err.error.message) {
        this.classError[err.error.key as keyof ClassValidationError] = err.error.message;
      }
      else {
        err.error.forEach((e: any) => {
          this.classError[e.key as keyof ClassValidationError] = e.message;
        });
      }
      this.toastr.error(message + ' class fail!', 'Error', { timeOut: 2000 });
    }
  }

  createClass(): void {
    this.initializeClassError();
    this.classService.createClass(this.classForm).subscribe({
      next: () => {
        this.toastr.success('Create class successful!', 'Success', { timeOut: 2000 });
        this.reloadTable();
      },
      error: (err) => {
        this.errorForm(err, 'Create');
      }
    });
  }

  updateClass(): void {
    this.initializeClassError();
    this.classService.updateClass(this.classId, this.classForm).subscribe({
      next: () => {
        this.toastr.success('Update class successful!', 'Success', { timeOut: 2000 });
        this.reloadTable();
      },
      error: (err) => {
        this.errorForm(err, 'Update');
      }
    });
  }

  deleteClass(): void {
    this.classService.deleteClass(this.classId).subscribe({
      next: () => {
        this.toastr.success('Delete class successful!', 'Success', { timeOut: 2000 });
        this.reloadTable();
      },
      error: () => {
        this.toastr.error('Delete class fail!', 'Error', { timeOut: 2000 });
      }
    });
  }

  exportExcel() {
    this.authService.listExporter = this.classList;
    this.exportData(this.authService.exportDataExcel(), 'class_excel.xlsx');
  }

  exportPDF() {
    this.authService.listExporter = this.classList;
    this.exportData(this.authService.exportDataPDF(), 'class_pdf.pdf');
  }

  exportData(exportFunction: any, fileName: string): void {
    exportFunction.subscribe({
      next: (response: any) => {
        const url = window.URL.createObjectURL(new Blob([response], { type: 'application/octet-stream' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (err: any) => {
        console.error('Export failed:', err);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }
}