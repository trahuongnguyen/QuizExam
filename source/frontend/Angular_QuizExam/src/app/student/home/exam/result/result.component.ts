import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Title } from '@angular/platform-browser';
import { HomeComponent } from '../../home.component';
import { ExamComponent } from '../exam.component';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { UrlService } from '../../../../shared/service/url.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  examId: number = 0; // ID của bài kiểm tra

  subjectName: string = ''; // Tên môn học
  listLevel: any; // Danh sách các cấp độ

  score: number = 0; // Điểm của sinh viên
  maxScore: number = 0; // Điểm tối đa
  
  scoreByLevel: any; // Điểm theo từng cấp độ
  maxScoreByLevel: any; // Điểm tối đa theo từng cấp độ
  percentageScoreByLevel: any; // Tỉ lệ điểm theo cấp độ

  timeTaken: string = ''; // Thời gian làm bài

  constructor(
    private authService: AuthService,
    private titleService: Title,
    private home: HomeComponent,
    public examComponent: ExamComponent,
    private http: HttpClient,
    private toastr: ToastrService,
    public urlService: UrlService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Result');

    // Lấy examId từ route
    this.examId = Number(this.activatedRoute.snapshot.paramMap.get('examId'));

    const markRequest = this.http.get<any>(`${this.authService.apiUrl}/mark/${this.examId}`, this.home.httpOptions);
    const levelRequest = this.http.get<any>(`${this.authService.apiUrl}/question-record/max-score-level/${this.examId}`, this.home.httpOptions);
    const scoreByLevelRequest = this.http.get<any>(`${this.authService.apiUrl}/student-answers/score-level/${this.examId}`, this.home.httpOptions);

    // Thực hiện các yêu cầu đồng thời
    forkJoin([markRequest, levelRequest, scoreByLevelRequest]).subscribe(([markData, levelData, scoreByLevelData]) => {
      // Lưu dữ liệu bài kiểm tra
      this.examComponent.mark = markData;
      if (this.examComponent.mark.score == null) {
        this.router.navigate([this.urlService.examPageUrl()]);
        return;
      }

      this.listLevel = Object.keys(levelData); // Lấy danh sách các cấp độ
      this.maxScoreByLevel = levelData;
      this.scoreByLevel = scoreByLevelData;

      // Lấy tên môn học và điểm
      this.subjectName = this.examComponent.mark.subjectName;
      this.score = this.examComponent.mark.score;
      this.maxScore = this.examComponent.mark.maxScore;
      
      // Tính toán thời gian làm bài
      this.calculateTimeTaken(this.examComponent.mark.submittedTime, this.examComponent.mark.beginTime);
      
      // Tính toán tỉ lệ điểm theo cấp độ
      this.calculatePercentageByLevel();
      
      // Vẽ biểu đồ
      this.drawCharts();
    });
  }

  calculateTimeTaken(submittedTime: string, beginTime: string): void {
    // Tính toán thời gian làm bài và chuyển đổi thành định dạng hh:mm:ss
    const timeTakenInMs = new Date(submittedTime).getTime() - new Date(beginTime).getTime();
    const totalSeconds = Math.floor(timeTakenInMs / 1000); // Chuyển đổi milliseconds thành giây
    const hours = Math.floor(totalSeconds / 3600); // Tính số giờ
    const minutes = Math.floor((totalSeconds % 3600) / 60); // Tính số phút
    const seconds = totalSeconds % 60; // Tính số giây

    this.timeTaken = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }

  calculatePercentageByLevel(): void {
    // Tính toán tỉ lệ điểm cho từng cấp độ
    const percentageByLevel = this.listLevel.reduce((total: any, level: any) => {
      const score = this.scoreByLevel[level] || 0;
      const maxScore = this.maxScoreByLevel[level] || 1; // Tránh chia cho 0
      total[level] = ((score / maxScore) * 100).toFixed(2);
      return total;
    }, {});
    this.percentageScoreByLevel = Object.values(percentageByLevel).map(Number); // Chuyển đổi thành số
  }

  drawCharts(): void {
    this.drawDoughnutChart();
    this.drawBarChart();
  }

  drawDoughnutChart(): void {
    // Vẽ biểu đồ Doughnut
    const doughnutChart = new Chart(document.getElementById('doughnutChart') as HTMLCanvasElement, {
      type: 'doughnut',
      data: {
        labels: ['Score', 'Remain Score'],
        datasets: [{
          data: [0, this.maxScore], // Khởi đầu với điểm 0
          backgroundColor: ['#26AA10', '#DDDDDD'],
          borderWidth: 0,
        }]
      },
      options: {
        cutout: '50%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: { enabled: true },
          legend: { display: false }
        },
        animation: { animateRotate: false, animateScale: false }
      }
    });

    let currentScore = 0;
    const totalFrames = 20; // 1 giây với 20 fps
    const scoreIncrement = this.score / totalFrames;

    const updateChart = () => {
      currentScore = Math.min(currentScore + scoreIncrement, this.score);
      doughnutChart.data.datasets[0].data = [currentScore, this.maxScore - currentScore];
      doughnutChart.update();
    
      // Cập nhật phần trăm vào phần tử HTML
      const percentage = Math.round((currentScore / this.maxScore) * 100);
      document.getElementById('percentageLabel')!.innerText = `${percentage}%`;
    
      if (currentScore < this.score) {
        requestAnimationFrame(updateChart);
      }
    };
    requestAnimationFrame(updateChart);
  }

  drawBarChart(): void {
    // Vẽ biểu đồ cột
    const barColors = this.percentageScoreByLevel.map((score: any) => {
      if (score < 30) {
        return '#EE0906'; // Đỏ cho điểm dưới 30%
      }
      if (score <= 70) {
        return '#FFD912'; // Vàng cho điểm từ 30% đến 70%
      }
      return '#26AA10'; // Xanh cho điểm trên 70%
    });

    new Chart(document.getElementById('progressChart') as HTMLCanvasElement, {
      type: 'bar',
      data: {
        labels: this.listLevel,
        datasets: [{ data: this.percentageScoreByLevel, backgroundColor: barColors, barThickness: 30 }]
      },
      options: {
        indexAxis: 'y',
        scales: { x: { beginAtZero: true, max: 100 } },
        plugins: { legend: { display: false } },
        animation: { duration: 2000 },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}