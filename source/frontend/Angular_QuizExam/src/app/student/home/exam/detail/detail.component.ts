import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamComponent } from '../exam.component';
import { ToastrService } from 'ngx-toastr';
import { HomeComponent } from '../../home.component';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService, private http: HttpClient, public home: HomeComponent, private router: Router, public toastr: ToastrService, private activatedRoute: ActivatedRoute, public examComponent: ExamComponent) { }
  apiData: any;
  examId: number = 0;
  remainingTime: string = ''; // Thời gian còn lại ở định dạng HH:mm:ss
  countdown: any; // Biến để lưu interval

  selectedExam: any;
  completedQuestions: boolean[] = []; // Mảng câu hỏi với thông tin về trạng thái hoàn thành

  studentAnswers: { questionRecordId: number; selectedAnswerIds: number[] }[] = [];

  ngOnInit(): void {
    this.examId = Number(this.activatedRoute.snapshot.paramMap.get('examId'));
    this.http.get<any>(`${this.authService.apiUrl}/exam/` + this.examId, this.home.httpOptions).subscribe((data: any) => {
      this.apiData = data;
      this.selectedExam = data;
      this.startCountdown(this.selectedExam.duration * 60); 
      console.log(this.selectedExam);
      console.log(this.selectedExam.questionRecordResponses);

      this.loadFromSession();
    });
    this.setupScrollListener(); // Thêm sự kiện cuộn khi component được khởi tạo
    if (this.selectedExam) {
      this.completedQuestions = new Array(this.selectedExam.questionRecordResponses.length).fill(false);
    }
  }

  setupScrollListener(): void {
    window.addEventListener('scroll', this.handleScroll);
  }

  handleScroll = (): void => {
    const sidebarContainer = document.querySelector('.sidebar-container') as HTMLElement;
    if (sidebarContainer) {
      const scrollPosition = window.scrollY || window.pageYOffset;
      // Kiểm tra vị trí cuộn để thay đổi `transform`
      if (scrollPosition > 50) {
        sidebarContainer.style.transform = 'translate3d(0px, 100px, 0px)';
        sidebarContainer.style.marginBottom = "100px";
      } else {
        sidebarContainer.style.transform = 'translate3d(0px, 0px, 0px)';
      }
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
    this.submitAnswers();
  }

  getSelectedAnswerId(index: number): number | null {
    const answers = this.selectedExam.questionRecordResponses[index].answerRecords;
    const selectedRadio = answers.find((answer: any) => {
        const element = document.getElementById(answer.id) as HTMLInputElement; // Khai báo rõ loại
        return element ? element.checked : false; // Kiểm tra thuộc tính checked
    });
    return selectedRadio ? selectedRadio.id : null; // Trả về ID của câu trả lời đã chọn
}

  getSelectedAnswerIds(index: number): number[] {
    const answers = this.selectedExam.questionRecordResponses[index].answerRecords;
    return answers.filter((answer: any) => {
      const element = document.getElementById(answer.id) as HTMLInputElement;
      return element ? element.checked : false;
    }).map((answer: any) => answer.id);
  }

  // Hàm đánh dấu câu hỏi đã hoàn thành
  markQuestionAsCompleted(index: number): void {
    const question = this.selectedExam.questionRecordResponses[index];
    let selectedAnswerIds: number[];

    if (question.type === 1) { // Đối với câu hỏi đơn lựa chọn
        const answerId = this.getSelectedAnswerId(index);
        selectedAnswerIds = answerId !== null ? [answerId] : [];
    }
    else { // Đối với câu hỏi nhiều lựa chọn
        selectedAnswerIds = this.getSelectedAnswerIds(index);
    }

    this.completedQuestions[index] = true;

    // Cập nhật câu trả lời
    this.studentAnswers[index] = {
        questionRecordId: question.id,
        selectedAnswerIds: selectedAnswerIds
    };

    // Lưu vào session storage
    this.saveToSession();
  }

  isSelectedAnswer(questionId: number, answerId: number): boolean {
    const questionIndex = this.selectedExam.questionRecordResponses.findIndex((q: any) => q.id === questionId);
    
    if (questionIndex !== -1) {
        const studentAnswer = this.studentAnswers[questionIndex];
        if (studentAnswer) {
            return studentAnswer.selectedAnswerIds.includes(answerId);
        }
    }
    return false;
  }

  saveToSession(): void {
    const sessionData = {
        completedQuestions: this.completedQuestions,
        studentAnswers: this.studentAnswers,
        remainingTime: this.remainingTime,
    };
    sessionStorage.setItem('examSessionData', JSON.stringify(sessionData));
  }

  loadFromSession(): void {
    const sessionData = sessionStorage.getItem('examSessionData');
    if (sessionData) {
        const { completedQuestions, studentAnswers, remainingTime } = JSON.parse(sessionData);
        this.completedQuestions = completedQuestions;
        this.studentAnswers = studentAnswers;
        this.remainingTime = remainingTime;

        console.log(studentAnswers);
        // Nếu cần, khôi phục lại giao diện người dùng dựa trên dữ liệu đã lưu
    }
    else {
        this.completedQuestions = new Array(this.selectedExam.questionRecordResponses.length).fill(false);
        this.studentAnswers = new Array(this.selectedExam.questionRecordResponses.length);
    }
  }

  // Hàm đếm số lượng câu hỏi đã hoàn thành
  getCompletedQuestionsCount(): number {
    return this.completedQuestions.filter(completed => completed).length;
  }

  submitAnswers(): void {
    const body = {
        markId: 1,
        studentQuestionAnswers: this.studentAnswers
    };

    this.http.post(`${this.authService.apiUrl}/student-answers`, body, this.home.httpOptions).subscribe(
      response => {
        this.toastr.success('Submission successful', 'Success', {
          timeOut: 2000,
        });
      },
      error => {
        this.toastr.error('Submission failed', 'Failed', {
          timeOut: 2000,
        });
      });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handleScroll);
    if (this.countdown) {
      clearInterval(this.countdown); // Hủy bỏ interval khi component bị hủy
    }
  }

}