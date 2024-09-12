import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HomeComponent } from '../home.component';
declare var $: any;

@Component({
  selector: 'app-class',
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService, private home: HomeComponent, private http: HttpClient, public toastr: ToastrService, private router: Router) { }

  dataTable: any;
  apiData: any;
  stdDetail: any = null;
  isPopupUpdate = false;
  isPopupCreate = false;
  isPopupMove = false;

  studentId: any;
  ngOnInit(): void {
    this.http.get<any>(`${this.authService.apiUrl}/user`, this.home.httpOptions).subscribe((data: any) => {
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
        { title: 'Roll Number', data: 'rollNumber' },
        { title: 'Roll Portal', data: 'rollPortal' },
        { title: 'Full Name', data: 'fullName' },
        { title: 'Phone Number', data: 'phoneNumber' },
        {
          title: 'Action',
          data: null,
          render: function (data: any, type: any, row: any) {
            return `<span class="mdi mdi-information-outline icon-action info-icon" data-id="${row.id}"></span>
            <span class="mdi mdi-delete-forever icon-action delete-icon"></span>`;
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

        // Click vào info icon sẽ hiện ra popup
        $('.info-icon').on('click', (event: any) => {
          const id = $(event.currentTarget).data('id');
          this.studentId = id;
          this.showPopupEdit(id);
        });

        $('.create').on('click', () => {
          this.isPopupCreate = true;
        });

        $('.move').on('click', () => {
          this.isPopupMove = true;
        });
      }
    });
  }

  showPopupEdit(id: number): void {
    this.stdDetail = this.apiData.find((item: any) => item.id === id);
    this.user.fullName = this.stdDetail.fullName
    this.user.email = this.stdDetail.email
    this.user.dob = this.stdDetail.dob
    this.user.phoneNumber = this.stdDetail.phoneNumber
    this.user.address = this.stdDetail.address
    this.user.gender = this.stdDetail.gender
    this.studentDetail.rollNumber = this.stdDetail.rollNumber
    this.studentDetail.rollPortal = this.stdDetail.rollPortal
    this.isPopupUpdate = true;
  }

  closePopup(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation(); // Ngăn việc sự kiện click ra ngoài ảnh hưởng đến việc đóng modal
    }
    this.isPopupUpdate = false;
    this.isPopupCreate = false;
  }

  user: any = {
    fullName: "",
    email: "",
    dob: "",
    phoneNumber: "",
    address: "",
    gender: 1,
  }

  studentDetail: any = {
    rollNumber: "",
    rollPortal: ""
  }
  createStudent(): void {
    const student =
    {
      user: this.user,
      studentDetail: this.studentDetail
    }

    this.http.post(`${this.authService.apiUrl}/studentManagement`, student, this.home.httpOptions).subscribe(
      response => {
        this.toastr.success('Create Successful!', 'Success', {
          timeOut: 2000,
        });
        console.log('Create successfully', response);
        this.router.navigate(['/admin/home/student']);
      },
      error => {
        this.toastr.error('Error create Student', 'Error', {
          timeOut: 2000,
        });
        console.log('Error', error);
      }
    )
  }

  
  updateStudent(): void {
    const _student =
    {
      user: this.user,
      studentDetail: this.studentDetail
    }
    this.http.put(`${this.authService.apiUrl}/studentManagement/${this.studentId}`, _student, this.home.httpOptions).subscribe(
      response => {
        this.toastr.success('Update Successful!', 'Success', {
          timeOut: 2000,
        });
        this.router.navigate(['/admin/home/student']);
      },
      error => {
        this.toastr.error(error.error.message, 'Error', {
          timeOut: 2000,
        });
        console.log(error);
      }
    )
  }

  class: String = '';
  moveStudent(): void {
    const classes =
    {
      class: this.class
    }

    this.http.post(`${this.authService.apiUrl}/studentManagement`, classes, this.home.httpOptions).subscribe(
      response => {
        this.toastr.success('Move Successful!', 'Success', {
          timeOut: 2000,
        });
        console.log('Move successfully', response);
        this.router.navigate(['/admin/home/student']);
      },
      error => {
        this.toastr.error('Error ', 'Error', {
          timeOut: 2000,
        });
        console.log('Error', error);
      }
    )
  }

  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }
}
