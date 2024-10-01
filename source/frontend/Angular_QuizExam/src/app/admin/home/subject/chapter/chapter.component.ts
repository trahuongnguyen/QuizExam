import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from '../../home.component';
import { SubjectComponent } from '../subject.component';
declare var $: any;

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrl: './chapter.component.css'
})
export class ChapterComponent implements OnInit, OnDestroy {
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
    // trả về trang subject
    const returnSubject = document.getElementById('returnSubject');
    if (returnSubject) {
      returnSubject.addEventListener("click", () => {
        this.router.navigate(['admin/home/subject']);
      });
    }

    this._subjectId = Number(this.activatedRoute.snapshot.params['subjectId']) ?? 0;
    if (this._subjectId > 0 && !Number.isNaN(this._subjectId)) {
      this.http.get<any>(`${this.authService.apiUrl}/chapter/${this._subjectId}`, this.home.httpOptions).subscribe((data: any) => {
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
        { title: 'Chapter', data: 'name' },
        {
          title: 'Action',
          data: null,
          render: function (data: any, type: any, row: any) {
            return `<span data-bs-toggle="collapse" role="button" aria-expanded="false"
                    aria-controls="collapseExample" class="mdi mdi-pencil icon-action edit-icon" data-id="${row.id}"></span>
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
        $('.edit-icon').on('click', (event: any) => {
          this.chapterId = $(event.currentTarget).data('id');
          this._chapter = this.apiData.find((item: any) => item.id === this.chapterId);
          $('#addChapter').removeClass('show');
          $('#updateChapter').addClass('show');

        });
        $('.btn-add').on('click', (event: any) => {
          this.subjectId = this._subjectId;
          this.name = '';
          $('#updateChapter').removeClass('show');
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
    this.http.get<any>(`${this.authService.apiUrl}/chapter/${id}`, this.home.httpOptions).subscribe((data: any) => {
      this.apiData = data;
      this.updateDataTable(this.apiData); // Cập nhật bảng với dữ liệu mới
    });
    this.closeform();
  }

  createChapter(): void {
    const chapter =
    {
      name: this.name,
      subjectId: this.subjectId
    }

    this.http.post(`${this.authService.apiUrl}/chapter`, chapter, this.home.httpOptions).subscribe(
      response => {
        this.toastr.success('Create new chapter Successful!', 'Success', {
          timeOut: 2000,
        });
        this.reloadTable(this._subjectId);
      },
      error => {
        if (error.status === 401) {
          this.toastr.error('Not found', 'Failed', {
            timeOut: 2000,
          });
        } else {
          let msg = '';
          if (error.error.message) {
            msg = error.error.message;
          } else {
            error.error.forEach((err: any) => {
              msg += ' ' + err.message;
            })
          }
          this.toastr.error(msg, 'Failed', {
            timeOut: 2000,
          });
        }
        console.log('Error', error);
      }
    )
  }

  updateChapter(): void {
    const chapter =
    {
      name: this._chapter.name,
      subjectId: this._chapter.subject.id,
      id: this.chapterId
    }

    this.http.put(`${this.authService.apiUrl}/chapter/${this.chapterId}`, chapter, this.home.httpOptions).subscribe(
      response => {
        this.toastr.success('Create new chapter Successful!', 'Success', {
          timeOut: 2000,
        });
        this.reloadTable(this._subjectId);
      },
      error => {
        if (error.status === 401) {
          this.toastr.error('Not found', 'Failed', {
            timeOut: 2000,
          });
        } else {
          let msg = '';
          if (error.error.message) {
            msg = error.error.message;
          } else {
            error.error.forEach((err: any) => {
              msg += ' ' + err.message;
            })
          }
          this.toastr.error(msg, 'Failed', {
            timeOut: 2000,
          });
        }
        console.log('Error', error);
      }
    )
  }

  closeform() {
    document.getElementById('addChapter')?.classList.remove('show');
    document.getElementById('updateChapter')?.classList.remove('show');
  }

  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }
}
