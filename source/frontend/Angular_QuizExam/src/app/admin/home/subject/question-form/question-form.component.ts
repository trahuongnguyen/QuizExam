import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from '../../home.component';
import { SubjectComponent } from '../subject.component';
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
  imageFile?: File | null; // Thông tin file ảnh
  answers: Answer[]; // Danh sách các câu trả lời
}

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrl: './question-form.component.css'
})

export class QuestionFormComponent implements OnInit {
  constructor(private authService: AuthService, private home: HomeComponent, private http: HttpClient, public toastr: ToastrService, private router: Router, private activatedRoute: ActivatedRoute, public subjectComponent: SubjectComponent) { }

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
        imageFile: null,
        answers: [
          { content: '', isCorrect: 0 },
          { content: '', isCorrect: 0 },
          { content: '', isCorrect: 0 },
          { content: '', isCorrect: 0 }
        ]
      }
    ];
  }

  getSelectedChaptersNames(question: QuestionForm): string {
    const selectedChapters = this.listChapter.filter((chapter: any) => question.chapters.includes(chapter.id));
    return selectedChapters.map((chapter: any) => `[${chapter.name}]`).join(' ');
  }

  isPopupChapter = false;
  popupChapterIndex: number = 0;

  openPopup(questionIndex: number) {
    this.popupChapterIndex = questionIndex;
    this.isPopupChapter = true;
    console.log(this.questionForms[questionIndex].chapters);
  }

  // Hàm này được gọi khi người dùng nhấn checkbox
  toggleChapterSelection(questionIndex: number, chapterId: number, event: Event) {
    const checkbox = (event.target as HTMLInputElement);

    if (!this.questionForms[questionIndex].chapters) {
      this.questionForms[questionIndex].chapters = [];
    }

    if (checkbox.checked) {
      this.questionForms[questionIndex].chapters.push(chapterId);
    } else {
      this.questionForms[questionIndex].chapters = this.questionForms[questionIndex].chapters.filter(id => id !== chapterId);
    }

    console.log(this.questionForms[questionIndex].chapters);
  }

  closePopup(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation(); // Ngăn việc sự kiện click ra ngoài ảnh hưởng đến việc đóng modal
    }
    this.isPopupChapter = false;
    this.popupChapterIndex = 0; // Reset khi đóng popup
    this.isCancelPopup = false;
  }

  addQuestionForm() {
    const newQuestionIndex = this.questionForms.length;
    
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

    // Cuộn xuống form mới thêm
    setTimeout(() => {
      const newQuestionForm = document.getElementById(`question-form-${newQuestionIndex}`);
      if (newQuestionForm) {
          newQuestionForm.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
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
    console.log('Current isCorrect value:', answer.isCorrect); // In ra giá trị
  }

  removeAnswer(questionIndex: number, answerIndex: number) {
    this.questionForms[questionIndex].answers.splice(answerIndex, 1);
  }

  chooseImage(event: Event, questionIndex: number) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;

    const imgQuestion = document.getElementById(`imageQuestion${questionIndex}`) as HTMLImageElement;
    const imgContainer = imgQuestion.parentElement; // Lấy phần tử cha của img

    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        imgQuestion.src = loadEvent.target?.result as string;
        imgQuestion.style.display = 'block';
      };
      reader.readAsDataURL(file);

      // Đánh dấu là đã chọn ảnh và thêm lớp ẩn border
      this.questionForms[questionIndex].imageFile = file; // Lưu file vào đối tượng
      imgContainer?.classList.add('hidden-border'); // Thêm lớp để ẩn border
    } else {
      imgContainer?.classList.remove('hidden-border'); // Xóa lớp nếu không có ảnh
    }
  }

  removeImage(questionIndex: number) {
    this.questionForms[questionIndex].imageFile = null; // Xóa thông tin file
    const imgQuestion = document.getElementById(`imageQuestion${questionIndex}`) as HTMLImageElement;
    imgQuestion.src = ''; // Đặt lại src của ảnh
    imgQuestion.style.display = 'none'; // Ẩn ảnh đi
  }

  saveQuestions() {
    const formData = new FormData();
  
    // Tạo danh sách câu hỏi
    const questionsList = this.questionForms.map(question => ({
      content: question.content,
      image: null, // Hoặc giá trị tương ứng nếu có ảnh
      subjectId: question.subjectId,
      chapters: question.chapters,
      levelId: question.levelId,
      answers: question.answers.map(answer => ({
        content: answer.content,
        isCorrect: answer.isCorrect
      }))
    }));
  
    // Thêm danh sách câu hỏi vào FormData
    formData.append('questions', new Blob([JSON.stringify(questionsList)], { type: 'application/json' }));
  
    // Thêm các file vào FormData
    this.questionForms.forEach((question) => {
      if (question.imageFile) {
          formData.append('files', question.imageFile); // Sử dụng file đã lưu
      }
      else {
        formData.append('files', new Blob([]));
      }
    });
  
    // Gửi yêu cầu POST
    this.http.post(`${this.authService.apiUrl}/question`, formData, this.home.httpOptions).subscribe(
      response => {
        this.toastr.success('Questions saved successfully!', 'Success', {
          timeOut: 2000,
        });
        console.log('Questions saved successfully:', response);
        this.router.navigate([`/admin/home/subject/${this.subjectId}/questionList`]);
      },
      error => {
        this.toastr.error('Error saving questions.', 'Error', {
          timeOut: 2000,
        });
        console.error('Error saving questions:', error);
      }
    );
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