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
export class DetailComponent implements OnInit {
  constructor(private authService: AuthService, public home: HomeComponent, private http: HttpClient, public toastr: ToastrService, private router: Router, private activatedRoute: ActivatedRoute, public examComponent: ExaminationComponent) { }
  apiData: any;
  examId: number = 0;

  exams: Exam[] = [];  // Danh sách bài thi
  selectedExam: any;  // Bài thi được chọn

  ngOnInit(): void {
    this.authService.entityExporter = 'exam';
    this.examId = Number(this.activatedRoute.snapshot.params['examId']) ?? 0;
    this.http.get<any>(`${this.authService.apiUrl}/exam/${this.examId}`, this.home.httpOptions).subscribe((data: any) => {
      this.authService.listExporter = data;
      this.apiData = data;
      this.selectedExam = data;
    });
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
