import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../shared/service/auth.service';
import { Title } from '@angular/platform-browser';
import { AdminComponent } from '../../../admin.component';
import { ExaminationComponent } from '../examination.component';
import { Sem, SubjectResponse } from '../../../../shared/models/subject.model';
import { LevelResponse } from '../../../../shared/models/level.model';
import { QuestionResponse } from '../../../../shared/models/question.model';
import { ExaminationRequest } from '../../../../shared/models/examination.model';
import { ValidationError } from '../../../../shared/models/models';
import { SubjectService } from '../../../../shared/service/subject/subject.service';
import { LevelService } from '../../../../shared/service/level/level.service';
import { QuestionService } from '../../../../shared/service/question/question.service';
import { ExaminationService } from '../../../../shared/service/examination/examination.service';
import { UrlService } from '../../../../shared/service/url.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: [
    './../../../../shared/styles/admin/style.css',
    './form.component.css'
  ]
})

export class FormComponent implements OnInit {
  semList: Sem[] = [];
  subjectList: SubjectResponse[] = [];
  levelList: LevelResponse[] = [];

  selectedSem: number = 0;
  subjectName: string = '';

  examForm: ExaminationRequest;
  validationError: ValidationError = { };

  examType: number = 0;

  isPopupLevel = false;

  questionList: QuestionResponse[] = [];
  selectedQuestions: QuestionResponse[] = [];
  searchQuestionList: string = '';
  searchSelectedQuestions: string = '';

  get filteredQuestionList(): QuestionResponse[] {
    return this.questionList.filter(question => question.content.toLowerCase().includes(this.searchQuestionList.toLowerCase()));
  }

  get filteredSelectedQuestions(): QuestionResponse[] {
    return this.selectedQuestions.filter(question => question.content.toLowerCase().includes(this.searchSelectedQuestions.toLowerCase()));
  }

  constructor(
    private authService: AuthService,
    private titleService: Title,
    public admin: AdminComponent,
    public examComponent: ExaminationComponent,
    private subjectService: SubjectService,
    private levelService: LevelService,
    private questionService: QuestionService,
    private examService: ExaminationService,
    public urlService: UrlService,
    private router: Router,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) {
    this.examForm = { name: '', startTime: new Date(0), endTime: new Date(0), duration: 40, subjectId: 0, type: 0, levels: { } }
  }

  ngOnInit(): void {
    this.titleService.setTitle('Create Exam');
    this.loadData();
  }

  loadData(): void {
    forkJoin([this.subjectService.getSemList(), this.levelService.getLevelList()])
      .subscribe({
        next: ([semResponse, levelResponse]) => {
          if (!Array.isArray(semResponse) || semResponse.length == 0) {
            this.toastr.warning('No semesters available', 'Warning');
            this.router.navigate([this.urlService.examListUrl()]);
            return;
          }
          if (!Array.isArray(levelResponse) || levelResponse.length == 0) {
            this.toastr.warning('At least one level is required', 'Warning');
            this.router.navigate([this.urlService.examListUrl()]);
            return;
          }
          this.semList = semResponse;
          this.levelList = levelResponse;
          this.setSelectedSem(this.semList[0].id);
          this.setupLevels();
        },
        error: (err) => {
          this.authService.handleError(err, undefined, '', 'load data');
        }
      }
    );
  }

  setSelectedSem(semId: number): void {
    this.selectedSem = semId;
    this.subjectService.getSubjectListBySem(semId).subscribe({
      next: (subjectResponse) => {
        if (!Array.isArray(subjectResponse) || subjectResponse.length == 0) {
          this.toastr.warning('No subjects available', 'Warning');
          return;
        }
        this.subjectList = subjectResponse;
        this.examForm.subjectId = this.subjectList[0].id;
        this.subjectName = this.subjectList[0].name;
      },
      error: (err) => {
        this.authService.handleError(err, undefined, '', 'load data');
      }
    });
  }

  setSelectedSubject(id: number): void {
    this.subjectName = this.subjectList.find(subject => subject.id == id)?.name || '';
  }

  setupLevels(): void {
    this.levelList.forEach(level => {
      this.examForm.levels[level.id] = 0;
    });
  }

  convertDateFormat(dateObj: Date | undefined): string {
    // Dùng DatePipe để chuyển đổi đối tượng Date sang định dạng 'dd/MM/yyyy HH:mm'
    return this.datePipe.transform(dateObj, 'dd/MM/yyyy (HH:mm)')!;
  }

