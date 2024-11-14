import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  constructor() { }

  subjectImageUrl: string = 'http://localhost:8080/uploads/img-subject/';

  questionImageUrl: string = 'http://localhost:8080/uploads/img-question/';

  authorizeDetailUrl(authorizeId: number): string {
    return `/admin/authorize/detail/${authorizeId}`;
  }

  classDetailUrl(classId: number): string {
    return `/admin/class/${classId}`;
  }

  chapterListUrl(subjectId: number): string {
    return `/admin/subject/${subjectId}`;
  }

  questionListUrl(subjectId: number): string {
    return `/admin/subject/${subjectId}/question-list`;
  }

  editQuestionUrl(subjectId: number, id: number): string {
    return `/admin/subject/${subjectId}/edit-question/${id}`;
  }

  examListUrl(): string {
    return `/admin/exam`;
  }

  addStudentForExamlUrl(examId: number): string {
    return `/admin/exam/add-student/${examId}`;
  }

  examDetailUrl(examId: number): string {
    return `/admin/exam/detail/${examId}`;
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