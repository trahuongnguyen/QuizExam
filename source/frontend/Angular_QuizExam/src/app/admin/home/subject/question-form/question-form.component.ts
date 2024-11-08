import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from '../../home.component';
import { SubjectComponent } from '../subject.component';
import { forkJoin } from 'rxjs';
import { Title } from '@angular/platform-browser';

interface Answer {
  content: string;
  isCorrect: number;
}

interface QuestionForm {
  content: string;
  subjectId: number;
  chapters: number[];
  levelId: number;
  imageFile?: File | null;
  answers: Answer[];
}

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.css']
})
export class QuestionFormComponent implements OnInit {
  questionForms: QuestionForm[] = [];
  subjects: any;
  subjectId: number = 0;
  subjectName: string = '';
  listChapter: any = [];
  listLevel: any = [];
  
  isPopupChapter: boolean[] = [];
  popupChapterIndex: number = 0;

  searchChapter: string = '';
  filterChapters: any = [];
  tempSelectedChapters: number[] = [];

  constructor(
    private authService: AuthService,
    private titleService: Title,
    private home: HomeComponent,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public subjectComponent: SubjectComponent
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Add New Question');
    this.subjectId = Number(this.activatedRoute.snapshot.params['subjectId']) || 0;
    this.loadData();
    this.initializeQuestion();
  }

  loadData() {
    const subjectRequest = this.http.get<any>(`${this.authService.apiUrl}/subject/${this.subjectId}`, this.home.httpOptions);
    const chapterRequest = this.http.get<any>(`${this.authService.apiUrl}/chapter/${this.subjectId}`, this.home.httpOptions);
    const levelRequest = this.http.get<any>(`${this.authService.apiUrl}/level`, this.home.httpOptions);

    forkJoin([subjectRequest, chapterRequest, levelRequest]).subscribe(([subjectData, chapterData, levelData]) => {
      // Giải mã dữ liệu từ các request
      this.subjects = subjectData; // Lưu dữ liệu subjects
      this.subjectName = this.subjects.name;
      this.listChapter = chapterData; // Lưu dữ liệu chapters
      this.listLevel = levelData; // Lưu dữ liệu levels
    });
  }

  initializeQuestion() {
    this.questionForms = [{
      content: '',
      subjectId: this.subjectId,
      chapters: [],
      levelId: this.listLevel[0]?.id || 1,
      answers: [{ content: '', isCorrect: 0 }, { content: '', isCorrect: 0 }, { content: '', isCorrect: 0 }, { content: '', isCorrect: 0 }]
    }];
    this.isPopupChapter = Array(this.questionForms.length).fill(false);
  }

  getSelectedChaptersNames(question: QuestionForm): string {
    const selectedChapters = this.listChapter.filter((ch: any) => question.chapters.includes(ch.id));
    return selectedChapters.map((ch: any) => `[${ch.name}]`).join(' ') || 'Choose Chapter';
  }

  openPopup(questionIndex: number) {
    this.popupChapterIndex = questionIndex;
    this.isPopupChapter[questionIndex] = true;
    this.tempSelectedChapters = this.questionForms[questionIndex].chapters.slice();
    this.searchChapter = '';
    this.onSearchChange();
  }

  onSearchChange() {
    this.filterChapters = this.listChapter
      .filter((chapter: any) => chapter.name.toLowerCase().includes(this.searchChapter.toLowerCase()));
  }

  toggleChapterSelection(chapterId: number, event: Event) {
    const checkbox = (event.target as HTMLInputElement);

    if (checkbox.checked) {
      // Thêm chapter vào mảng tạm thời nếu checkbox được tick
      this.tempSelectedChapters.push(chapterId);
    }
    else {
      // Xóa chapter khỏi mảng tạm thời nếu checkbox bị bỏ tick
      const index = this.tempSelectedChapters.indexOf(chapterId);
      if (index > -1) {
        this.tempSelectedChapters.splice(index, 1);
      }
    }
  }

  confirmChapterSelection() {
    // Cập nhật chapters cho câu hỏi
    this.questionForms[this.popupChapterIndex].chapters = this.tempSelectedChapters;
    console.log(this.questionForms);
    
    // Đóng popup
    this.closePopupChapter();
  }

