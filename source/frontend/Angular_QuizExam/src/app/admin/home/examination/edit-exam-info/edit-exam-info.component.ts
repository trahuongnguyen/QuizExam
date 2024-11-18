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
import { Sem, Subject, Examination } from '../../../../shared/models/models';

@Component({
  selector: 'app-edit-exam-info',
  templateUrl: './edit-exam-info.component.html',
  styleUrls: [
    './../../../../shared/styles/admin/style.css',
    './edit-exam-info.component.css'
  ]
})
export class EditExamInfoComponent implements OnInit {
  examId: number = 0;

  exam: Examination = {
    id: 0,
    name: '',
    code: '',
    duration: 0,
    startTime: new Date(),
    endTime: new Date(),
    subject: {
      id: 0,
      sem: {
        id: 0,
        name: ''
      },
      name: '',
      image: null,
      status: 1,
    },
    markResponses: [],
    studentResponses: [],
    questionRecordResponses: [],
  };

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

  getExamByIdApi(id: number): Observable<Examination> {
    return this.http.get<Examination>(`${this.authService.apiUrl}/exam/${id}`, this.home.httpOptions);
  }

  ngOnInit(): void {
    this.titleService.setTitle('Edit Exam');
    this.examId = Number(this.activatedRoute.snapshot.params['examId']) ?? 0;
    this.getExamByIdApi(this.examId).subscribe({
      next: (data: Examination) => {
        this.exam = data;
      },
      error: () => {
        this.toastr.error('Fail!', 'Error', { timeOut: 2000 });
      }
    });
  }

  saveExam() {
    this.http.put(`${this.authService.apiUrl}/exam/${this.examId}`, this.exam, this.home.httpOptions).subscribe({
      next: () => {
        this.toastr.success('Create exam Successful!', 'Success', { timeOut: 2000 });
        this.router.navigate([this.urlService.examDetailUrl(this.examId)]);
      },
      error: (err) => {
        if (err.status === 401) {
          this.toastr.error('Unauthorized', 'Failed', { timeOut: 2000 });
        }
        else {
          let msg = '';
          if (err.error.message) {
            msg = err.error.message;
          }
          else {
            err.error.forEach((err: any) => {
              msg += ' ' + err.message;
            })
          }
          this.toastr.error(msg, 'Failed', { timeOut: 2000 });
        }
        console.log('Error', err);
      }
    });
  }
}