  validateForm(): boolean {
    let error = false;
    const startTime = new Date(this.examForm.startTime);
    const endTime = new Date(this.examForm.endTime);
    const requiredEndTime = new Date(startTime.getTime() + (this.examForm.duration + 60) * 60 * 1000);

    if (!this.examForm.name.trim()) {
      this.validationError['name'] = 'Exam name is required';
      error = true;
    }

    if (!this.examForm.startTime || startTime.getTime() == new Date(0).getTime()) {
      this.validationError['startTime'] = 'Start time is required';
      error = true;
    }
    else if (startTime.getTime() <= new Date().getTime()) {
      this.validationError['startTime'] = 'Start time cannot be equal to or before the current time';
      error = true;
    }

    if (!this.examForm.endTime || endTime.getTime() == new Date(0).getTime()) {
      this.validationError['endTime'] = 'End time is required';
      error = true;
    }
    else if (endTime < requiredEndTime) {
      this.validationError['endTime'] = `End time must be at least ${this.examForm.duration + 60} minutes after start time`;
      error = true;
    }
    
    if (this.examForm.duration <= 0) {
      this.validationError['duration'] = 'Duration must be greater than 0';
      error = true;
    }
    else if (this.examForm.duration > 1440) {
      this.validationError['duration'] = 'Duration cannot exceed 24 hours (1440 minutes)';
      error = true;
    }
    return error;
  }

  nextStep(): void {
    this.validationError = { };
    if (this.validateForm()) {
      return;
    }
    
    this.examType = this.examForm.type;
    if (this.examType == 0) {
      this.openPopupLevel();
    }
    else {
      this.loadDataQuestions();
    }
  }

  backStep(): void {
    this.examType = 0;
    this.selectedQuestions = [];
    this.examComponent.handleBackStep(this.examComponent.manualQuestionSelectionSteps, 1);
  }

  openPopupLevel(): void {
    this.isPopupLevel = true;
  }

  closePopupLevel(): void {
    this.isPopupLevel = false;
  }

  validateLevel(): boolean {
    var error = false;
    var totalQuestions = 0;
    this.levelList.forEach(level => {
      if (this.examForm.levels[level.id] < 0) {
        this.validationError[`level[${level.id}]`] = "Question number cannot be negative.";
        error = true;
      }
      totalQuestions += this.examForm.levels[level.id];
    });
    if (totalQuestions < 16 || totalQuestions > 25) {
      this.toastr.error('Total of number questions must be between 16 and 25 (Level).', 'Error', { timeOut: 2000 });
      error = true;
    }
    return error;
  }

  loadDataQuestions(): void {
    this.questionService.getQuestionList(this.examForm.subjectId).subscribe({
      next: (questionResponse) => {
        this.questionList = questionResponse;
      },
      error: (err) => {
        this.authService.handleError(err, undefined, '', 'load data');
      }
    });
    this.examComponent.handleNextStep(this.examComponent.manualQuestionSelectionSteps, 0);
  }

  moveToSelectedQuestions(question: any): void {
    const index = this.questionList.findIndex((q) => q.id == question.id);
    if (index !== -1) {
      this.selectedQuestions.push(this.questionList[index]); // Thêm vào Exam
      this.questionList.splice(index, 1); // Xóa khỏi List Question
    }
  }
  
  moveToQuestionList(question: any): void {
    const index = this.selectedQuestions.findIndex((q) => q.id == question.id);
    if (index !== -1) {
      this.questionList.push(this.selectedQuestions[index]); // Thêm vào List Question
      this.selectedQuestions.splice(index, 1); // Xóa khỏi Exam
    }
  }

  validateNumberQuestion(): boolean {
    const totalQuestions = this.selectedQuestions.length;
    
    if (totalQuestions < 10 || totalQuestions > 50) {
      this.toastr.error('Total number of questions must be between 10 and 50.', 'Error', { timeOut: 3000 });
      return true;
    }
    return false;
  }

  createExam() {
    this.validationError = { };
    
    if (this.examForm.type == 0) {
      if (this.validateLevel()) {
        return
      }
      this.examService.createAutoExam(this.examForm).subscribe({
        next: (examResponse) => {
          this.examComponent.step = true;
          this.examComponent.handleNextStep(this.examComponent.autoGenerateExamSteps, 0);
          this.toastr.success(`Create exam successfully!`, 'Success', { timeOut: 3000 });
          this.router.navigate([this.urlService.addStudentForExamlUrl(examResponse.id)]);
        },
        error: (err) => {
          this.authService.handleError(err, this.validationError, 'exam', 'create exam');
        }
      });
    }
    else {
      if (this.validateNumberQuestion()) {
        return;
      }
      let questionIds = this.selectedQuestions.map(question => question.id);
      this.examService.createExamWithQuestions(this.examForm, questionIds).subscribe({
        next: (examResponse) => {
          this.examComponent.step = true;
          this.examComponent.handleNextStep(this.examComponent.manualQuestionSelectionSteps, 1);
          this.toastr.success(`Create exam successfully!`, 'Success', { timeOut: 3000 });
          this.router.navigate([this.urlService.addStudentForExamlUrl(examResponse.id)]);
        },
        error: (err) => {
          this.authService.handleError(err, this.validationError, 'exam', 'create exam');
        }
      });
    }
  }
}