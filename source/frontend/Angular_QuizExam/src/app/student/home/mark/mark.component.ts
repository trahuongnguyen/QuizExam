import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT, NgForOf } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { HomeComponent } from '../home.component';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-mark',
  templateUrl: './mark.component.html',
  styleUrls: [
    './../../../shared/styles/student/style.css',
    './mark.component.css'
  ]
})
@Injectable()
export class MarkComponent implements OnInit {
  semesters: any;
  selectedSem: number = 1; // Default chọn Sem 1
  subjects: any[] = [];

  constructor(private authService: AuthService, private titleService: Title, private home: HomeComponent, private http: HttpClient) { }

  ngOnInit(): void {
    this.titleService.setTitle('Mark');
    this.selectSem(this.selectedSem);
    this.http.get<any>(`${this.authService.apiUrl}/sem`, this.home.httpOptions).subscribe(response => {
      this.semesters = response;
    }, error => {
      console.error('Error fetching semesters:', error);
    });
  }

  selectSem(sem: number): void {
    this.selectedSem = sem;
    this.http.get<any>(`${this.authService.apiUrl}/mark/sem/${this.selectedSem}`, this.home.httpOptions).subscribe((data: any) => {
      this.subjects = data;
      console.log(this.subjects);
    }, error => {
      console.error('Error fetching semesters:', error);
    });
  }

  getOverall(index: number): number {
    if (index >= this.subjects.length) {
      return 0;
    }

    const score = this.subjects[index].score;
    const maxScore = this.subjects[index].maxScore;
    return maxScore ? Math.round((score / maxScore) * 100) : 0;
  }

  getStatus(score: number, maxScore: number): string {
    if (maxScore === 0) return 'N/A'; 

    const percentage = (score / maxScore) * 100;

    if (percentage < 40) {
      return 'RE-EXAM';
    } else if (percentage >= 40 && percentage < 60) {
      return 'PASS';
    } else if (percentage >= 60 && percentage < 70) {
      return 'CREDIT';
    } else {
      return 'DISTINCTION';
    }
  }
}


