import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Title } from '@angular/platform-browser';
import { AdminComponent } from '../../../admin.component';
import { HomeComponent } from '../../home.component';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { UrlService } from '../../../../shared/service/url.service';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { Chapter, Level, Question, Subject } from '../../../../shared/models/models';
declare var $: any;

interface Answer {
  content: string;
  isCorrect: number;
}

interface QuestionForm {
  content: string;
  chapters: number[];
  levelId: number;
  imageFile?: File | null;
  answers: Answer[];
}

@Component({
  selector: 'app-question-update',
  templateUrl: './question-update.component.html',
  styleUrls: [
    './../../../../shared/styles/admin/style.css',
    './../../../../shared/styles/admin/question-form.css',
    './question-update.component.css'
  ]
})

export class QuestionUpdateComponent implements OnInit {
  question: any;
  questionId: number = 0;
  questionForm: QuestionForm = {
    content: '',
    chapters: [],
    levelId: 0,
    imageFile: null,
    answers: []
  };
  changeImg: boolean = false;
  
  subjects: any;
  subjectId: number = 0;
  subjectName: string = '';
  listChapter: any = [];
  listLevel: any = [];
  
  isPopupChapter: boolean = false;

  searchChapter: string = '';
  filterChapters: any = [];
  tempSelectedChapters: number[] = [];

  dialogTitle: string = '';
  dialogMessage: string = '';
  isConfirmationPopup: boolean = false;

  constructor(
    private authService: AuthService,
    private titleService: Title,
    public admin: AdminComponent,
    private home: HomeComponent,
    private http: HttpClient,
    private toastr: ToastrService,
    public urlService: UrlService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Edit Question');
    this.subjectId = Number(this.activatedRoute.snapshot.params['subjectId']) || 0;
    this.questionId = Number(this.activatedRoute.snapshot.params['id']) ?? 0;
    this.initializeQuestion();
    this.loadData();
  }

  getSubjectByIdApi(id: number): Observable<Subject> {
    return this.http.get<Subject>(`${this.authService.apiUrl}/subject/${id}`, this.home.httpOptions);
  }

  getChapterListBySubjectIdApi(id: number): Observable<Chapter> {
    return this.http.get<Chapter>(`${this.authService.apiUrl}/chapter/${id}`, this.home.httpOptions);
  }

  getLevelListApi(id: number): Observable<Level> {
    return this.http.get<Level>(`${this.authService.apiUrl}/level`, this.home.httpOptions);
  }

  getQuestionApi(id: number): Observable<Question> {
    return this.http.get<Question>(`${this.authService.apiUrl}/question/detail/${id}`, this.home.httpOptions);
  }

  loadData() {
    const subjectRequest = this.http.get<any>(`${this.authService.apiUrl}/subject/${this.subjectId}`, this.home.httpOptions);
    const chapterRequest = this.http.get<any>(`${this.authService.apiUrl}/chapter/${this.subjectId}`, this.home.httpOptions);
    const levelRequest = this.http.get<any>(`${this.authService.apiUrl}/level`, this.home.httpOptions);
    const questionRequest = this.http.get<any>(`${this.authService.apiUrl}/question/detail/${this.questionId}`, this.home.httpOptions);

    forkJoin([subjectRequest, chapterRequest, levelRequest, questionRequest]).subscribe(([subjectData, chapterData, levelData, questionData]) => {
      // Giải mã dữ liệu từ các request
      this.subjects = subjectData; // Lưu dữ liệu subjects
      this.subjectName = this.subjects.name;
      this.listChapter = chapterData; // Lưu dữ liệu chapters
      this.listLevel = levelData; // Lưu dữ liệu levels
      this.question = questionData;

      this.questionForm.content = this.question.content;
      this.questionForm.imageFile = this.question.image;
      this.questionForm.levelId = this.question.level.id;
      this.questionForm.answers = this.question.answers;

      for (let chapter of this.question.chapters) {
        this.questionForm.chapters.push(chapter.id);
      }
    });
  }

  initializeQuestion() {
    this.questionForm = {
      content: '',
      chapters: [],
      levelId: 0,
      imageFile: null,
      answers: []
    };
  }

  getSelectedChaptersNames(): string {
    const selectedChapters = this.listChapter.filter((ch: any) => this.questionForm.chapters.includes(ch.id));
    return selectedChapters.map((ch: any) => `[${ch.name}]`).join(' ') || 'Choose Chapter';
  }

  openPopup() {
    this.isPopupChapter = true;
    this.tempSelectedChapters = this.questionForm.chapters.slice();
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
    this.questionForm.chapters = this.tempSelectedChapters;
    
    // Đóng popup
    this.closePopupChapter();
  }

  closePopupChapter() {
    this.isPopupChapter = false;
    this.tempSelectedChapters = [];
  }

  addAnswer() {
    this.questionForm.answers.push({ content: '', isCorrect: 0 });
  }

  toggleIsCorrect(answer: Answer) {
    answer.isCorrect = answer.isCorrect === 1 ? 0 : 1;
  }

  isPopupDeleteAnswer: boolean = false;
  answerIndexToDelete: number | null = null; // Lưu chỉ mục câu trả lời

