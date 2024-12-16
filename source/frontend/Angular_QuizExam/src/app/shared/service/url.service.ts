import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  constructor() { }

  subjectImageUrl: string = 'http://localhost:8080/uploads/img-subject/';

  questionImageUrl: string = 'http://localhost:8080/uploads/img-question/';

  subjectDefaultImageUrl: string = 'http://localhost:8080/uploads/img-subject/default.png';
  
  getPageUrl(pageType: 'ADMIN' | 'STUDENT'): string {
    return pageType === 'ADMIN' ? '/admin' : '';
  }

  getSubjectListUrl(pageType: 'ADMIN' | 'STUDENT'): string {
    return pageType === 'ADMIN' ? `/admin/subject` : '';
  }

  getChapterListUrl(pageType: 'ADMIN' | 'STUDENT', subjectId?: number): string {
    return pageType === 'ADMIN' ? `/admin/subject/${subjectId}` : '';
  }

  getQuestionListUrl(pageType: 'ADMIN' | 'STUDENT', subjectId?: number): string {
    return pageType === 'ADMIN' ? `/admin/subject/${subjectId}/question-list` : '';
  }

  getAddQuestionUrl(pageType: 'ADMIN' | 'STUDENT', subjectId?: number): string {
    return pageType === 'ADMIN' ? `/admin/subject/${subjectId}/add-new-question` : '';
  }

  getEditQuestionUrl(pageType: 'ADMIN' | 'STUDENT', subjectId?: number, id?: number): string {
    return pageType === 'ADMIN' ? `/admin/subject/${subjectId}/edit-question/${id}` : '';
  }

  getClassUrl(pageType: 'ADMIN' | 'STUDENT'): string {
    return pageType === 'ADMIN' ? '/admin/class' : '';
  }

  getClassDetailUrl(pageType: 'ADMIN' | 'STUDENT', classId?: number): string {
    return pageType === 'ADMIN' ? `/admin/class/${classId}` : '';
  }

  getStudentListUrl(pageType: 'ADMIN' | 'STUDENT'): string {
    return pageType === 'ADMIN' ? `/admin/student` : '';
  }

  getMarkUrl(pageType: 'ADMIN' | 'STUDENT', studentId?: number, classId?: number): string {
    return pageType === 'ADMIN' ? `/admin/${classId ? `class/${classId}` : 'student'}/marks/${studentId}` : '/marks';
  }

  examListUrl(): string {
    return `/admin/exam`;
  }

  createExamUrl(): string {
    return `/admin/exam/create-exam`;
  }

  addStudentForExamlUrl(examId: number): string {
    return `/admin/exam/add-student/${examId}`;
  }

  examDetailUrl(examId: number): string {
    return `/admin/exam/detail/${examId}`;
  }

  editExamInfoUrl(examId: number): string {
    return `/admin/exam/edit-exam/${examId}`;
  }

  updateExamQuestion(examId: number): string {
    return `/admin/exam/update-questions/${examId}`;
  }

  levelUrl(): string {
    return `/admin/level`;
  }

  authorizeListUrl(): string {
    return `/admin/authorize`;
  }

  authorizeDetailUrl(): string {
    return `/admin/authorize/detail`;
  }

  examPageUrl(): string {
    return `/exam`;
  }

  examDetailPageUrl(examId: number): string {
    return `/exam/detail/${examId}`;
  }

  resultExamPageUrl(examId: number): string {
    return `/exam/result/${examId}`;
  }
}