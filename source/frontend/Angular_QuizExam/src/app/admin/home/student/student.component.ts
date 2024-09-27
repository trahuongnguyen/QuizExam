import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from '../home.component';
declare var $: any;

@Component({
  selector: 'app-class',
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService, private home: HomeComponent, private http: HttpClient, public toastr: ToastrService, private router: Router, private activatedRoute: ActivatedRoute) { }

  dataTable: any;
  apiData: any;
  stdResponse: any = null;
  isPopupUpdate = false;
  isPopupCreate = false;
  isPopupMove = false;
  classes: any;
  _classId: any;
  classId: any = 1;
  class: String = '';
  userIds: Number[] = [];

  studentId: any;

  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  get formattedDob(): string {
    const dob = this.stdResponse.userResponse.dob;
    // Chuyển đổi chuỗi "dd-MM-yyyy" sang định dạng "yyyy-MM-dd"
    if (dob) {
      const [day, month, year] = dob.split('-');
      return `${year}-${month}-${day}`;  // Định dạng yyyy-MM-dd
    }
    return '';
  }

  onDateChange(event: any) {
    // Khi người dùng thay đổi ngày, lưu giá trị đó lại
    this.stdResponse.userResponse.dob = event; // Giá trị sẽ ở định dạng yyyy-MM-dd
  }
  
  ngOnInit(): void {
    this.authService.entityExporter = 'studentManagement';
    this._classId = Number(this.activatedRoute.snapshot.params['classId'])??0;
    if(this._classId!=0 && !Number.isNaN(this._classId)){
      this.http.get<any>(`${this.authService.apiUrl}/studentManagement/${this._classId}`, this.home.httpOptions).subscribe((data: any) => {
        this.apiData = data;
        this.authService.listExporter = data;
        this.initializeDataTable();
      });
    }
    else{
      this._classId = 0;
      this.http.get<any>(`${this.authService.apiUrl}/studentManagement`, this.home.httpOptions).subscribe((data: any) => {
        this.apiData = data;
        this.initializeDataTable();
      });
    }
    this.http.get<any>(`${this.authService.apiUrl}/class`, this.home.httpOptions).subscribe((data: any) => {
      this.classes = data;
      for (let dt of data) {
        if(this._classId == dt.id){
          this.class = dt.name;
        }
      }
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
        { title: 'Full Name', data: 'userResponse.fullName' },
        { title: 'Phone Number', data: 'userResponse.phoneNumber' },
        {
          title: 'Action',
          data: '_class',
          render: function (data: any, type: any, row: any) {
            if(data==null){
              return `<span class="mdi mdi-information-outline icon-action info-icon" data-id="${row.userResponse.id}"></span>
              <input type="checkbox" class="icon-action chk_box" data-id="${row.userResponse.id}">
              <span class="mdi mdi-delete-forever icon-action delete-icon"></span>`;
            }
            else{
              return `<span class="mdi mdi-information-outline icon-action info-icon" data-id="${row.userResponse.id}"></span>
              <span class="mdi mdi-delete-forever icon-action delete-icon"></span>`;
            }
          },
        },
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

        $('.chk_box').on('click', (event: any) => {
          const id = $(event.currentTarget).data('id');
          this.userIds.includes(id) ? this.userIds.splice(this.userIds.indexOf(id), 1) : this.userIds.push(id);
        });
      }
    });
  }

  showMovePopup():void{
    this.isPopupMove = true;
  }

  showPopupEdit(id: number): void {
    this.stdResponse = this.apiData.find((item: any) => item.userResponse.id === id);
    this.isPopupUpdate = true;
  }

  closePopup(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation(); // Ngăn việc sự kiện click ra ngoài ảnh hưởng đến việc đóng modal
    }
    this.isPopupUpdate = false;
    this.isPopupCreate = false;
  }

  closeMove():void{
    this.isPopupMove = false;
  }
  stdRequest: any = {
    userRequest: {
      fullName: "",
      email: "",
      dob: "",
      phoneNumber: "",
      address: "",
      gender: 1,
      roleId: 5
    },
    rollNumber: "",
    rollPortal: ""
  }

  updateDataTable(newData: any[]): void {
    if (this.dataTable) {
      this.dataTable.clear(); // Xóa dữ liệu hiện tại
      this.dataTable.rows.add(newData); // Thêm dữ liệu mới
      this.dataTable.draw(); // Vẽ lại bảng
    }
  }

  reloadTable(id: number): void {
      this.http.get<any>(id!=0?`${this.authService.apiUrl}/studentManagement/${id}`:`${this.authService.apiUrl}/studentManagement`, this.home.httpOptions).subscribe((data: any) => {
        this.apiData = data;
        this.updateDataTable(this.apiData); // Cập nhật bảng với dữ liệu mới
      });
    this.closePopup();
  }

  createStudent(): void {
    if(this._classId !=0){
      this.stdRequest.classId = this._classId;
    }
    this.http.post(`${this.authService.apiUrl}/studentManagement`, this.stdRequest, this.home.httpOptions).subscribe(
      response => {
        this.toastr.success('Create Successful!', 'Success', {
          timeOut: 2000,
        });
        console.log('Create successfully', response);
        this.reloadTable(this._classId);
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
    const _studentRequest = {
      userRequest: {
        fullName: this.stdResponse.userResponse.fullName,
        email: this.stdResponse.userResponse.email,
        dob: this.stdResponse.userResponse.dob,
        phoneNumber: this.stdResponse.userResponse.phoneNumber,
        address: this.stdResponse.userResponse.address,
        gender: this.stdResponse.userResponse.gender,
        roleId: 5
      },
      rollNumber: this.stdResponse.rollNumber,
      rollPortal: this.stdResponse.rollPortal
    }
    this.http.put(`${this.authService.apiUrl}/studentManagement/${this.studentId}`, _studentRequest, this.home.httpOptions).subscribe(
      response => {
        this.toastr.success('Update Successful!', 'Success', {
          timeOut: 2000,
        });
        this.reloadTable(this._classId);
      },
      error => {
        this.toastr.error(error.error.message, 'Error', {
          timeOut: 2000,
        });
        console.log(error);
      }
    )
  }

  moveStudent(): void {
    const _class =
    {
      classId: this.classId,
      userIds: this.userIds
    }

    this.http.put(`${this.authService.apiUrl}/studentManagement/update-class`, _class, this.home.httpOptions).subscribe(
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

  exportExcel() {
    this.authService.listExporter = this.apiData;
    this.authService.exportDataExcel().subscribe(
      (response) => {
        const url = window.URL.createObjectURL(new Blob([response], { type: 'blob' as 'json' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'student_excel.xlsx'; // Thay đổi tên file nếu cần
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
        a.download = 'student_pdf.pdf'; // Thay đổi tên file nếu cần
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
