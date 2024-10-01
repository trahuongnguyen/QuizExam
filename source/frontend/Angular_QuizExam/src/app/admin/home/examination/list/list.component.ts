import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HomeComponent } from '../../home.component';
import { response } from 'express';
import { ExaminationComponent } from '../examination.component';
declare var $: any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  constructor(private authService: AuthService, public home: HomeComponent, private http: HttpClient, public toastr: ToastrService, private router: Router, public examComponent: ExaminationComponent) { }

  dataTable: any;
  apiData: any;
  subjectDetail: any = null;
  isPopupDetail = false;
  isPopupCreate = false;
  isPopupUpdate = false;

  subjectId: any;
  sem: any;
  selectedSem: number = 1; // Default chọn Sem 1

  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  ngOnInit(): void {
    this.authService.entityExporter = 'subject';
    this.http.get<any>(`${this.authService.apiUrl}/subject/sem/${this.selectedSem}`, this.home.httpOptions).subscribe((data: any) => {
      this.apiData = data;
      this.initializeDataTable();
    });

    this.http.get<any>(`${this.authService.apiUrl}/sem`, this.home.httpOptions).subscribe(response => {
      this.sem = response;
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
        { title: 'Subject', data: 'name' },
        {
          title: 'Action',
          data: null,
          render: function (data: any, type: any, row: any) {
            return `<span class="mdi mdi-information-outline icon-action info-icon" data-id="${row.id}"></span>
            <span class="mdi mdi-pencil icon-action edit-icon" data-id="${row.id}"></span>
            <span class="mdi mdi-comment-question-outline icon-action question-icon" data-id="${row.id}"></span>
            `;
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
          this.subjectId = id;
          this.router.navigate([`/admin/home/subject/${id}`])
        });

        $('.create').on('click', () => {
          this.isPopupCreate = true;
        });

        $('.question-icon').on('click', (event: any) => {
          const id = $(event.currentTarget).data('id');
          this.subjectId = id;
          this.router.navigate([`/admin/home/subject/${id}/questionList`])
        });

        $('.edit-icon').on('click', (event: any) => {
          const id = $(event.currentTarget).data('id');
          this.subjectId = id;
          this.showPopupEdit(id);
        });

      }
    });
  }

  updateDataTable(newData: any[]): void {
    if (this.dataTable) {
      this.dataTable.clear(); // Xóa dữ liệu hiện tại
      this.dataTable.rows.add(newData); // Thêm dữ liệu mới
      this.dataTable.draw(); // Vẽ lại bảng
    }
  }

  reloadTable(id: number): void {
    this.http.get<any>(`${this.authService.apiUrl}/subject/sem/${id}`, this.home.httpOptions).subscribe((data: any) => {
      this.apiData = data;
      this.updateDataTable(this.apiData); // Cập nhật bảng với dữ liệu mới
    });
    this.isPopupCreate = false;
    this.isPopupUpdate = false;
    this.isPopupDetail = false;
  }

  selectSem(sem: number): void {
    this.selectedSem = sem;
    this.semId = sem;
    // Thực hiện các logic nếu cần thiết khi chọn Sem
    this.reloadTable(this.selectedSem);
    console.log('Selected Sem:', sem);
  }

  showPopupEdit(id: number): void {
    this.subjectDetail = this.apiData.find((item: any) => item.id === id);
    this.isPopupUpdate = true;
  }

  closePopup(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation(); // Ngăn việc sự kiện click ra ngoài ảnh hưởng đến việc đóng modal
    }
    this.isPopupDetail = false;
    this.isPopupCreate = false;
    this.isPopupUpdate = false;
  }


  semId: number = 1;
  name: String = '';
  image: String = '';

  createSubject(): void {
    const _subject =
    {
      semId: this.semId, name: this.name, image: this.image,
    }

    this.http.post(`${this.authService.apiUrl}/subject/save`, _subject, this.home.httpOptions).subscribe(
      response => {
        this.toastr.success('Create Successful!', 'Success', {
          timeOut: 2000,
        });
        console.log('Create successfully', response);
        this.selectedSem = _subject.semId;
        this.reloadTable(this.selectedSem);
      },
      error => {
        this.toastr.error('Error', 'Error', {
          timeOut: 2000,
        });
        console.log('Error', error);
      }
    )
  }

  updateSubject() {
    const _subject =
    {
      semId: this.subjectDetail.sem.id, name: this.subjectDetail.name, image: this.subjectDetail.image,
    }

    this.http.put(`${this.authService.apiUrl}/subject/${this.subjectId}`, _subject, this.home.httpOptions).subscribe(
      response => {
        this.toastr.success('Update Successful!', 'Success', {
          timeOut: 2000,
        });
        console.log('Update successfully', response);
        this.reloadTable(_subject.semId);
      },
      error => {
        this.toastr.error('Error', 'Error', {
          timeOut: 2000,
        });
        console.log('Error', error);
      }
    )
  }

  deleteSubject(id: number): void {
    if (!window.confirm('Are you sure you want to delete this class?')) {
      return;
    }
    this.http.delete(`${this.authService.apiUrl}/subject/${id}`, this.home.httpOptions).subscribe(
      () => {
        this.toastr.success('Delete Successful!', 'Success', {
          timeOut: 2000,
        });
        console.log(`Class with ID ${id} deleted successfully`);
        this.reloadTable(id);
      },
      error => {
        this.toastr.error('Error', 'Error', {
          timeOut: 2000,
        });
        console.error('Error deleting item:', error);
      }
    );
  }

  exportExcel() {
    this.authService.exportDataExcel().subscribe(
      (response) => {
        const url = window.URL.createObjectURL(new Blob([response], { type: 'blob' as 'json' }));
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
        const url = window.URL.createObjectURL(new Blob([response], { type: 'blob' }));
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

  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }

}
