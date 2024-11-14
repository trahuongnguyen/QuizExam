import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Title } from '@angular/platform-browser';
import { HomeComponent } from '../../home.component';
import { ExamComponent } from '../exam.component';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { UrlService } from '../../../../shared/service/url.service';
import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private titleService: Title,
    private home: HomeComponent,
    public examComponent: ExamComponent,
    private http: HttpClient,
    private toastr: ToastrService,
    public urlService: UrlService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  semesters: any;
  examList: any = [];
  isPopupExam: any;
  popupExamIndex: number = 0;
  selectedExam: any;

  ngOnInit(): void {
    this.titleService.setTitle('List of Exams');

    this.http.get<any>(`${this.authService.apiUrl}/sem`, this.home.httpOptions).subscribe(response => {
      this.semesters = response;
    })

    this.http.get<any>(`${this.authService.apiUrl}/exam`, this.home.httpOptions).subscribe((data: any) => {
      this.examList = data;
      this.examList.forEach((element: any) => {
        let id = element.id;
        this.isPopupExam = false;
      });
      console.log(this.isPopupExam);
    });
  }

  openPopupExam(exam: any) {
    this.isPopupExam = true;
    this.selectedExam = this.examList.filter((examination: any) => examination.id == exam)[0];
    console.log(this.selectedExam);
  }

  closePopupExam(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation(); // Ngăn việc sự kiện click ra ngoài ảnh hưởng đến việc đóng modal
    }
    this.isPopupExam = false;
    this.popupExamIndex = 0; // Reset khi đóng popup
  }

  startExam(examId: any): void {
    const startTime = new Date(this.selectedExam.startTime); // Chuyển đổi startTime sang Date
    const currentTime = new Date(); // Lấy thời gian hiện tại

    if (startTime > currentTime) {
      this.toastr.warning('The exam has not started yet. Please come back later.');
    }
    else {
      this.router.navigate([this.urlService.examDetailPageUrl(examId)]);
    }
  };
}