  closePopupChapter() {
    this.isPopupChapter[this.popupChapterIndex] = false;
    this.popupChapterIndex = 0;
    this.tempSelectedChapters = [];
  }

  isPopupNotice: boolean = false;

  showPopupNotice() {
    this.isPopupNotice = true;
  }

  closePopupNotice() {
    this.isPopupNotice = false;
  }

  addQuestionForm() {
    this.questionForms.push({
      content: '',
      subjectId: this.subjectId,
      chapters: [],
      levelId: this.listLevel[0]?.id || 1,
      answers: [{ content: '', isCorrect: 0 }, { content: '', isCorrect: 0 }, { content: '', isCorrect: 0 }, { content: '', isCorrect: 0 }]
    });
    this.isPopupChapter.push(false);
    setTimeout(() => document.getElementById(`question-form-${this.questionForms.length - 1}`)?.scrollIntoView({ behavior: 'smooth' }), 0);
  }

  isPopupDeleteQuestion: boolean = false;
  questionIndexToDelete: number | null = null;

  showPopupDeleteQuestion() {
    this.isPopupDeleteQuestion = true;
  }

  closePopupDeleteQuestion() {
    this.questionIndexToDelete = null;
    this.isPopupDeleteQuestion = false;
  }

  confirmDeleteQuestion() {
    if (this.questionIndexToDelete !== null) {
      this.questionForms.splice(this.questionIndexToDelete, 1);
      this.closePopupDeleteQuestion();
    }
  }

  removeQuestionForm(index: number) {
    if (this.questionForms.length > 1) {
      this.questionIndexToDelete = index;
      this.showPopupDeleteQuestion();
    }
    else {
      this.showPopupNotice();
    }
  }

  addAnswer(index: number) {
    this.questionForms[index].answers.push({ content: '', isCorrect: 0 });
  }

  toggleIsCorrect(answer: Answer) {
    answer.isCorrect = answer.isCorrect === 1 ? 0 : 1;
  }

  isPopupDeleteAnswer: boolean = false;
  questionIndexToDeleteAnswer: number | null = null; // Lưu chỉ mục câu hỏi
  answerIndexToDelete: number | null = null; // Lưu chỉ mục câu trả lời
  cannotDeleteMessage: string = ''; // Lưu thông báo khi không thể xóa

  showPopupDeleteAnswer(questionIndex: number, answerIndex: number) {
    const question = this.questionForms[questionIndex];
    this.questionIndexToDeleteAnswer = questionIndex;
    this.answerIndexToDelete = answerIndex;
    this.isPopupDeleteAnswer = true;

    // Kiểm tra nếu câu hỏi có ít hơn hoặc bằng 4 câu trả lời
    if (question.answers.length <= 4) {
      this.cannotDeleteMessage = 'You cannot delete any answer because at least 4 answers are required for each question.';
    }
  }

  closePopupDeleteAnswer() {
    this.questionIndexToDeleteAnswer = null;
    this.answerIndexToDelete = null;
    this.cannotDeleteMessage = '';
    this.isPopupDeleteAnswer = false;
  }

  confirmDeleteAnswer() {
    if (this.questionIndexToDeleteAnswer !== null && this.answerIndexToDelete !== null) {
      this.questionForms[this.questionIndexToDeleteAnswer].answers.splice(this.answerIndexToDelete, 1);
      this.closePopupDeleteAnswer();
    }
  }

  removeAnswer(questionIndex: number, answerIndex: number) {
    this.questionForms[questionIndex].answers.splice(answerIndex, 1);
  }

