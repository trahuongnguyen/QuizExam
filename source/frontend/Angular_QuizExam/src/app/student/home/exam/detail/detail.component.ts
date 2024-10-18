import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamComponent } from '../exam.component';
import { Timestamp } from 'rxjs';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit {
  constructor(private authService: AuthService, private http: HttpClient, private router: Router, private activatedRoute: ActivatedRoute, public examComponent: ExamComponent) { }
  apiData: any;
  examId: number = 0;
  remainingTime: string = ''; // Thời gian còn lại ở định dạng HH:mm:ss
  countdown: any; // Biến để lưu interval

  selectedExam: any;
  completedQuestions: boolean[] = []; // Mảng câu hỏi với thông tin về trạng thái hoàn thành
  ngOnInit(): void {
    this.examId = Number(this.activatedRoute.snapshot.paramMap.get('examId'));
    this.http.get<any>(`${this.authService.apiUrl}/exam/1`).subscribe((data: any) => {
      this.apiData = data;
      this.selectedExam = data;
      this.startCountdown(this.selectedExam.duration * 60);
    });
    if (this.selectedExam) {
      this.completedQuestions = new Array(this.selectedExam.questionRecordResponses.length).fill(false);
    }
  }

  // Hàm cuộn đến câu hỏi tương ứng
  scrollToQuestion(index: number): void {
    const questionElement = document.getElementById(`question-${index + 1}`);
    if (questionElement) {
      questionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  //Đếm ngược thời gian thi
  startCountdown(durationInSeconds: number): void {
    let timer = durationInSeconds;
    this.countdown = setInterval(() => {
      const hours = Math.floor(timer / 3600);
      const minutes = Math.floor((timer % 3600) / 60);
      const seconds = timer % 60;

      this.remainingTime = 
        `${this.padNumber(hours)}:${this.padNumber(minutes)}:${this.padNumber(seconds)}`;

      if (timer > 0) {
        timer--;
      } else {
        clearInterval(this.countdown);
        this.onTimeUp();
      }
    }, 1000); // Cập nhật mỗi giây
  }

  padNumber(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  onTimeUp(): void {
    // Hết thời gian, bạn có thể thêm logic xử lý
    alert('Time is up!');
  }

  ngOnDestroy(): void {
    if (this.countdown) {
      clearInterval(this.countdown); // Hủy bỏ interval khi component bị hủy
    }
  }

  // Hàm đánh dấu câu hỏi đã hoàn thành
  markQuestionAsCompleted(index: number): void {
    this.completedQuestions[index] = true;
  }

  // Hàm đếm số lượng câu hỏi đã hoàn thành
  getCompletedQuestionsCount(): number {
    return this.completedQuestions.filter(completed => completed).length;
  }

}

export interface Exam {
  id: number;
  subjectId: number;
  name: string;
  code: string;
  startTime: Timestamp<Date>;
  endTime: Timestamp<Date>;
  duration: number;
  status: number;
  type: number;
}

