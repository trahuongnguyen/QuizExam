import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from '../../home.component';
declare var $: any;

interface Answer {
  content: string; // Đổi từ text thành content
  isCorrect: number; // Thêm thuộc tính isCorrect
}

interface QuestionForm {
  content: string; // Thuộc tính để lưu nội dung câu hỏi
  subjectId: number; // Thuộc tính để lưu ID chủ đề
  chapters: number[]; // Thuộc tính để lưu chapters
  levelId: number; // Thuộc tính để lưu levelId
  answers: Answer[]; // Danh sách các câu trả lời
  imageSelected?: boolean;
}

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrl: './question-form.component.css'
})

export class QuestionFormComponent implements OnInit {
  constructor(private authService: AuthService, private home: HomeComponent, private http: HttpClient, public toastr: ToastrService, private router: Router, private activatedRoute: ActivatedRoute) { }

  subjects: any;
  subjectId: number = 0;
  subjectName: any;

  listChapter: any;
  listLevel = [
    { id: 1, name: 'Easy', point: 1 },
    { id: 2, name: 'Hard', point: 2 }
  ];
  
  questionForms: QuestionForm[] = [];

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

    this.http.get<any>(`${this.authService.apiUrl}/chapter/${this.subjectId}`, this.home.httpOptions).subscribe((data: any) => {
      this.listChapter = data;
    });

    this.initializeQuestion();
  }

  initializeQuestion(): void {
    this.questionForms = [
      {
        content: '',
        subjectId: this.subjectId,
        chapters: [],
        levelId: this.listLevel[0].id,
        answers: [
          { content: '', isCorrect: 0 },
          { content: '', isCorrect: 0 },
          { content: '', isCorrect: 0 },
          { content: '', isCorrect: 0 }
        ]
      }
    ];
  }

  isPopupChapter = false;

  selectedChapterIds: number[] = []; // Biến để lưu chapter đã chọn trong popup

  openPopup(questionIndex: number) {
    this.selectedChapterIds = [...this.questionForms[questionIndex].chapters];
    this.isPopupChapter = true;
  }

  // Hàm này được gọi khi người dùng nhấn checkbox
  toggleChapterSelection(questionIndex: number, chapterId: number, event: Event) {
    const checkbox = (event.target as HTMLInputElement);

    if (checkbox.checked) {
      this.selectedChapterIds.push(chapterId);
    } else {
      this.selectedChapterIds = this.selectedChapterIds.filter(id => id !== chapterId);
    }

    console.log(this.selectedChapterIds);
  }

  // Hàm xử lý khi nhấn nút OK
  onConfirmSelection(questionIndex: number) {
    this.questionForms[questionIndex].chapters = [...this.selectedChapterIds];
    console.log('Updated selected chapter IDs for question:', this.questionForms[questionIndex].chapters);
    this.closePopup();
  }

  addQuestionForm() {
    this.questionForms.push({
      content: '',
      subjectId: this.subjectId,
      chapters: [],
      levelId: this.listLevel[0].id,
      answers: [
        { content: '', isCorrect: 0 },
        { content: '', isCorrect: 0 },
        { content: '', isCorrect: 0 },
        { content: '', isCorrect: 0 }
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
    this.questionForms[index].answers.push({ content: '', isCorrect: 0 }); // Thêm câu trả lời mới
  }

  toggleIsCorrect(answer: Answer) {
    answer.isCorrect = answer.isCorrect === 1 ? 0 : 1; // Chuyển đổi giữa 0 và 1
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

  saveQuestions() {
    const payload = this.questionForms.map(question => ({
      content: question.content,
      subjectId: question.subjectId,
      chapters: this.selectedChapterIds,
      levelId: question.levelId,
      answers: question.answers.map(answer => ({
        content: answer.content,
        isCorrect: answer.isCorrect
      }))
    }));

    this.http.post<any>(`${this.authService.apiUrl}/question`, payload, this.home.httpOptions).subscribe(
      response => {
        this.toastr.success('Questions saved successfully!', 'Success', {
          timeOut: 2000,
        });
        console.log('Questions saved successfully:', response);
      },
      error => {
        this.toastr.error('Error saving questions.', 'Error', {
          timeOut: 2000,
        });
        console.error('Error saving questions:', error);
      }
    );
  }
}