import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Title } from '@angular/platform-browser';
import { AdminComponent } from '../../../admin.component';
import { HomeComponent } from '../../home.component';
import { ExaminationComponent } from '../examination.component';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { UrlService } from '../../../../shared/service/url.service';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: [
    './../../../../shared/styles/admin/style.css',
    './../../../../shared/styles/admin/steps.css',
    './add-student.component.css'
  ]
})
export class AddStudentComponent implements OnInit, OnDestroy {
  dataTable: any;
  
  listClass: any[] = [];
  listStudentByClass: any[] = [];
  filterStudents: any[] = [];
  searchStudent: string = '';

  studentId: number = 0;
  studentIds: number[] = [];
  selectedStudents: any[] = [];
  tempSelectedStudents: any[] = [];
  selectAllStatus: { [key: number]: boolean } = {};

  classId: number = 0;
  examId: number = 0;

  isPopupAddStudent: boolean = false;
  isPopupDelete: boolean = false;

  dialogTitle: string = '';
  dialogMessage: string = '';
  isConfirmationPopup: boolean = false;

  constructor(
    private authService: AuthService,
    private titleService: Title,
    public admin : AdminComponent,
    private home: HomeComponent,
    public examComponent: ExaminationComponent,
    private http: HttpClient,
    private toastr: ToastrService,
    public urlService: UrlService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Register Students for Exam');
    this.examId = Number(this.activatedRoute.snapshot.params['examId']);
    this.loadData();
  }

  loadData(): void {
    const examRequest = this.http.get<any>(`${this.authService.apiUrl}/exam/${this.examId}`, this.home.httpOptions);
    const classRequest = this.http.get<any>(`${this.authService.apiUrl}/class`, this.home.httpOptions);
    const studentForExamRequest = this.http.get<any>(`${this.authService.apiUrl}/exam/${this.examId}/students`, this.home.httpOptions);
    const studentNoClassRequest = this.http.get<any>(`${this.authService.apiUrl}/student-management/1`, this.home.httpOptions);

    forkJoin([examRequest, classRequest, studentForExamRequest, studentNoClassRequest])
      .subscribe(([examResponse, classResponse, studentForExamResponse, studentNoClassResponse]) => {
        if (new Date() >= new Date(examResponse.endTime)) {
          this.router.navigate([this.urlService.examListUrl()]);
          return;
        }

        this.listClass = classResponse;
        this.selectedStudents = studentForExamResponse;
        this.listStudentByClass = studentNoClassResponse;

        this.studentIds = this.selectedStudents.map(student => student.userResponse.id);
        this.filterStudents = studentNoClassResponse;
        this.initializeDataTable();
      });
  }

  initializeDataTable(): void {
    this.dataTable = $('#example').DataTable({
      data: this.selectedStudents,
      autoWidth: false,
      lengthChange: false,
      searching: false,
      info: false,
      columns: [
        { title: 'STT', data: null, render: (_: any, __: any, row: any, meta: any) => meta.row + 1 },
        { title: 'Roll Number', data: 'rollNumber' },
        { title: 'Roll Portal', data: 'rollPortal' },
        { title: 'Full Name', data: 'userResponse.fullName' },
        { title: 'Phone Number', data: 'userResponse.phoneNumber' },
        { title: 'Action', render: (data: any, type: any, row: any) => `<span class="mdi mdi-delete-forever icon-action delete-icon" data-id="${row.userResponse.id}"></span>` }
      ],
      drawCallback: () => {
        $('.delete-icon').on('click', (event: any) => {
          this.studentId = $(event.currentTarget).data('id');
          this.dialogTitle = 'Are you sure?';
          this.dialogMessage = 'Do you really want to delete this Student?';
          this.isConfirmationPopup = true;
          this.isPopupDelete = true;
        });
      }
    });
  }

  showStudentPopup(): void {
    this.tempSelectedStudents = [...this.selectedStudents];
    this.updateSelectAllStatus();
    this.isPopupAddStudent = true;
  }

  onSearchChange(): void {
    this.filterStudents = this.listStudentByClass.filter(student =>
      student.userResponse.fullName.toLowerCase().includes(this.searchStudent.toLowerCase()) ||
      student.userResponse.email.toLowerCase().includes(this.searchStudent.toLowerCase())
    );
  }

  filterStudentsByClass(): void {
    const url = this.classId == 0 
      ? `${this.authService.apiUrl}/student-management/1` 
      : `${this.authService.apiUrl}/student-management/${this.classId}/1`;
    
    this.http.get<any>(url, this.home.httpOptions).subscribe(response => {
      this.listStudentByClass = response;
      this.filterStudents = response;
      this.updateSelectAllStatus();
    });
  }

  handleCheckboxChange(id: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const student = this.listStudentByClass.find(s => s.userResponse.id === id);

    if (checkbox.checked) {
      if (student && !this.tempSelectedStudents.includes(student)) {
        this.tempSelectedStudents.push(student);
      }
    }
    else {
      this.tempSelectedStudents = this.tempSelectedStudents.filter(student => student.userResponse.id !== id);
    }
    this.updateSelectAllStatus();
  }

  isChecked(id: number): boolean {
    return this.tempSelectedStudents.some((student: any) => student.userResponse.id == id);
  }

  toggleSelectAll(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    
    if (isChecked) {
      this.listStudentByClass.forEach((student: any) => {
        if (!this.tempSelectedStudents.includes(student)) {
          this.tempSelectedStudents.push(student);
        }
      });
    }
    else {
      this.tempSelectedStudents = this.tempSelectedStudents.filter(student => 
        !this.listStudentByClass.some(s => s.userResponse.id === student.userResponse.id)
      );
    }
    this.updateSelectAllStatus();
  }

  updateSelectAllStatus(): void {
    this.selectAllStatus[this.classId] = this.listStudentByClass
      .every(student => this.tempSelectedStudents.some(s => s.userResponse.id === student.userResponse.id));
  }

  updateDataTable(): void {
    if (this.dataTable) {
      this.dataTable.clear();
      this.dataTable.rows.add(this.selectedStudents);
      this.dataTable.draw();
    }
  }

  saveSelectedStudents(): void {
    this.selectedStudents = [...this.tempSelectedStudents];
    this.studentIds = this.selectedStudents.map(student => student.userResponse.id);
    this.updateDataTable();
    this.closePopup();
  }

  closePopup(): void {
    this.searchStudent = '';
    this.tempSelectedStudents = [];
    this.onSearchChange();
    this.isPopupAddStudent = false;
    this.isPopupDelete = false;
  }

  deleteStudent(): void {
    this.studentIds = this.studentIds.filter(id => id !== this.studentId);
    this.selectedStudents = this.selectedStudents.filter(student => student.userResponse.id != this.studentId);
    this.updateDataTable();
    this.closePopup();
  }

  addStudentInExam(): void {
    if (this.selectedStudents.length > 0) {
      this.http.put(`${this.authService.apiUrl}/exam/student/${this.examId}`, this.studentIds, this.home.httpOptions).subscribe({
        next: () => {
          this.toastr.success('Register Students for Exam Successful!', 'Success', { timeOut: 2000 });
          if (this.examComponent.step) {
            this.examComponent.step = true;
          }
          this.router.navigate([this.urlService.examDetailUrl(this.examId)]);
        },
        error: (err) => {
          console.error('Error adding students:', err);
        }
      });
    } else {
      this.toastr.warning('You must register at least one student for the exam.', 'Warning', { timeOut: 3000 });
    }
  }

  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }
}