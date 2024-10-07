import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from '../../home.component';
import { ExaminationComponent } from '../examination.component';
import { response } from 'express';
import { Observable } from 'rxjs/internal/Observable';
import { Timestamp } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent {
  constructor(private authService: AuthService, private home: HomeComponent, private http: HttpClient, public toastr: ToastrService, private router: Router, private activatedRoute: ActivatedRoute, public examComponent: ExaminationComponent) { }
  apiData: any;
  examId: number = 0;
  isSidebarCollapsed = false;

  exams: Exam[] = [];  // Danh sách bài thi
  selectedExam: any | undefined;  // Bài thi được chọn
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  ngOnInit(): void {
    this.isSidebarCollapsed = this.home.isSidebarCollapsed;
    this.authService.entityExporter = 'examination';
    this.http.get<any>(`${this.authService.apiUrl}/exam/1`, this.home.httpOptions).subscribe((data: any) => {
      this.authService.listExporter = data;
      this.apiData = data;
      this.selectedExam = data;
    });
  }

  getAllExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(this.authService.apiUrl);
  }

  // Lấy chi tiết bài thi theo ID
  getExamDetail(event: any){
    const id = $(event.currentTarget).data('id');
    this.examId = id;
    this.router.navigate([`/admin/home/exam/detail/${id}`])
  }

  loadExams(): void {
    this.getAllExams().subscribe(data => {
      this.exams = data;
    });
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
