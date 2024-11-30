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
import e from 'express';

interface ExamForm {
  name: string;
  code: string;
  duration: number;
  startTime: any;
  endTime: any;
  classes: number[];
  students: number[];
  subjectId: number;
  chapterIds: number[];
  levelIds: number[];
  type: number;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: [
    './../../../../shared/styles/admin/style.css',
    './../../../../shared/styles/admin/steps.css',
    './form.component.css'
  ]
})

export class FormComponent implements OnInit {
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

  subjects: any;
  subjectId: number = 1;
  subjectName: any;

  selectedSubject: number = 1;
  listLevel: any = [];

  isPopupLevel = false;

  _subjectId: any;

  allQuestions: any[] = []; // All questions fetched from API
  listQuestions: any[] = []; // Questions in "List Question"
  examQuestions: any[] = []; // Questions in "Exam"
  searchTextList: string = '';
  searchTextExam: string = '';

  
  examsForm: ExamForm = {
    name: '',
    code: '',
    duration: 40,
    startTime: "",
    endTime: "",
    classes: [],
    students: [],
    subjectId: 1,
    chapterIds: [],
    levelIds: [],
    type: 0
  };
  checkedStates: any;

  typeExam: number = 0;

  createdExam: any;

  ngOnInit(): void {
    this.titleService.setTitle('Create Exam');
    this.http.get<any>(`${this.authService.apiUrl}/subject`, this.home.httpOptions).subscribe(response => {
      this.subjects = response;
      console.log(this.subjects);
      this.subjectName = this.subjects[0].name;
    });
    this.initializeLevel();
    this.fetchQuestions();
  }

  nextStep(): void {
    this.typeExam = this.examsForm.type;
    if (this.typeExam == 0) {
      this.isPopupLevel = true;
    }
  }

  backStep(): void {
    this.typeExam = 0;
  }

  createExam() {
    const exam = {
      name: this.examsForm.name,
      duration: this.examsForm.duration,
      startTime: this.examsForm.startTime,
      endTime: this.examsForm.endTime,
      subjectId: this.examsForm.subjectId,
      levels: this.levelIdModel
    };

    if (!this.validateLevel()) {
      this.http.post(`${this.authService.apiUrl}/exam`, exam, this.home.httpOptions).subscribe(
        response => {
          this.toastr.success('Edit Exam Successful!', 'Success', {
            timeOut: 2000,
          });
          this.createdExam = response;
          this.examComponent.step = true;
          this.router.navigate([this.urlService.addStudentForExamlUrl(this.createdExam.id)]);
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
  }

  levelId: { [key: string]: number; } = {};
  levelIdModel: { [key: string]: number; } = {};

  initializeLevel(): void {
    this.http.get<any>(`${this.authService.apiUrl}/level`, this.home.httpOptions).subscribe((data: any) => {
      this.listLevel = data;
      this.listLevel.forEach((element: any) => {
        this.levelId[element.id as string] = 0;
        this.levelIdModel[element.id as string] = 0;
        console.log(this.levelId);
      });
      console.log(this.listLevel);
    }, error => {
      console.error('Error fetching levels:', error);
    });
  }

  findLevelById(id: string) {
    return this.listLevel.find((level: any) => level.id == (id as unknown as number))?.name;
  }

  selectSubject(subject: any): void {
    this.subjectId = subject.target.value;
    this.subjectName = this.subjects.find((s: any) => s.id == this.subjectId).name;
  }

  openPopupLevel() {
    this.isPopupLevel = true;
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

  errorMessageLevel: { [key: string]: string } = {};

  validateLevel(): boolean {
    var flag = false;
    var totalQuestions = 0;
    this.listLevel.forEach((element: any) => {
      if (this.levelId[element.id as string] < 0) {
        this.errorMessageLevel[element.id] = "Question number cannot be negative.";
        flag = true;
      }
      else {
        this.errorMessageLevel[element.id] = "";
      }
      totalQuestions += this.levelId[element.id as string];
    });

    if (totalQuestions < 16 || totalQuestions > 25) {
      this.toastr.error('Total of number questions must be between 16 and 25 (Level).', 'Error', {
        timeOut: 2000,
      });
      flag = true;
    }
    return flag;
  }

  selectedLevelsText: string = '';

  closePopup(): void {
    this.isPopupLevel = false;
    this.listLevel.forEach((element: any) => {
      this.levelId[element.id as string] = this.levelIdModel[element.id as string];
      console.log(this.levelId);
    });
  }

  confirmLevel(): void {
    if (this.validateLevel()) {
      return;
    }

    // Tạo chuỗi thông tin về số câu hỏi của các level
    this.selectedLevelsText = this.listLevel.map((level: any) =>
      `${level.name}: ${this.levelId[level.id]}`
    ).join(', ');  // Tạo chuỗi "EASY: 10, MEDIUM: 6, HARD: 0"
    this.listLevel.forEach((element: any) => {
      this.levelIdModel[element.id as string] = this.levelId[element.id as string];
      console.log(this.levelId);
    });

    this.isPopupLevel = false;
  }

  fetchQuestions(): void {
    this.http.get<any>(`${this.authService.apiUrl}/question/1`, this.home.httpOptions).subscribe((data: any) => {
      this.listQuestions = data;
    });
  }

  // Filtered questions for "List Question"
  get filteredListQuestions(): any[] {
    return this.listQuestions.filter((q) =>
      q.content.toLowerCase().includes(this.searchTextList.toLowerCase())
    );
  }

  // Filtered questions for "Exam"
  get filteredExamQuestions(): any[] {
    return this.examQuestions.filter((q) =>
      q.content.toLowerCase().includes(this.searchTextExam.toLowerCase())
    );
  }

  moveToExam(question: any): void {
    const index = this.listQuestions.findIndex((q) => q.id == question.id);
    console.log(index);
    if (index !== -1) {
      this.examQuestions.push(this.listQuestions[index]); // Thêm vào Exam
      this.listQuestions.splice(index, 1); // Xóa khỏi List Question
    }
  }
  
  moveToList(question: any): void {
    const index = this.examQuestions.findIndex((q) => q.id == question.id);
    console.log(index);
    if (index !== -1) {
      this.listQuestions.push(this.examQuestions[index]); // Thêm vào List Question
      this.examQuestions.splice(index, 1); // Xóa khỏi Exam
    }
  }

}