  chooseImage(event: Event, questionIndex: number) {
    const file = (event.target as HTMLInputElement).files?.[0];
    const imgQuestion = document.getElementById(`imageQuestion${questionIndex}`) as HTMLImageElement;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imgQuestion.src = e.target?.result as string;
        imgQuestion.style.display = 'block';
      };
      reader.readAsDataURL(file);
      this.questionForms[questionIndex].imageFile = file;
    }
  }

  removeImage(questionIndex: number) {
    const imgQuestion = document.getElementById(`imageQuestion${questionIndex}`) as HTMLImageElement;
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    // Xóa ảnh
    this.questionForms[questionIndex].imageFile = null;
    imgQuestion.src = '';
    imgQuestion.style.display = 'none';
    
    // Đặt lại giá trị input file
    if (fileInput) {
        fileInput.value = '';
    }
  }

  contentError: string[] = [];
  answersError: string[][] = [[]];

  validateAnswers(answers: Answer[]): boolean {
    return answers.some(a => a.isCorrect === 1) && answers.some(a => a.isCorrect === 0);
  }

  saveQuestions() {
    this.contentError = [];
    this.answersError = this.questionForms.map(() => []);
    let formData = new FormData();
    let valid = false;
    let errorMessage = '';
    let questionNumber = -1;
  
    for (var i = 0; i < this.questionForms.length; i++) {
      // Kiểm tra nếu câu hỏi chưa có nội dung
      if (!this.questionForms[i].content.trim()) {
        this.contentError[i] = 'Content Question is required';
        valid = true;
      }
  
      // Kiểm tra nếu câu trả lời không có nội dung
      this.questionForms[i].answers.forEach((answer, j) => {
        if (!answer.content.trim()) {
          this.answersError[i][j] = 'Content Answer is required';
          valid = true;
        }
      });

      if (valid) {
        questionNumber = i;
        errorMessage = `Please fill out all fields correctly. (Question ${i + 1})`;
        break;
      }

      // Kiểm tra nếu số lượng câu trả lời < 4
      if (this.questionForms[i].answers.length < 4) {
        errorMessage = `Must have at least 4 answers. (Question ${i + 1})`;
        questionNumber = i;
        valid = true;
        break;
      }
  
      // Kiểm tra nếu không có câu trả lời đúng và sai
      if (!this.validateAnswers(this.questionForms[i].answers)) {
        errorMessage = `Must have at least one correct and one incorrect answer. (Question ${i + 1})`;
        questionNumber = i;
        valid = true;
        break;
      }

      // Kiểm tra câu trả lời giống nhau trong từng câu hỏi
      const answerContents = this.questionForms[i].answers.map(a => a.content.trim());
      const uniqueAnswers = new Set(answerContents);
      if (answerContents.length !== uniqueAnswers.size) {
        errorMessage = `Answers must be unique. (Question ${i + 1})`;
        questionNumber = i;
        valid = true;
        break;
      }
    }
  
    if (valid) {
      this.toastr.error(errorMessage, 'Error', { timeOut: 3000 });
  
      // Di chuyển đến form có lỗi
      setTimeout(() => {
        const questionError = document.getElementById(`question-form-${questionNumber}`);
        if (questionError) {
          questionError.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
  
      return; // Dừng quá trình lưu khi có lỗi
    }
  
    // Nếu không có lỗi, tiếp tục với việc lưu câu hỏi
    const questionsList = this.questionForms.map(question => ({
      content: question.content,
      subjectId: question.subjectId,
      chapters: question.chapters,
      levelId: question.levelId,
      answers: question.answers
    }));
    formData.append('questions', new Blob([JSON.stringify(questionsList)], { type: 'application/json' }));
    this.questionForms.forEach((question) => {
      formData.append('files', question.imageFile || new Blob([]));
    });
  
    this.http.post(`${this.authService.apiUrl}/question`, formData, this.home.httpOptions).subscribe(
      () => {
        this.toastr.success('Questions saved successfully!');
        this.router.navigate([`/admin/home/subject/${this.subjectId}/questionList`]);
      },
      err => {
        this.toastr.error(err.error.message, 'Error');
      }
    );
  }

  isPopupConfirmCancel: boolean = false;

  showPopupConfirmCancel() {
    this.isPopupConfirmCancel = true;
  }

  closePopupConfirmCancel() {
    this.isPopupConfirmCancel = false;
  }

  confirmCancel() {
    this.isPopupConfirmCancel = false;
    this.router.navigate([`/admin/home/subject/${this.subjectId}/questionList`]);
  }
}