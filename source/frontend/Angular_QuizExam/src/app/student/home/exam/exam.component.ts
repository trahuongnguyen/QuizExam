import { Component } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../service/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { HomeComponent } from '../home.component';

interface Mark {
  id: number;
  score: number;
  examId: number;
  userId: number;
  subjectId: number;
  beginTime: null;
  submittedTime: null;
}

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
})
export class ExamComponent {
  title = 'Angular_QuizExam';
  thisRouter = '/student/home';

  mark: any;
}