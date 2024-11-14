import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  constructor() { }

  subjectImageUrl: string = 'http://localhost:8080/uploads/img-subject/';

  questionImageUrl: string = 'http://localhost:8080/uploads/img-question/';

  chapterListUrl(subjectId: number): string {
    return `/admin/subject/${subjectId}`;
  }

  questionListUrl(subjectId: number): string {
    return `/admin/subject/${subjectId}/question-list`;
  }
}