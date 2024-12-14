import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  constructor() { }

  subjectImageUrl: string = 'http://localhost:8080/uploads/img-subject/';

  questionImageUrl: string = 'http://localhost:8080/uploads/img-question/';

  subjectDefaultImageUrl: string = 'http://localhost:8080/uploads/img-subject/default.png';

  adminUrl(): string {
    return `/admin`;
  }

  subjectListUrl(): string {
    return `/admin/subject`;
  }

  chapterListUrl(subjectId: number): string {
    return `/admin/subject/${subjectId}`;
  }

  questionListUrl(subjectId: number): string {
    return `/admin/subject/${subjectId}/question-list`;
  }

  addQuestionUrl(subjectId: number): string {
    return `/admin/subject/${subjectId}/add-new-question`;
  }

  editQuestionUrl(subjectId: number, id: number): string {
    return `/admin/subject/${subjectId}/edit-question/${id}`;
  }

  classUrl(): string {
    return `/admin/class`;
  }

  classDetailUrl(classId: number): string {
    return `/admin/class/${classId}`;
  }

  studentListUrl(): string {
    return `/admin/student`;
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