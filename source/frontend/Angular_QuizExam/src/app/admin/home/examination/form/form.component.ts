
import { ExaminationComponent } from '../examination.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from '../../home.component';
declare var $: any;

interface ExamForm {
  name: string; // Thuộc tính để lưu nội dung câu hỏi
  duration: number; // Thuộc tính để lưu ID chủ đề
  startTime: any; // Thuộc tính để lưu chapters
  endTime: any; // Thuộc tính để lưu levelId
  classes: number[];
  students: number[];
  subjectId: number;
  chapterIds: number[];
}
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})

export class FormComponent implements OnInit {
  constructor(private authService: AuthService, private home: HomeComponent, private http: HttpClient, public toastr: ToastrService, private router: Router, private activatedRoute: ActivatedRoute, public examComponent: ExaminationComponent) {

  }


  subjects: any;
  subjectId: number = 1;
  subjectName: any;

  selectedSubject: number = 1;

  //classList: number[] = [];

  examsForm: ExamForm = {
    name: '',
    duration: 30,
    startTime: new Date(),
    endTime: new Date(),
    classes: [],
    students: [],
    subjectId: 1,
    chapterIds: []
  };
  checkedStates: any;

  createdExam: any;

  
  createExam() {
    const exam = {
      name: this.examsForm.name,
      duration: this.examsForm.duration,
      startTime: this.examsForm.startTime,
      endTime: this.examsForm.endTime,
      subjectId: this.examsForm.subjectId,
    };
    this.http.post(`${this.authService.apiUrl}/exam`, exam, this.home.httpOptions).subscribe(
      response => {
        this.toastr.success('Create exam Successful!', 'Success', {
          timeOut: 2000,
        });
        this.createdExam = response;
        this.examComponent.step = true;
        this.router.navigate(['/admin/home/exam/addStudent/1/1']);
      },
      error => {
        if (error.status === 401) {
          this.toastr.error('Unauthorized', 'Failed', {
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

  ngOnInit(): void {
    //this.subjectId = Number(this.activatedRoute.snapshot.params['subjectId']) ?? 0;
    this.http.get<any>(`${this.authService.apiUrl}/subject`, this.home.httpOptions).subscribe(response => {
      this.subjects = response;
    });
  }

  selectSubject(subject: any): void {
    this.selectedSubject = subject.target.value;
    this.subjectId = this.selectedSubject;
    this.examsForm.chapterIds = [];
    // Thực hiện các logic nếu cần thiết khi chọn Sem
    // this.reloadTable(this.selectedSem);
    console.log('Selected Sem:', this.selectedSubject);
  }

  toggleStudentSelection(studentId: number, event: Event) {
    const checkbox = (event.target as HTMLInputElement);

    if (checkbox.checked) {
      this.examsForm.students.push(studentId);
    } else {
      this.examsForm.students = this.examsForm.students.filter(id => id !== studentId);
    }

    console.log(this.examsForm.students);
  }
}