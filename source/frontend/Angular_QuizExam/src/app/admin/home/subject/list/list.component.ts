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
import { Sem, Subject } from '../../../../shared/models/models';
declare var $: any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: [
    './../../../../shared/styles/admin/style.css',
    './list.component.css'
  ]
})
export class ListComponent implements OnInit, OnDestroy {
  semList: Sem[] = [];
  subjectList: Subject[] = [];
  dataTable: any;

  subjectForm: Subject = {
    id: 0,
    sem: { id: 0, name: '' },
    name: '',
    image: null,
    status: 0
  };
  selectedSem: number = 0;
  changeImg: boolean = false;

  isPopupCreate: boolean = false;
  isPopupUpdate: boolean = false;
  isPopupDelete: boolean = false;

  dialogTitle: string = '';
  dialogMessage: string = '';
  isConfirmationPopup: boolean = false;

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

  ngOnInit(): void {
    this.titleService.setTitle('List of Subjects');
    this.authService.entityExporter = 'subject';
    this.loadData();
  }

  getSemListApi(): Observable<Sem[]> {
    return this.http.get<Sem[]>(`${this.authService.apiUrl}/sem`, this.home.httpOptions);
  }

  getSubjectListBySemApi(semId: number): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.authService.apiUrl}/subject/sem/${semId}`, this.home.httpOptions);
  }

  getSubjectByIdApi(id: number): Observable<Subject> {
    return this.http.get<Subject>(`${this.authService.apiUrl}/subject/${id}`, this.home.httpOptions);
  }

  createSubjectApi(formData: FormData): Observable<FormData> {
    return this.http.post<FormData>(`${this.authService.apiUrl}/subject`, formData, this.home.httpOptions);
  }

  updateSubjectApi(formData: FormData, subjectId: number): Observable<FormData> {
    return this.http.put<FormData>(`${this.authService.apiUrl}/subject/${subjectId}`, formData, this.home.httpOptions);
  }

  deleteSubjectApi(subjectId: number): Observable<Subject> {
    return this.http.put<Subject>(`${this.authService.apiUrl}/subject/remove/${subjectId}`, {}, this.home.httpOptions);
  }

  navigateToChapters(id: number): void {
    this.router.navigate([this.urlService.chapterListUrl(id)]);
  }

  navigateToQuestions(id: number): void {
    this.router.navigate([this.urlService.questionListUrl(id)]);
  }

  loadData(): void {
    this.getSemListApi().subscribe((semResponse: any) => {
      this.semList = semResponse;

      if (this.semList.length > 0) {
        this.selectedSem = this.semList[0].id;
        this.subjectForm.sem.id = this.selectedSem;
        this.getSubjectListBySemApi(this.selectedSem).subscribe(
          (subjectResponse: Subject[]) => {
            this.subjectList = subjectResponse;
            this.authService.listExporter = subjectResponse;
            this.initializeDataTable();
          },
          (error) => {
            console.error('Error:', error);
          }
        );
      }
      else {
        this.toastr.error('No semesters available', 'Error', { timeOut: 2000 });
      }
    });
  }

  initializeDataTable(): void {
    this.dataTable = $('#example').DataTable({
      data: this.subjectList,
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
          render: (data: any, type: any, row: any) =>
            `<span class="mdi mdi-information-outline icon-action info-icon" title="Info" data-id="${row.id}"></span>
            <span class="mdi mdi-pencil icon-action edit-icon" title="Edit" data-id="${row.id}"></span>
            <span class="mdi mdi-comment-question-outline icon-action question-icon" title="Question" data-id="${row.id}"></span>
            <span class="mdi mdi-delete-forever icon-action delete-icon" title="Remove" data-id="${row.id}"></span>`
        }
      ],

      drawCallback: () => this.addEventListeners()
    });
  }

  addEventListeners(): void {
    // Sửa input search thêm button vào
    if (!$('.dataTables_filter button').length) {
      $('.dataTables_filter').append(`<button type="button"><i class="fa-solid fa-magnifying-glass search-icon"></i></button>`);
    }

    // Thêm placeholder vào input của DataTables
    $('.dataTables_filter input[type="search"]').attr('placeholder', 'Search');

    $('.info-icon').on('click', (e: any) => this.navigateToChapters($(e.currentTarget).data('id')));
    $('.edit-icon').on('click', (e: any) => this.showPopupEdit($(e.currentTarget).data('id')));
    $('.question-icon').on('click', (e: any) => this.navigateToQuestions($(e.currentTarget).data('id')));
    $('.delete-icon').on('click', (e: any) => this.showPopupDelete($(e.currentTarget).data('id')));
  }

  updateDataTable(newData: any): void {
    if (this.dataTable) {
      this.dataTable.clear(); // Xóa dữ liệu hiện tại
      this.dataTable.rows.add(newData); // Gọi dữ liệu mới
      this.dataTable.draw(); // Vẽ lại bảng
    }
  }

  reloadTable(semId: number): void {
    this.getSubjectListBySemApi(semId).subscribe(
      (subjectResponse: Subject[]) => {
        this.subjectList = subjectResponse;
        this.authService.listExporter = subjectResponse;
        this.updateDataTable(this.subjectList);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
    this.closePopup();
  }

  setSelectedSem(semId: number): void {
    this.selectedSem = semId;
    this.subjectForm.sem.id = this.selectedSem;
    this.reloadTable(this.selectedSem);
  }

  showPopupCreate(): void {
    this.isPopupCreate = true;
  }

  showPopupEdit(id: number): void {
    this.getSubjectByIdApi(id).subscribe(
      (subjectResponse: Subject) => {
        this.subjectForm = subjectResponse;
        this.isPopupUpdate = true;
      },
      (error) => {
        this.toastr.error(error.error.message, 'Error', { timeOut: 4000 });
        setTimeout(() => { window.location.reload(); }, 4000);
      }
    );
  }

  showPopupDelete(id: number): void {
    this.getSubjectByIdApi(id).subscribe(
      (subjectResponse: Subject) => {
        this.subjectForm = subjectResponse;
        this.dialogTitle = 'Are you sure?';
        this.dialogMessage = 'Do you really want to delete this Subject? This action cannot be undone.';
        this.isConfirmationPopup = true;
        this.isPopupDelete = true;
      },
      (error) => {
        this.toastr.error(error.error.message, 'Error', { timeOut: 4000 });
        setTimeout(() => { window.location.reload(); }, 4000);
      }
    );
  }

  closePopup(): void {
    this.subjectForm = {
      id: 0,
      sem: { id: this.selectedSem, name: '' },
      name: '',
      image: null,
      status: 0
    };
    this.changeImg = false;
    this.isPopupCreate = false;
    this.isPopupUpdate = false;
    this.isPopupDelete = false;
  }

  chooseImage(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    const imgSubject = document.getElementById(`image-subject`) as HTMLImageElement;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imgSubject.src = e.target?.result as string;
        imgSubject.style.display = 'block';
      };
      reader.readAsDataURL(file);
      this.subjectForm.image = file;
      this.changeImg = true;
    }
  }

  removeImage() {
    const imgSubject = document.getElementById(`image-subject`) as HTMLImageElement;
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    // Xóa ảnh
    this.subjectForm.image = null;
    this.changeImg = true;
    imgSubject.src = '';
    imgSubject.style.display = 'none';
    
    // Đặt lại giá trị input file
    if (fileInput) {
        fileInput.value = '';
    }
  }

  createSubject(): void {
    const formData = new FormData();
    const subject = { semId: this.subjectForm.sem.id, name: this.subjectForm.name }
    
    formData.append('file', this.subjectForm.image || new Blob([]));
    formData.append('subject', new Blob([JSON.stringify(subject)], { type: 'application/json' }));

    this.createSubjectApi(formData).subscribe({
      next: () => {
        this.toastr.success('Create Successful!', 'Success', { timeOut: 2000 });
        this.reloadTable(subject.semId);
      },
      error: () => {
        this.toastr.error('Create Fail!', 'Error', { timeOut: 2000 });
      }
    });
  }

  updateSubject() {
    const formData = new FormData();
    const subject = { semId: this.subjectForm.sem.id, name: this.subjectForm.name }

    if (this.changeImg) {
      formData.append('file', this.subjectForm.image || new Blob([]));
    }
    formData.append('subject', new Blob([JSON.stringify(subject)], { type: 'application/json' }));

    this.updateSubjectApi(formData, this.subjectForm.id).subscribe({
      next: () => {
        this.toastr.success('Update Successful!', 'Success', { timeOut: 2000 });
        this.reloadTable(subject.semId);
      },
      error: () => {
        this.toastr.error('Update Fail!', 'Error', { timeOut: 2000 });
      }
    });
  }

  deleteSubject(): void {
    this.deleteSubjectApi(this.subjectForm.id).subscribe({
      next: () => {
        this.toastr.success('Delete Successful!', 'Success', { timeOut: 2000 });
        this.reloadTable(this.subjectForm.sem.id);
      },
      error: () => {
        this.toastr.error('Delete Fail!', 'Error', { timeOut: 2000 });
      }
    });
  }

  exportExcel() {
    this.authService.listExporter = this.subjectList;
    this.exportData(this.authService.exportDataExcel(), 'subject_excel.xlsx');
  }

  exportPDF() {
    this.authService.listExporter = this.subjectList;
    this.exportData(this.authService.exportDataPDF(), 'subject_pdf.pdf');
  }

  exportData(exportFunction: any, fileName: string): void {
    exportFunction.subscribe((response: any) => {
      const url = window.URL.createObjectURL(new Blob([response], { type: 'application/octet-stream' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }

  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }
}