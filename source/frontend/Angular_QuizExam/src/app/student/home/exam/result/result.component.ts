import { Component, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent implements AfterViewInit {
  currentScore = 8; // Điểm hiện tại (thay đổi theo nhu cầu)
  maxScore = 20;    // Điểm tối đa

  ngAfterViewInit(): void {
    const ctx = document.getElementById('progressChart') as HTMLCanvasElement;

    const scores = [20, 90, 60, 74]; // Dữ liệu điểm số

    // Logic để thay đổi màu dựa trên giá trị điểm
    const backgroundColors = scores.map(score => {
      if (score < 30) {
        return '#EE0906'; // Màu đỏ cho điểm dưới 30
      } else if (score >= 30 && score <= 70) {
        return '#FFD912'; // Màu vàng cho điểm từ 30 đến 70
      } else {
        return '#26AA10'; // Màu xanh cho điểm trên 70
      }
    });

    const borderColors = backgroundColors;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4'],
        datasets: [{
          data: scores,
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
    ctx.style.backgroundColor = '#FFFFFF';
    // Tạo biểu đồ Doughnut Chart
    new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: ['Score', 'Remain Score'],
        datasets: [
          {
            data: [this.currentScore, this.maxScore - this.currentScore], // Tính toán điểm
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
