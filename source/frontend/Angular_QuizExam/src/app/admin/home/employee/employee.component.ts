import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { response } from 'express';
declare var $: any;

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})

export class EmployeeComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService, private http: HttpClient, public toastr: ToastrService, private router: Router) { }

  dataTable: any;
  apiData: any;
  infoDetail: any = null;
  isPopupDetail = false;
  isPopupCreate = false;
  
  role: any;
  httpOptions: any;

  private loadToken() {
    if (this.authService.isLoggedIn()) {
      const token = localStorage.getItem('jwtToken');
      this.httpOptions = {
        headers: new HttpHeaders({ 
          'Content-Type': 'application/json' ,
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }),
        responeType: 'json',
        withCredentials: true
      };
    }
    else {
      this.router.navigate(['admin/login']);
    }
  }

  ngOnInit(): void {
    this.loadToken();
    
    this.http.get<any>(`${this.authService.apiUrl}/user`, this.httpOptions).subscribe((data: any) => {
      this.apiData = data;
      this.initializeDataTable();
    });

    this.http.get<any>(`${this.authService.apiUrl}/auth/register`, this.httpOptions).subscribe(response=>{
      this.role = response;
    })
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
        { title: 'Full Name', data: 'fullName' },
        { title: 'Email', data: 'email' },
        { title: 'Phone Number', data: 'phoneNumber' },
        { title: 'Role', data: 'role.name' },
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
          this.showPopupDetail(id);
        });

        $('.create').on('click', () => {
          this.isPopupCreate = true;
        });
      }
    });
  }

  showPopupDetail(id: number): void {
    this.infoDetail = this.apiData.find((item: any) => item.id === id);
    this.isPopupDetail = true;
  }

  closePopup(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation(); // Ngăn việc sự kiện click ra ngoài ảnh hưởng đến việc đóng modal
    }
    this.isPopupDetail = false;
    this.isPopupCreate = false;
  }


  fullName: String = '';
  email: String = '';
  dob: String = '';
  phoneNumber: String = '';
  address: String = '';
  gender: number = 1;
  roleId: number = 4;
  createEmployee(): void {
    const employee =
    {
      fullName: this.fullName, email: this.email, dob: this.dob,
      phoneNumber: this.phoneNumber, address: this.address,
      gender: this.gender, roleId: this.roleId
    }

    this.http.post(`${this.authService.apiUrl}/auth/register`, employee, {responseType: 'json'}).subscribe(
      response => {
        this.toastr.success('Create Successful!', 'Success', {
          timeOut: 2000,
        });
        setInterval(function() {
          window.location.reload();
        }, 2000);
      },
      error => {
        this.toastr.error('Error create Employee', 'Error', {
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

exportExcel() {
    this.authService.exportDataExcel().subscribe(
      (response) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'export_excel.xlsx'; // Thay đổi tên file nếu cần
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
    this.authService.exportDataPDF().subscribe(
      (response) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'export_pdf.pdf'; // Thay đổi tên file nếu cần
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
}