  showPopupDeleteAnswer(answerIndex: number) {
    const question = this.questionForm;

    // Kiểm tra nếu câu hỏi có nhiều hơn 4 câu trả lời
    if (question.answers.length > 4) {
      this.answerIndexToDelete = answerIndex;
      this.dialogTitle = 'Are you sure?'
      this.dialogMessage = 'Do you really want to delete this answer? This action cannot be undone.';
      this.isConfirmationPopup = true;
    }
    else {
      this.dialogTitle = 'Notice'
      this.dialogMessage = 'You cannot delete any answer because at least 4 answers are required for each question.';
      this.isConfirmationPopup = false;
    }
    this.isPopupDeleteAnswer = true;
  }

  confirmDeleteAnswer() {
    if (this.answerIndexToDelete !== null) {
      this.questionForm.answers.splice(this.answerIndexToDelete, 1);
      this.closePopupDialog();
      this.toastr.success('The answer has been deleted.', '', { timeOut: 2000 });
    }
  }

  removeAnswer(answerIndex: number) {
    this.questionForm.answers.splice(answerIndex, 1);
  }

  chooseImage(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    const imgQuestion = document.getElementById(`image-question`) as HTMLImageElement;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imgQuestion.src = e.target?.result as string;
        imgQuestion.style.display = 'block';
      };
      reader.readAsDataURL(file);
      this.questionForm.imageFile = file;
      this.changeImg = true;
    }
  }

  removeImage() {
    const imgQuestion = document.getElementById(`image-question`) as HTMLImageElement;
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    // Xóa ảnh
    this.questionForm.imageFile = null;
    this.changeImg = true;
    imgQuestion.src = '';
    imgQuestion.style.display = 'none';
    
    // Đặt lại giá trị input file
    if (fileInput) {
        fileInput.value = '';
    }
  }

  contentError: string = '';
  answersError: string[] = [];

  validateAnswers(answers: Answer[]): boolean {
    return answers.some(a => a.isCorrect === 1) && answers.some(a => a.isCorrect === 0);
  }

  saveQuestion() {
    this.contentError = '';
    this.answersError = [];
    let formData = new FormData();
    let errors = false;
    let errorMessage = '';
  
    // Kiểm tra nếu câu hỏi chưa có nội dung
    if (!this.questionForm.content.trim()) {
      this.contentError = 'Content Question is required';
      errors = true;
    }

    // Kiểm tra nếu câu trả lời không có nội dung
    this.questionForm.answers.forEach((answer, i) => {
      if (!answer.content.trim()) {
        this.answersError[i] = 'Content Answer is required';
        errors = true;
      }
    });

    // Kiểm tra câu trả lời giống nhau trong từng câu hỏi
    const answerContents = this.questionForm.answers.map(a => a.content.trim());
    const uniqueAnswers = new Set(answerContents);
    if (answerContents.length !== uniqueAnswers.size) {
      errorMessage = `Answers must be unique.`;
      errors = true;
    }

    // Kiểm tra nếu không có câu trả lời đúng và sai
    if (!this.validateAnswers(this.questionForm.answers)) {
      errorMessage = `Must have at least one correct and one incorrect answer.`;
      errors = true;
    }

    // Kiểm tra nếu số lượng câu trả lời < 4
    if (this.questionForm.answers.length < 4) {
      errorMessage = `Must have at least 4 answers.`;
      errors = true;
    }
  
    if (errors) {
      if (this.contentError.trim() !== '' || this.answersError.some(error => error.trim() !== '')) {
        errorMessage = `Please fill out all fields correctly.`;
      }
      this.toastr.error(errorMessage, 'Error', { timeOut: 3000 });
      return;
    }
  
    // Nếu không có lỗi, tiếp tục với việc lưu câu hỏi
    const questionsList = {
      content: this.questionForm.content,
      subjectId: this.subjectId,
      chapters: this.questionForm.chapters,
      levelId: this.questionForm.levelId,
      answers: this.questionForm.answers
    };
    formData.append('question', new Blob([JSON.stringify(questionsList)], { type: 'application/json' }));
    if (this.changeImg) {
      formData.append('file', this.questionForm.imageFile || new Blob([])); // Sử dụng file đã lưu
    }
  
    this.http.put(`${this.authService.apiUrl}/question/${this.questionId}`, formData, this.home.httpOptions).subscribe(
      () => {
        this.toastr.success('Questions saved successfully!');
        this.router.navigate([this.urlService.questionListUrl(this.subjectId)]);
      },
      err => {
        this.toastr.error(err.error.message, 'Error');
      }
    );
  }

  isPopupConfirmCancel: boolean = false;

  showPopupConfirmCancel() {
    this.dialogTitle = 'Are you sure?';
    this.dialogMessage = 'Do you really want to cancel? Any unsaved changes will be lost.';
    this.isConfirmationPopup = true;
    this.isPopupConfirmCancel = true;
  }

  confirmCancel() {
    this.closePopupDialog();
    this.router.navigate([this.urlService.questionListUrl(this.subjectId)]);
  }

  closePopupDialog() {
    this.dialogTitle = '';
    this.dialogMessage = '';
    this.isConfirmationPopup = false;
    
    this.answerIndexToDelete = null;
    this.isPopupDeleteAnswer = false;

    this.isPopupConfirmCancel = false;
  }
}