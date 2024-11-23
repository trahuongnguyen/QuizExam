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
import { Timestamp } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: [
    './../../../../shared/styles/admin/style.css',
    './../../../../shared/styles/admin/steps.css',
    './detail.component.css'
  ]
})
export class DetailComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private titleService: Title,
    public admin: AdminComponent,
    private home: HomeComponent,
    public examComponent: ExaminationComponent,
    private http: HttpClient,
    private toastr: ToastrService,
    public urlService: UrlService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  apiData: any;
  examId: number = 0;

  selectedExam: any;  // Bài thi được chọn

  ngOnInit(): void {
    this.titleService.setTitle('Exam Details');
    this.authService.entityExporter = 'exam';
    this.examId = Number(this.activatedRoute.snapshot.params['examId']) ?? 0;
    this.http.get<any>(`${this.authService.apiUrl}/exam/${this.examId}`, this.home.httpOptions).subscribe((data: any) => {
      this.authService.listExporter = data;
      this.apiData = data;
      this.selectedExam = data;
    });
  }

  navigateToExamList(): void {
    this.router.navigate([this.urlService.examListUrl()]);
  }

  navigateToEditExam(): void {
    this.router.navigate([this.urlService.editExamUrl(this.examId)]);
  }

  navigateToAddStudentForExam(): void {
    this.router.navigate([this.urlService.addStudentForExamlUrl(this.examId)]);
  }

  transformTextWithNewlines(text: string): string {
    return text.replace(/\n/g, '<br>');
  }
  
  exportPDF() {
    this.authService.listExporter = this.apiData;
    this.authService.exportDataPDF().subscribe(
      (response) => {
        const url = window.URL.createObjectURL(new Blob([response], { type: 'blob' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'exam_pdf.pdf'; // Thay đổi tên file nếu cần
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


export interface Exam {
  id: number;
  subjectId: number;
  name: string;
  code: string;
  startTime: Timestamp<Date>;
  endTime: Timestamp<Date>;
  duration: number;
  status: number;
  type: number;
  questions: Question[];
}


export interface Question {
  id: number;
  content: string;
  image: string;
  status: number;
  answers: Answer[];
}

export interface Answer {
  id: number;
  content: string;
  isCorrect: number;
}