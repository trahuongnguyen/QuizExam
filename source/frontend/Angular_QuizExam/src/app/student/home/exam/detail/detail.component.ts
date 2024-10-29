import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HomeComponent } from '../../home.component';
import { ExamComponent } from '../exam.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, OnDestroy {
  examId: number = 0;
  endTime: any;
  remainingTime: string = '';
  countdown: any;
  examDetail: any;
  questionStatus: boolean[] = [];
  studentAnswers: { questionRecordId: number; selectedAnswerIds: number[] }[] = [];

  showPopupConfirm: boolean = false;
  showPopupWarning: boolean = false;
  warningMessage: string = '';

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private home: HomeComponent,
    private examComponent: ExamComponent,
    private router: Router,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.examId = Number(this.activatedRoute.snapshot.paramMap.get('examId'));
    this.loadData();
    this.setupScrollListener();
    this.setupAntiCheatMonitoring();
  }

  loadData(): void {
    const markRequest = this.http.get<any>(`${this.authService.apiUrl}/mark/${this.examId}`, this.home.httpOptions);
    const examRequest = this.http.get<any>(`${this.authService.apiUrl}/exam/${this.examId}`, this.home.httpOptions);

    forkJoin([markRequest, examRequest]).subscribe(([markData, examData]) => {
      this.examComponent.mark = markData;
      this.examDetail = examData;

      if (this.examComponent.mark.score != null) {
        this.router.navigateByUrl('/student/home/exam/result/' + this.examId);
      }
      if (this.examComponent.mark.beginTime == null) {
        this.http.put(`${this.authService.apiUrl}/mark/${this.examComponent.mark.id}`, this.home.httpOptions).subscribe(
          response => {
            console.log('Update Begin Time successful: ', response);
          },
          err => {
            console.log('Update Begin Time fail: ', err);
          }
        );
      }
      this.questionStatus = Array(this.examDetail.questionRecordResponses.length).fill(false);
      this.calculateNewDuration();
      this.loadFromSession();
    });
  }

  calculateNewDuration(): void {
    const beginTime = this.examComponent.mark.beginTime ? new Date(this.examComponent.mark.beginTime) : new Date(); // Chuyển đổi string thành Date
    const durationMinutes = this.examDetail.duration;

    // Tính toán endTime.
    const endTime = new Date(beginTime.getTime() + durationMinutes * 60000); // thêm phút vào thời gian bắt đầu

    // Lấy thời gian hiện tại.
    const now = new Date();

    // Tính toán số giây còn lại.
    const remainingDuration = endTime > now ? Math.floor((endTime.getTime() - now.getTime()) / 1000) : 0; // Nếu thời gian đã qua, đặt thành 0
    
    this.remainingTime = this.formatTime(remainingDuration); // Cập nhật remainingTime
    this.startCountdown(remainingDuration); // Bắt đầu đếm ngược từ remainingDuration (bằng giây)
  }

  startCountdown(duration: number): void {
    let remainingSeconds = duration;
    const warningTimes = [180, 120, 60]; // Các mốc thời gian cần thông báo (giây)
  
    this.countdown = setInterval(() => {
      if (remainingSeconds <= 0) {
        clearInterval(this.countdown);
        this.submitExam(); // Optionally submit answers when time is up
        return;
      }

      // Kiểm tra và gửi thông báo cho các mốc thời gian
      if (warningTimes.includes(remainingSeconds)) {
        this.toastr.warning(`Only ${remainingSeconds / 60} minute(s) left!`);
      }
  
      remainingSeconds--;
      this.remainingTime = this.formatTime(remainingSeconds);
    }, 1000);
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${this.padNumber(hours)}:${this.padNumber(minutes)}:${this.padNumber(secs)}`;
  }

  padNumber(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  setupAntiCopyAndDevTools() {
    document.addEventListener('keydown', (event) => {
      // Ngăn mở Developer Tools
      if (event.key === 'F12' || (event.ctrlKey && event.key === 'u')) {
        event.preventDefault();
        this.toastr.warning("This action is disabled.");
      }
    });

    // Kiểm tra khi sao chép nội dung
    document.addEventListener('copy', (event) => {
      event.preventDefault();
      this.toastr.warning("Copying content is not allowed.");
    });

    // Ngăn chặn menu chuột phải hiển thị
    document.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      this.toastr.warning("Right-click is disabled.");
    });
  }

  trackInactivity() {
    let inactivityTime = 0;
    const warningTime = 2; // Thời gian không hoạt động trước khi cảnh báo (phút)

    // Theo dõi thời gian không hoạt động
    function resetTimer() {
      inactivityTime = 0; // Đặt lại thời gian không hoạt động
    }

    // Gán các sự kiện để theo dõi hoạt động của người dùng
    document.addEventListener('mousemove', resetTimer); // Được kích hoạt khi di chuyển chuột.
    document.addEventListener('keydown', resetTimer); // Được kích hoạt khi nhấn phím.
    document.addEventListener('click', resetTimer); // Được kích hoạt khi nhấp chuột vào bất kỳ vị trí nào trên trang.
    document.addEventListener('touchstart', resetTimer); // Được kích hoạt khi chạm vào màn hình (trong trường hợp các thiết bị cảm ứng).

    setInterval(() => {
      inactivityTime++;
      if (inactivityTime >= warningTime * 60) { // Không hoạt động trong 2 phút (120 giây)
        this.toastr.warning("You have been inactive for too long. Please return to the exam!");
      }
    }, 2000); // Kiểm tra mỗi 2 giây
  }

  setupAntiCheatMonitoring() {
    // Kiểm tra sự kiện khi tab chuyển đổi
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.toastr.warning("You have switched to another window.");
      }
    });

    // Kiểm tra khi click chuột ra ngoài bài thi
    window.addEventListener('blur', () => {
      this.showPopupWarning = true;
      this.warningMessage = "Please do not click outside the test.";
    });

    this.setupAntiCopyAndDevTools();
    this.trackInactivity();
  }

  setupScrollListener(): void {
    window.addEventListener('scroll', this.handleScroll);
  }

  handleScroll = (): void => {
    const sidebarContainer = document.querySelector('.sidebar-container') as HTMLElement;
    if (sidebarContainer) {
      sidebarContainer.style.transform = window.scrollY > 50 ? 'translate3d(0px, 100px, 0px)' : 'translate3d(0px, 0px, 0px)';
      sidebarContainer.style.marginBottom = window.scrollY > 50 ? "100px" : "0";
    }
  }

  scrollToQuestion(index: number): void {
    const questionElement = document.getElementById(`question-${index + 1}`);
    if (questionElement) {
      const headerOffset = 80; // Chiều cao của header
      const elementPosition = questionElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  isSelectedAnswer(questionId: number, answerId: number): boolean {
    const questionIndex = this.examDetail.questionRecordResponses.findIndex((q: any) => q.id === questionId);
    
    if (questionIndex !== -1) {
      const studentAnswer = this.studentAnswers[questionIndex];
      if (studentAnswer) {
        return studentAnswer.selectedAnswerIds.includes(answerId);
      }
    }
    return false;
  }

  markQuestionAsCompleted(index: number): void {
    const question = this.examDetail.questionRecordResponses[index];
    const selectedAnswerIds = question.type === 1 
      ? [this.getSelectedAnswerId(index)].filter((id): id is number => id !== null) 
      : this.getSelectedAnswerIds(index);

    this.questionStatus[index] = true;
    this.studentAnswers[index] = { questionRecordId: question.id, selectedAnswerIds };
    this.saveToSession();
  }

  getSelectedAnswerId(index: number): number | null {
    const selectedAnswer = this.examDetail.questionRecordResponses[index].answerRecords.find((answer: any) => 
      (document.getElementById(answer.id) as HTMLInputElement)?.checked
    );
    return selectedAnswer ? selectedAnswer.id : null;
  }

  getSelectedAnswerIds(index: number): number[] {
    return this.examDetail.questionRecordResponses[index].answerRecords.filter((answer: any) => 
      (document.getElementById(answer.id) as HTMLInputElement)?.checked
    ).map((answer: any) => answer.id);
  }

  saveToSession(): void {
    localStorage.setItem('examSessionData', JSON.stringify({ questionStatus: this.questionStatus, studentAnswers: this.studentAnswers, remainingTime: this.remainingTime }));
  }

  loadFromSession(): void {
    const sessionData = localStorage.getItem('examSessionData');
    if (sessionData) {
      const { questionStatus, studentAnswers, remainingTime } = JSON.parse(sessionData);
      this.questionStatus = questionStatus;
      this.studentAnswers = studentAnswers;
      this.remainingTime = remainingTime;
    }
  }

  getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index); // 65 là mã ASCII cho 'A'
  }

  getQuestionsStatusCount(): number {
    return this.questionStatus.filter(Boolean).length;
  }

  openPopupConfirm(): void {
    this.showPopupConfirm = true;
  }

  closePopup(): void {
    this.showPopupConfirm = false;
    this.showPopupWarning = false;
  }

  submitExam(): void {
    const body = { markId: this.examComponent.mark.id, studentQuestionAnswers: this.studentAnswers };
    this.http.post(`${this.authService.apiUrl}/student-answers`, body, this.home.httpOptions).subscribe(
      () => this.toastr.success('Submission successful'),
      () => this.toastr.error('Submission failed')
    );
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handleScroll);
    clearInterval(this.countdown);
  }
}