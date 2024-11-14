import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Title } from '@angular/platform-browser';
import { AdminComponent } from '../../admin.component';
import { HomeComponent } from '../home.component';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { UrlService } from '../../../shared/service/url.service';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrl: './class.component.css'
})
export class ClassComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private titleService: Title,
    public admin : AdminComponent,
    private home: HomeComponent,
    private http: HttpClient,
    private toastr: ToastrService,
    public urlService: UrlService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  dataTable: any;
  apiData: any;
  infoEdit: any = null;
  isPopupEdit = false;
  isPopupCreate = false;

  classId: any;
  ngOnInit(): void {
    this.titleService.setTitle('List of Classes');
    this.authService.entityExporter = 'class';
    this.http.get<any>(`${this.authService.apiUrl}/class`, this.home.httpOptions).subscribe((data: any) => {
      this.apiData = data;
      this.authService.listExporter = data;
      this.initializeDataTable();
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
        { title: 'Day', data: 'classDay' },
        { title: 'Hour', data: 'classTime' },
        { title: 'Admission Date', data: 'admissionDate' },
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
        // Sửa input search thêm button vào
        if (!$('.dataTables_filter button').length) {
          $('.dataTables_filter').append(`<button type="button"><i class="fa-solid fa-magnifying-glass search-icon"></i></button>`);
        }

        // Thêm placeholder vào input của DataTables
        $('.dataTables_filter input[type="search"]').attr('placeholder', 'Search');

        // Click vào edit icon sẽ hiện ra popup
        $('.info-icon').on('click', (event: any) => {
          const id = $(event.currentTarget).data('id');
          this.classId = id;
          this.router.navigate([this.urlService.classDetailUrl(id)])
        });

        $('.edit-icon').on('click', (event: any) => {
          const id = $(event.currentTarget).data('id');
          this.classId = id;
          this.showPopupEdit(id);
        });

        $('.create').on('click', () => {
          this.isPopupCreate = true;
        });

        $('.delete-icon').on('click', (event: any) => {
          const id = $(event.currentTarget).data('id');
          this.classId = id;
          this.isPopupConfirm = true;
        });
      }
    });
  }

  showPopupEdit(id: number): void {
    this.infoEdit = this.apiData.find((item: any) => item.id === id);
    this.isPopupEdit = true;
  }

  closePopup(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation(); // Ngăn việc sự kiện click ra ngoài ảnh hưởng đến việc đóng modal
    }
    this.isPopupEdit = false;
    this.isPopupCreate = false;
    this.isPopupConfirm = false;
  }


  name: String = '';
  classDay: String = '2, 4, 6';
  classTime: String = '8h00 - 10h00';
  admissionDate: String = '';

  nameError: String = '';
  classDayError: String = '';
  classTimeError: String = '';
  admissionDateError: String = '';
  
  errorEmpty(): void {
    this.nameError = '';
    this.classDayError = '';
    this.classTimeError = '';
    this.admissionDateError = '';
  }

  updateDataTable(newData: any[]): void {
    if (this.dataTable) {
      this.dataTable.clear(); // Xóa dữ liệu hiện tại
      this.dataTable.rows.add(newData); // Thêm dữ liệu mới
      this.dataTable.draw(); // Vẽ lại bảng
    }
  }

  reloadTable(): void {
    this.http.get<any>(`${this.authService.apiUrl}/class`, this.home.httpOptions).subscribe((data: any) => {
      this.apiData = data;
      this.updateDataTable(this.apiData); // Cập nhật bảng với dữ liệu mới
    });
    this.closePopup();
  }

  createClass(): void {
    this.errorEmpty();
    const _class =
    {
      name: this.name, classDay: this.classDay, classTime: this.classTime, admissionDate: this.admissionDate
    }

    this.http.post(`${this.authService.apiUrl}/class`, _class, this.home.httpOptions).subscribe(
      response => {
        this.toastr.success('Create Successful!', 'Success', {
          timeOut: 2000,
        });
        this.reloadTable();
      },
      error => {
        this.toastr.error(error.error.message, 'Error', {
          timeOut: 2000,
        });
        error.error.forEach((err:any) => {
          if (err.key == 'name') {
            this.nameError = err.message;
          }
          if (err.key == 'classDay') {
            this.classDayError = err.message;
          }
          if (err.key == 'classTime') {
            this.classTimeError = err.message;
          }
          if (err.key == 'admissionDate') {
            this.admissionDateError = err.message;
          }
        });
      }
    )
  }

  updateClass(): void {
    this.errorEmpty();
    const _class =
    {
      name: this.infoEdit.name, classDay: this.infoEdit.classDay, classTime: this.infoEdit.classTime, admissionDate: this.infoEdit.admissionDate
    }

    this.http.put(`${this.authService.apiUrl}/class/${this.classId}`, _class, this.home.httpOptions).subscribe(
      response => {
        this.toastr.success('Update Successful!', 'Success', {
          timeOut: 2000,
        });
        this.reloadTable();
      },
      error => {
        this.toastr.error(error.error.message, 'Error', {
          timeOut: 2000,
        });
        console.log(error);
        error.error.forEach((err:any) => {
          if (err.key == 'name') {
            this.nameError = err.message;
          }
          if (err.key == 'classDay') {
            this.classDayError = err.message;
          }
          if (err.key == 'classTime') {
            this.classTimeError = err.message;
          }
          if (err.key == 'admissionDate') {
            this.admissionDateError = err.message;
          }
        });
      }
    )
  }

  isPopupConfirm: boolean = false;

  deleteClass(id: number): void {
    this.isPopupConfirm = false;
    this.http.delete(`${this.authService.apiUrl}/class/${id}`, this.home.httpOptions).subscribe(
      () => {
        console.log(`Class with ID ${id} deleted successfully`);
        this.reloadTable();
      },
      error => {
        console.error('Error deleting item:', error);
      }
    );
  }

  exportExcel() {
    this.authService.listExporter = this.apiData;
    this.authService.exportDataExcel().subscribe(
      (response) => {
        const url = window.URL.createObjectURL(new Blob([response], { type: 'blob' as 'json' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'class_excel.xlsx'; // Thay đổi tên file nếu cần
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
    this.authService.listExporter = this.apiData;
    this.authService.exportDataPDF().subscribe(
      (response) => {
        const url = window.URL.createObjectURL(new Blob([response], { type: 'blob' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'class_pdf.pdf'; // Thay đổi tên file nếu cần
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
