
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Title } from '@angular/platform-browser';
import { AdminComponent } from '../../../admin.component';
import { HomeComponent } from '../../home.component';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { UrlService } from '../../../../shared/service/url.service';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: [
    './../../../../shared/styles/admin/style.css',
    './chapter.component.css'
  ]
})
export class ChapterComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private titleService: Title,
    public admin: AdminComponent,
    private home: HomeComponent,
    private http: HttpClient,
    private toastr: ToastrService,
    public urlService: UrlService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

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
    name: '',
    status: 0
  };
  chapterId: any;
  semId: number = 1;
  subjectId: number = 1;
  name: String = '';
  dialogTitle: string = '';
  dialogMessage: string = '';
  isConfirmationPopup: boolean = false;
  isPopupDelete: boolean = false;

  ngOnInit(): void {
    this.titleService.setTitle('Chapters');

    // trả về trang subject
    const returnSubject = document.getElementById('returnSubject');
    if (returnSubject) {
      returnSubject.addEventListener("click", () => {
        this.router.navigate([this.urlService.subjectListUrl()]);
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
                    aria-controls="collapseExample" class="mdi mdi-pencil icon-action edit-icon" title="Edit" data-id="${row.id}"></span>
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
        $('.edit-icon').on('click', (event: any) => {
          this.chapterId = $(event.currentTarget).data('id');
          this._chapter = this.apiData.find((item: any) => item.id === this.chapterId);
          console.log(this._chapter);
          $('#addChapter').removeClass('show');
          $('#updateChapter').addClass('show');
          setTimeout(() => {  // Cuộn xuống form mới thêm
            const newLevelForm = document.getElementById('updateChapter');
            if (newLevelForm) {
              newLevelForm.scrollIntoView({ behavior: 'smooth' });
            }
          }, 0);

        });
        $('.delete-icon').on('click', (event: any) => {
          const id = $(event.currentTarget).data('id');
          this.chapterId = id;
          this.dialogTitle = 'Are you sure?';
          this.dialogMessage = 'Do you really want to delete this Level? This action cannot be undone.';
          this.isConfirmationPopup = true;
          this.isPopupDelete = true;
        });
        $('.btn-add').on('click', (event: any) => {
          this.subjectId = this._subjectId;
          this.name = '';
          $('#updateChapter').removeClass('show');
          setTimeout(() => {  // Cuộn xuống form mới thêm
            const newLevelForm = document.getElementById('addChapter');
            if (newLevelForm) {
              newLevelForm.scrollIntoView({ behavior: 'smooth' });
            }
          }, 0);
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

  deletingChapter: any;

  deleteChapter(id: number): void {
    this.isPopupDelete = false;
    this.http.put(`${this.authService.apiUrl}/chapter/remove/${id}`, {}, this.home.httpOptions).subscribe(
      response => {
        this.deletingChapter = response;
        this.toastr.success(`Chapter with name ${this.deletingChapter.name} deleted successfully`, 'Success', {
          timeOut: 2000,
        });
        this.reloadTable(this.subjectId);
      },
      error => {
        this.toastr.error('Error deleting item!', 'Error', {
          timeOut: 2000,
        });
      }
    );
  }

  closeform() {
    document.getElementById('addChapter')?.classList.remove('show');
    document.getElementById('updateChapter')?.classList.remove('show');
  }

  closePopup(): void {
    this.isPopupDelete = false;
  }

  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }
}
