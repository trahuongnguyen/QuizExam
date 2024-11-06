import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from '../../home.component';
import { SubjectComponent } from '../subject.component';
import { forkJoin } from 'rxjs';

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
  subjects: any;
  listChapter: any = [];
  listLevel: any = [];
  questionForms: QuestionForm[] = [];
  contentError: string[] = [];
  answersError: string[][] = [[]];
  isPopupChapter: boolean[] = [];
  popupChapterIndex: number = 0;
  showPopupConfirm = false;
  subjectId: number = 0;
  subjectName: string = '';

  constructor(
    private authService: AuthService,
    private home: HomeComponent,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public subjectComponent: SubjectComponent
  ) { }

  ngOnInit(): void {
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

  toggleChapterSelection(questionIndex: number, chapterId: number, event: Event) {
    const checkbox = (event.target as HTMLInputElement);
    const chapters = this.questionForms[questionIndex].chapters || [];
    if (checkbox.checked) chapters.push(chapterId);
    else chapters.splice(chapters.indexOf(chapterId), 1);
    this.questionForms[questionIndex].chapters = chapters;
  }

  openPopup(questionIndex: number) {
    this.popupChapterIndex = questionIndex;
    this.isPopupChapter[questionIndex] = true;
  }

  closePopup() {
    this.isPopupChapter[this.popupChapterIndex] = false;
    this.popupChapterIndex = 0;
    this.showPopupConfirm = false;
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

  removeQuestionForm(index: number) {
    if (this.questionForms.length > 1) this.questionForms.splice(index, 1);
    else alert("At least one question must remain.");
  }

  addAnswer(index: number) {
    this.questionForms[index].answers.push({ content: '', isCorrect: 0 });
  }

  toggleIsCorrect(answer: Answer) {
    answer.isCorrect = answer.isCorrect === 1 ? 0 : 1;
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
    this.questionForms[questionIndex].imageFile = null;
    const imgQuestion = document.getElementById(`imageQuestion${questionIndex}`) as HTMLImageElement;
    imgQuestion.src = '';
    imgQuestion.style.display = 'none';
  }

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

  cancel() {
    this.showPopupConfirm = true;
  }

  confirmCancel() {
    this.showPopupConfirm = false;
    this.router.navigate([`/admin/home/subject/${this.subjectId}/questionList`]);
  }
}