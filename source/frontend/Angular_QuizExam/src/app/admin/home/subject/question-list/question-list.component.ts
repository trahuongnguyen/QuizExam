import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from '../../home.component';
import { SubjectComponent } from '../subject.component';
declare var $: any;

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrl: './question-list.component.css'
})
export class QuestionListComponent {
  constructor(private authService: AuthService, private home: HomeComponent, private http: HttpClient, public toastr: ToastrService, private router: Router, private activatedRoute: ActivatedRoute, public subjectComponent: SubjectComponent) { }

  dataTable: any;
  apiData: any;
  subjects: any;
  sems: any;
  _subjectId: any;
  _subjectName: any;
  _chapter: any = {
    id: 0,
    subject: {
      id: 1,
    },
    name: ''
  };
  chapterId: any;
  semId: number = 1;
  subjectId: number = 1;
  name: String = '';

  ngOnInit(): void {

    this._subjectId = Number(this.activatedRoute.snapshot.params['subjectId']) ?? 0;
    if (this._subjectId > 0 && !Number.isNaN(this._subjectId)) {
      this.http.get<any>(`${this.authService.apiUrl}/question/${this._subjectId}`, this.home.httpOptions).subscribe((data: any) => {
        this.apiData = data;
        this.subjectId = this._subjectId;
        this.initializeDataTable();
      });
    }

    this.http.get<any>(`${this.authService.apiUrl}/subject/${this._subjectId}`, this.home.httpOptions).subscribe((data: any) => {
      this.semId = data.sem.id;
      console.log(this.semId);
      this.http.get<any>(`${this.authService.apiUrl}/subject/sem/${this.semId}`, this.home.httpOptions).subscribe(response => {
        this.subjects = response;
        for (let sub of this.subjects) {
          if (sub.id == this._subjectId) {
            this._subjectName = sub.name;
          }
        }
      });
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
        { title: 'Question', data: 'content' },
        {
          title: 'Chapter',
          data: 'chapters',
          render: function (data: any, type: any, row: any) {
            let value: any = '';
            console.log(row);
            data.forEach((val: any) => {
              value+=val.name;
            });
            return value;
          }
        },
        { title: 'Level', data: 'level.name' },
        {
          title: 'Action',
          data: null,
          render: function (data: any, type: any, row: any) {
            return `<span  class="mdi mdi-pencil icon-action edit-icon" data-id="${row.id}"></span>`;

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
        $('.edit-icon').on('click', (event: any) => {
          const id = $(event.currentTarget).data('id');
          this.router.navigate([`/admin/home/subject/${this.subjectId}/questionUpdate/${id}`]);
        });
      }
    });
  }


  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
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
}
