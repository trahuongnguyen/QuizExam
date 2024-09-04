import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrl: './class.component.css'
})
export class ClassComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService, private http: HttpClient, public toastr: ToastrService, private router: Router) { }

  dataTable: any;
  apiData: any;
  stdDetail: any = null;
  isPopupDetail = false;
  isPopupCreate = false;

  ngOnInit(): void {
    this.http.get<any>(`${this.authService.apiUrl}/user`).subscribe((data: any) => {
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
        { title: 'Day', data: 'day' },
        { title: 'Hour', data: 'hour' },
        { title: 'Admission Date', data: 'admissionDate' },
        
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
    this.stdDetail = this.apiData.find((item: any) => item.id === id);
    this.isPopupDetail = true;
  }

  closePopup(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation(); // Ngăn việc sự kiện click ra ngoài ảnh hưởng đến việc đóng modal
    }
    this.isPopupDetail = false;
    this.isPopupCreate = false;
  }


  Name: String = '';
  Day: String = '';
  Hour: String = '';
  AdmissionDate: String = '';
  createClass(): void {
const class0 =
    {
      name: this.Name, day: this.Day, hour: this.Hour, admissionDate: this.AdmissionDate
    }

    this.http.post(`${this.authService.apiUrl}/auth/register`, class0, {responseType: 'json'}).subscribe(
      response => {
        this.toastr.success('Create Successful!', 'Success', {
          timeOut: 2000,
        });
        console.log('Create successfully', response);
        this.router.navigate(['/admin/home/class']);
      },
      error => {
        this.toastr.error('Error', 'Error', {
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
