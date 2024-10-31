import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { AuthService } from '../../../service/auth.service';
import { HttpClient } from '@angular/common/http';
import { HomeComponent } from '../../home.component';
import { ExamComponent } from '../exam.component';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent implements OnInit {
  examId: number = 0;
  subjectName: String = '';

  listLevel: any;

  score: number = 0;
  maxScore: number = 0;

  scoreByLevel: any;
  maxScoreByLevel: any;
  percentagesList: any;

  timeTaken: any;

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

    const markRequest = this.http.get<any>(`${this.authService.apiUrl}/mark/${this.examId}`, this.home.httpOptions);
    const levelRequest = this.http.get<any>(`${this.authService.apiUrl}/question-record/max-score-level/${this.examId}`, this.home.httpOptions);
    const scoreByLevelRequest = this.http.get<any>(`${this.authService.apiUrl}/student-answers/score-level/${this.examId}`, this.home.httpOptions);

    forkJoin([markRequest, levelRequest, scoreByLevelRequest]).subscribe(([markData, levelData, scoreByLevelData]) => {
      // Lấy dữ liệu bảng mark
      this.examComponent.mark = markData;

      // Lấy danh sách tên level
      this.listLevel = Object.keys(levelData);
      this.maxScoreByLevel = levelData;

      // Lấy điểm cho từng level của student
      this.scoreByLevel = scoreByLevelData;

      this.subjectName = this.examComponent.mark.subjectName;
      this.score = this.examComponent.mark.score;
      this.maxScore = this.examComponent.mark.maxScore;

      // Tính toán thời gian làm bài
      const submittedTime = new Date(this.examComponent.mark.submittedTime).getTime();
      const beginTime = new Date(this.examComponent.mark.beginTime).getTime();
      this.timeTaken = submittedTime - beginTime;

      // Chuyển đổi thời gian làm bài thành phút và giây
      const timeTakenInMinutes = Math.floor(this.timeTaken / 60000);
      const timeTakenInSeconds = Math.floor((this.timeTaken % 60000) / 1000);

      // Chuyển đổi định dạng "mm:ss"
      const formattedMinutes = timeTakenInMinutes < 10 ? '0' + timeTakenInMinutes : timeTakenInMinutes;
      const formattedSeconds = timeTakenInSeconds < 10 ? '0' + timeTakenInSeconds : timeTakenInSeconds;

      this.timeTaken = `${formattedMinutes}:${formattedSeconds}`;

      const percentageByLevel: Record<string, string> = {};

      for (const level of this.listLevel) {
        const score = this.scoreByLevel[level] || 0; // Lấy điểm hoặc 0 nếu không có
        const maxScore = this.maxScoreByLevel[level] || 1; // Tránh chia cho 0
        const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0; // Tránh chia cho 0
        percentageByLevel[level] = percentage.toFixed(2); // Lưu kết quả với 2 chữ số thập phân
      }
      console.log("Tỷ lệ phần trăm theo level:", percentageByLevel);

      // Chuyển đổi thành mảng số
      this.percentagesList = Object.values(percentageByLevel).map(value => parseFloat(value));

      this.drawCharts();
    });
  }

  drawCharts(): void {
    // Logic để thay đổi màu dựa trên giá trị điểm
    const backgroundColors = this.percentagesList.map((score: any) => {
      if (score < 30) {
        return '#EE0906'; // Màu đỏ cho điểm dưới 30
      }
      else if (score >= 30 && score <= 70) {
        return '#FFD912'; // Màu vàng cho điểm từ 30 đến 70
      }
      else {
        return '#26AA10'; // Màu xanh cho điểm trên 70
      }
    });
    const borderColors = backgroundColors;

    const ctx = document.getElementById('progressChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.listLevel,
        datasets: [{
          data: this.percentagesList,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
          barThickness: 30 // Độ dày của thanh
        }]
      },
      options: {
        indexAxis: 'y',  // Chuyển thành biểu đồ ngang
        scales: {
          x: {
            beginAtZero: true,
            max: 100
          }
        },
        plugins: {
          legend: {
            display: false // Ẩn nhãn "Scores" ở đầu biểu đồ
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });

    const ctx2 = document.getElementById('doughnutChart') as HTMLCanvasElement;
    // Tạo biểu đồ Doughnut Chart
    new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: ['Score', 'Remain Score'],
        datasets: [
          {
            data: [this.score, this.maxScore - this.score], // Tính toán điểm
            backgroundColor: ['#26AA10', '#DDDDDD'], // Màu phần đạt và phần chưa đạt
            borderWidth: 0,
          }
        ]
      },
      options: {
        cutout: '50%', // Làm trống giữa vòng tròn
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: { enabled: true }, // Ẩn tooltip
          legend: { display: false }   // Ẩn chú thích
        },
        animation: {
          animateRotate: false
        }
      }
    });
  }
}
