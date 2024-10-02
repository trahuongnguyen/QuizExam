import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from '../../home.component';
import { SubjectComponent } from '../subject.component';

interface Answer {
  content: string; // Đổi từ text thành content
  isCorrect: number; // Thêm thuộc tính isCorrect
}

interface QuestionForm {
  content: string; // Thuộc tính để lưu nội dung câu hỏi
  subjectId: number; // Thuộc tính để lưu ID chủ đề
  chapters: number[]; // Thuộc tính để lưu chapters
  levelId: number; // Thuộc tính để lưu levelId
  imageFile?: File | null; // Thông tin file ảnh
  answers: Answer[]; // Danh sách các câu trả lời
}

@Component({
  selector: 'app-question-update',
  templateUrl: './question-update.component.html',
  styleUrl: './question-update.component.css'
})

export class QuestionUpdateComponent implements OnInit {
  constructor(private authService: AuthService, private home: HomeComponent, private http: HttpClient, public toastr: ToastrService, private router: Router, private activatedRoute: ActivatedRoute, public subjectComponent: SubjectComponent) { }

  subjects: any;
  subjectId: number = 0;
  subjectName: any;

  questionId: number = 0;
  listChapter: any;
  listLevel = [
    { id: 1, name: 'Easy', point: 1 },
    { id: 2, name: 'Hard', point: 2 }
  ];
  
  question: any;

  ngOnInit(): void {
    this.subjectId = Number(this.activatedRoute.snapshot.params['subjectId']) ?? 0;

    this.http.get<any>(`${this.authService.apiUrl}/subject/${this.subjectId}`, this.home.httpOptions).subscribe((data: any) => {
      this.http.get<any>(`${this.authService.apiUrl}/subject/sem/${data.sem.id}`, this.home.httpOptions).subscribe(data1 => {
        this.subjects = data1;
        for (let sub of this.subjects) {
          if (sub.id == this.subjectId) {
            this.subjectName = sub.name;
          }
        }
      });
    });

    this.questionId = Number(this.activatedRoute.snapshot.params['id']) ?? 0;

    this.http.get<any>(`${this.authService.apiUrl}/question/question-detail/${this.questionId}`, this.home.httpOptions).subscribe(data2 => {
      this.question = data2;
      console.log(this.question);
    });

    this.http.get<any>(`${this.authService.apiUrl}/chapter/${this.subjectId}`, this.home.httpOptions).subscribe((data: any) => {
      this.listChapter = data;
    });
  }

  isPopupChapter = false;
  popupChapterIndex: number = 0;

  openPopup() {
    this.isPopupChapter = true;
  }

  // Hàm này được gọi khi người dùng nhấn checkbox
  toggleChapterSelection(questionIndex: number, chapterId: number, event: Event) {
    const checkbox = (event.target as HTMLInputElement);

    if (!this.question.chapters) {
      this.question.chapters = [];
    }

    if (checkbox.checked) {
      this.question.chapters.push(chapterId);
    } else {
      this.question.chapters = this.question.chapters.filter((id: any) => id !== chapterId);
    }

    console.log(this.question.chapters);
  }

  closePopup(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation(); // Ngăn việc sự kiện click ra ngoài ảnh hưởng đến việc đóng modal
    }
    this.isPopupChapter = false;
    this.popupChapterIndex = 0; // Reset khi đóng popup
    this.isCancelPopup = false;
  }

  addAnswer() {
    this.question.answers.push({ content: '', isCorrect: 0 }); // Thêm câu trả lời mới
  }

  toggleIsCorrect(answer: Answer) {
    answer.isCorrect = answer.isCorrect === 1 ? 0 : 1; // Chuyển đổi giữa 0 và 1
    console.log('Current isCorrect value:', answer.isCorrect); // In ra giá trị
  }

  removeAnswer(answerIndex: number) {
    this.question.answers.splice(answerIndex, 1);
  }

  previewImage(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;

    const imgPreview = document.getElementById(`imagePreview`) as HTMLImageElement;
    const imgContainer = imgPreview.parentElement; // Lấy phần tử cha của img

    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        imgPreview.src = loadEvent.target?.result as string;
        imgPreview.style.display = 'block';
      };
      reader.readAsDataURL(file);

      // Đánh dấu là đã chọn ảnh và thêm lớp ẩn border
      this.question.imageFile = file; // Lưu file vào đối tượng
      imgContainer?.classList.add('hidden-border'); // Thêm lớp để ẩn border
    } else {
      imgContainer?.classList.remove('hidden-border'); // Xóa lớp nếu không có ảnh
    }
  }

  removeImage() {
    this.question.imageFile = null; // Xóa thông tin file
    const imgPreview = document.getElementById(`imagePreview`) as HTMLImageElement;
    imgPreview.src = ''; // Đặt lại src của ảnh
    imgPreview.style.display = 'none'; // Ẩn ảnh đi
  }

  isCancelPopup: boolean = false;
  
  cancel() {
    this.isCancelPopup = true;
  }

  confirmCancel() {
    this.isCancelPopup = false;
    this.router.navigate([`/admin/home/subject/${this.subjectId}/questionList`]);
  }
}