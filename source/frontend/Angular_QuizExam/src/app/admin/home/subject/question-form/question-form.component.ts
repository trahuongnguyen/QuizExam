import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from '../../home.component';
declare var $: any;

interface Answer {
  text: string;
}

interface QuestionForm {
  answers: Answer[];
  imageSelected?: boolean;
  // thêm các thuộc tính khác nếu cần
}

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrl: './question-form.component.css'
})

export class QuestionFormComponent implements OnInit {
  constructor(private authService: AuthService, private home: HomeComponent, private http: HttpClient, public toastr: ToastrService, private router: Router, private activatedRoute: ActivatedRoute) { }

  chapters = [
    { id: 1, name: 'Chapter 1'},
    { id: 2, name: 'Chapter 2'},
    { id: 3, name: 'Chapter 3'},
    { id: 4, name: 'Chapter 4'},
    { id: 5, name: 'Chapter 5'},
    { id: 6, name: 'Chapter 6'},
    { id: 7, name: 'Chapter 7'}
  ];
  
  levels = [
    { point: 1, name: 'Easy' },
    { point: 2, name: 'Hard' }
  ];

  questionForms: QuestionForm[] = [
    {
      answers: [
        { text: '' },
        { text: '' },
        { text: '' },
        { text: '' }
      ]
    }
  ];

  subjects: any;
  subjectId: any;
  subjectName: any;

  isPopupChapter = false;

  ngOnInit(): void {
    this.subjectId = Number(this.activatedRoute.snapshot.params['subjectId']) ?? 0;

    this.http.get<any>(`${this.authService.apiUrl}/subject/${this.subjectId}`, this.home.httpOptions).subscribe((data: any) => {
      this.http.get<any>(`${this.authService.apiUrl}/subject/sem/${data.sem.id}`, this.home.httpOptions).subscribe(response => {
        this.subjects = response;
        for (let sub of this.subjects) {
          if (sub.id == this.subjectId) {
            this.subjectName = sub.name;
          }
        }
      });
    });
  }

  showChapterOptions = false;

  toggleChapterOptions() {
      this.showChapterOptions = !this.showChapterOptions; // Chuyển trạng thái hiển thị
  }

  openPopup() {
    this.isPopupChapter = true;
  }

  addQuestionForm() {
    this.questionForms.push({
      answers: [
        { text: '' },
        { text: '' },
        { text: '' },
        { text: '' }
      ]
    });
  }

  removeQuestionForm(index: number) {
    if (this.questionForms.length > 1) {
      this.questionForms.splice(index, 1);
    } else {
      alert("At least one question must remain.");
    }
  }

  addAnswer(index: number) {
    this.questionForms[index].answers.push({ text: '' }); // Thêm câu trả lời mới
  }

  removeAnswer(questionIndex: number, answerIndex: number) {
    this.questionForms[questionIndex].answers.splice(answerIndex, 1);
  }

  previewImage(event: Event, questionIndex: number) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;

    const imgPreview = document.getElementById(`imagePreview${questionIndex}`) as HTMLImageElement;
    const imgContainer = imgPreview.parentElement; // Lấy phần tử cha của img

    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        imgPreview.src = loadEvent.target?.result as string;
        imgPreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
      console.log(file.name);

      // Đánh dấu là đã chọn ảnh và thêm lớp ẩn border
      this.questionForms[questionIndex].imageSelected = true;
      imgContainer?.classList.add('hidden-border'); // Thêm lớp để ẩn border
    } else {
      imgContainer?.classList.remove('hidden-border'); // Xóa lớp nếu không có ảnh
    }
  }

  removeImage(questionIndex: number) {
    this.questionForms[questionIndex].imageSelected = false; // Đánh dấu là chưa chọn ảnh
    const imgPreview = document.getElementById(`imagePreview${questionIndex}`) as HTMLImageElement;
    imgPreview.src = ''; // Đặt lại src của ảnh
    imgPreview.style.display = 'none'; // Ẩn ảnh đi
  }

  closePopup(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation(); // Ngăn việc sự kiện click ra ngoài ảnh hưởng đến việc đóng modal
    }
    this.isPopupChapter = false;
  }
}