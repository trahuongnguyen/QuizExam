import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  constructor(private router: Router) { }

  subjectImageUrl: string = 'http://localhost:8080/uploads/img-subject/';

  questionImageUrl: string = 'http://localhost:8080/uploads/img-question/';

  chapterListUrl(id: number): string {
    return `/admin/subject/${id}`;
  }

  questionListUrl(id: number): string {
    return `/admin/subject/${id}/question-list`;
  }
}