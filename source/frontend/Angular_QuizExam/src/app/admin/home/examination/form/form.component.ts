
import { ExaminationComponent } from '../examination.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from '../../home.component';

interface ExamForm {
  name: string; // Thuộc tính để lưu nội dung câu hỏi
  duration: number; // Thuộc tính để lưu ID chủ đề
  startTime: Date; // Thuộc tính để lưu chapters
  endTime: Date; // Thuộc tính để lưu levelId
  classes: number[];
  students: number[];
  subject: number;
  chapters: number[];

}
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})

export class FormComponent implements OnInit {
  constructor(private authService: AuthService, private home: HomeComponent, private http: HttpClient, public toastr: ToastrService, private router: Router, private activatedRoute: ActivatedRoute, public examComponent: ExaminationComponent) { }

  subjects: any;
  subjectId: number = 1;
  subjectName: any;
  listChapter: any;

  isPopupStudent = false;
  isPopupClass = false;
  isPopupChapter = false;
  popupChapterIndex: number = 0;

  selectedSubject: number = 1;

  listClass: any = [];
  listStudent: any = [];

  //classList: number[] = [];

  examsForm: ExamForm = {
    name: '', // Thuộc tính để lưu nội dung câu hỏi
    duration: 0,// Thuộc tính để lưu ID chủ đề
    startTime: new Date(), // Thuộc tính để lưu chapters
    endTime: new Date(), // Thuộc tính để lưu levelId
    classes: [],
    students: [],
    subject: 1,
    chapters: []

  };

  ngOnInit(): void {
    //this.subjectId = Number(this.activatedRoute.snapshot.params['subjectId']) ?? 0;
    this.http.get<any>(`${this.authService.apiUrl}/subject`, this.home.httpOptions).subscribe(response => {
      this.subjects = response;
    });
    this.initializeChapter(this.subjectId);

    this.http.get<any>(`${this.authService.apiUrl}/class`, this.home.httpOptions).subscribe(response => {
      this.listClass = response;
    });

    this.http.get<any>(`${this.authService.apiUrl}/studentManagement`, this.home.httpOptions).subscribe(response => {
      this.listStudent = response;
    });


  }

  initializeChapter(subject: number): void {
    this.http.get<any>(`${this.authService.apiUrl}/chapter/${subject}`, this.home.httpOptions).subscribe((data: any) => {
      this.listChapter = data;
    });
  }
  selectSubject(subject: any): void {
    this.selectedSubject = subject.target.value;
    this.subjectId = this.selectedSubject;
    // Thực hiện các logic nếu cần thiết khi chọn Sem
    // this.reloadTable(this.selectedSem);
    console.log('Selected Sem:', this.selectedSubject);
    this.initializeChapter(this.selectedSubject);
  }

  openPopupChapter() {
    this.isPopupChapter = true;
    this.isPopupClass = false;
    this.isPopupStudent = false;
  }
  openPopupStudent() {
    this.isPopupChapter = false;
    this.isPopupClass = false;
    this.isPopupStudent = true;
  }
  openPopupClass() {
    this.isPopupChapter = false;
    this.isPopupClass = true;
    this.isPopupStudent = false;
  }

  toggleClassSelection(classId: number, event: Event) {
    const checkbox = (event.target as HTMLInputElement);

    if (checkbox.checked) {
      this.examsForm.classes.push(classId);
    } else {
      this.examsForm.classes = this.examsForm.classes.filter(id => id !== classId);
    }

    console.log(this.examsForm.classes);
  }

  // Hàm này được gọi khi người dùng nhấn checkbox
  toggleChapterSelection(chapterId: number, event: Event) {
    const checkbox = (event.target as HTMLInputElement);

    if (checkbox.checked) {
      this.examsForm.chapters.push(chapterId);
    } else {
      this.examsForm.chapters = this.examsForm.chapters.filter(id => id !== chapterId);
    }

    console.log(this.examsForm.chapters);
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

  closePopupClass(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation(); // Ngăn việc sự kiện click ra ngoài ảnh hưởng đến việc đóng modal
    }
    this.isPopupClass = false;
    this.popupChapterIndex = 0; // Reset khi đóng popup
  }
  closePopupStudent(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation(); // Ngăn việc sự kiện click ra ngoài ảnh hưởng đến việc đóng modal
    }
    this.isPopupStudent = false;
    this.popupChapterIndex = 0; // Reset khi đóng popup
  }
  closePopupChapter(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation(); // Ngăn việc sự kiện click ra ngoài ảnh hưởng đến việc đóng modal
    }
    this.isPopupChapter = false;
    this.popupChapterIndex = 0; // Reset khi đóng popup
  }

}
