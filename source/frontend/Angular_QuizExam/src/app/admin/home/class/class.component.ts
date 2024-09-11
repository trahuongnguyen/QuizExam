import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HomeComponent } from '../home.component';
declare var $: any;

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrl: './class.component.css'
})
export class ClassComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService, private http: HttpClient, public toastr: ToastrService, private router: Router, public home: HomeComponent) { }

  dataTable: any;
  apiData: any;
  infoEdit: any = null;
  isPopupEdit = false;
  isPopupCreate = false;
  classId: any;

  ngOnInit(): void {
    this.http.get<any>(`${this.authService.apiUrl}/class`, this.home.httpOptions).subscribe((data: any) => {
      this.apiData = data;
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
            return `<span class="mdi mdi-information-outline icon-action info-icon" data-id="${row.id}"></span>
            <span class="mdi mdi-pencil icon-action edit-icon" data-id="${row.id}"></span>
            <span class="mdi mdi-delete-forever icon-action delete-icon" data-id="${row.id}"></span>`;
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
          this.deleteClass(this.classId);
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
  }


  name: String = '';
  classDay: String = '';
  classTime: String = '';
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
        this.router.navigate(['/admin/home/class']);
      },
      error => {
        this.toastr.error(error.error.message, 'Error', {
          timeOut: 2000,
        });
        error.error.forEach((err: any) => {
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
        this.router.navigate(['/admin/home/class']);
      },
      error => {
        this.toastr.error(error.error.message, 'Error', {
          timeOut: 2000,
        });
        console.log(error);
        error.error.forEach((err: any) => {
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

  deleteClass(id: number): void {
    if (!window.confirm('Are you sure you want to delete this class?')) {
      return;
    }
    this.http.delete(`${this.authService.apiUrl}/class/${id}`, this.home.httpOptions).subscribe(
      () => {
        console.log(`Class with ID ${id} deleted successfully`);
        this.router.navigate(['/admin/home/class']);
      },
      error => {
        console.error('Error deleting item:', error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }
}
