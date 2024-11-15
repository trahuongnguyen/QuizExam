import { Component, ViewChild, OnInit } from '@angular/core';
import { HomeComponent } from '../home.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { HttpClient } from '@angular/common/http';
import { ApexTheme, ApexTitleSubtitle, NgApexchartsModule } from 'ng-apexcharts';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexLegend,
  ApexFill,
  ApexGrid,
  ApexPlotOptions,
  ApexTooltip,
  ApexMarkers
} from 'ng-apexcharts';
import { Title } from '@angular/platform-browser';
import { AdminComponent } from '../../admin.component';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./../../../shared/styles/admin/style.css', './dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  // public props
  @ViewChild('chart') chart!: ChartComponent;
  @ViewChild('customerChart') customerChart!: ChartComponent;
  chartOptions!: Partial<ChartOptions>;
  chartOptions_1!: Partial<ChartOptions>;
  chartOptions_2!: Partial<ChartOptions>;
  chartOptions_3!: Partial<ChartOptions>;

  constructor(
    private authService: AuthService,
    private titleService: Title,
    public admin: AdminComponent,
    private home: HomeComponent,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  examCount: number = 0;
  classCount: number = 0;
  studentCount: number = 0;
  employeeCount: number = 0;

  semester: any; // Danh sách học kỳ

  // Các thuộc tính cho bảng
  examListTable: any;

  subjectListTable: any;
  semIdTable: number = 1;
  selectedSemTable: number = 1;
  selectedSubjectTable: string | number = '';
  examFilter: any;

  // Các thuộc tính cho biểu đồ
  examListChart: any;

  subjectListChart: any;
  semIdChart: number = 1;
  selectedSemChart: number = 1;
  selectedSubjectChart: string | number = '';

  searchTerm: string = '';
  currentPage: number = 1;

  reExamCountSem: number = 0;
  passCountSem: number = 0;
  creditCountSem: number = 0;
  distinctionCountSem: number = 0;
  passPercentageSem: number = 0;

  reExamCountSubject: number = 0;
  passCountSubject: number = 0;
  creditCountSubject: number = 0;
  distinctionCountSubject: number = 0;
  passPercentageSubject: number = 0;

  ngOnInit(): void {
    this.titleService.setTitle('Dashboard');
    const examRequest = this.http.get<any>(`${this.authService.apiUrl}/exam/all`, this.home.httpOptions);
    const classRequest = this.http.get<any>(`${this.authService.apiUrl}/class`, this.home.httpOptions);
    const studentRequest = this.http.get<any>(`${this.authService.apiUrl}/studentManagement/all-student`, this.home.httpOptions);
    const employeeRequest = this.http.get<any>(`${this.authService.apiUrl}/user`, this.home.httpOptions);
    const subjectRequest = this.http.get<any>(`${this.authService.apiUrl}/subject`, this.home.httpOptions);
    const semRequest = this.http.get<any>(`${this.authService.apiUrl}/sem`, this.home.httpOptions);
    const passPercentageRequest = this.http.get<any>(`${this.authService.apiUrl}/mark/pass-percentage`, this.home.httpOptions);

    forkJoin([examRequest, classRequest, studentRequest, employeeRequest, subjectRequest, semRequest, passPercentageRequest])
      .subscribe(([examResponse, classResponse, studentResponse, employeeResponse, subjectResponse, semResponse, passPercentageResponse]) => {
        this.examCount = examResponse.length;
        this.classCount = classResponse.length;
        this.studentCount = studentResponse.length;
        this.employeeCount = employeeResponse.length;

        this.semester = semResponse;

        this.selectedSemTable = 1;
        this.reloadTable(this.selectedSemTable);

        this.selectedSemChart = 1;
        this.reloadChart(this.selectedSemChart);

        this.charts(subjectResponse, passPercentageResponse);
      });
  }

  charts(subjectResponse: any, passPercentageResponse: any): void {
    this.chartOptions = {
      chart: {
        height: 300,
        width: '100%',
        type: 'bar',
        toolbar: {
          show: false
        }
      },
      title: {
        text: 'Overview all subject',
        align: 'center',
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          color: 'var(--color-text)'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 2,
        curve: 'smooth'
      },
      series: [
        {
          name: 'Scores',
          data: []
        }
      ],
      legend: {
        position: 'top'
      },
      xaxis: {
        type: 'category',
        categories: [],
        axisBorder: {
          show: false
        },
        labels: {
          style: {
            colors: 'var(--color-text)', // Màu chữ của nhãn trục x
          }
        }
      },
      yaxis: {
        show: true,
        min: 0,
        max: 100,
        tickAmount: 5, // Cột dọc có các điểm
        labels: {
          style: {
            colors: 'var(--color-text)', // Màu chữ của nhãn trục y
          },
          formatter: (value) => {
            return `${value}%`; // Thêm dấu '%' sau giá trị
          }
        }
      },
      colors: ['#73b4ff'],
      fill: {
        type: 'solid' // Tùy chọn phù hợp với kiểu 'bar'
      },
      grid: {
        borderColor: '#cccccc3b'
      }
    };
    this.chartOptions_1 = {
      chart: {
        height: 150,
        type: 'donut'
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        pie: {
          donut: {
            size: '75%'
          }
        }
      },
      labels: ['New', 'Return'],
      series: [39, 10],
      legend: {
        show: false
      },
      tooltip: {
        theme: 'dark'
      },
      grid: {
        padding: {
          top: 20,
          right: 0,
          bottom: 0,
          left: 0
        }
      },
      colors: ['#4680ff', '#2ed8b6'],
      fill: {
        opacity: [1, 1]
      },
      stroke: {
        width: 0
      }
    };
    this.chartOptions_2 = {
      chart: {
        height: 150,
        type: 'donut'
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        pie: {
          donut: {
            size: '75%'
          }
        }
      },
      labels: ['Re-exam', 'Pass', 'Credit', 'Distinction'],  // Đặt tên cho các mục trong donut
      series: [0, 0, 0, 0],  // Mặc định, cần cập nhật sau khi có dữ liệu
      legend: {
        show: false
      },
      tooltip: {
        theme: 'dark'
      },
      grid: {
        padding: {
          top: 20,
          right: 0,
          bottom: 0,
          left: 0
        }
      },
      colors: ['#ff3b30', '#ffcc00', '#4cd964', '#007bff'], // Màu sắc cho các phần của donut
      fill: {
        opacity: [1, 1, 1, 1]  // Đảm bảo độ trong suốt cho các phần của donut
      },
      stroke: {
        width: 0
      }
    };

    this.updateBarChart(subjectResponse, passPercentageResponse);
  }

  updateBarChart(subjectResponse: any, passPercentageResponse: any): void {
    var dataPassPercentage: any = [];
    if (this.chartOptions && this.chartOptions.xaxis && this.chartOptions.series) {
      this.chartOptions.xaxis.categories = subjectResponse.map((dt: any) => dt.name); // Gán dữ liệu từ API vào categories
      this.chartOptions.xaxis.categories.forEach((subjectName: any) => {
        const subjectData = passPercentageResponse.find((item: any) => item.subjectName === subjectName);
        if (subjectData) {
            dataPassPercentage.push(subjectData.passRate);
        }
        else {
          dataPassPercentage.push(0);
        }
      });
      this.chartOptions.series[0] = {
        name: 'Scores',
        data: dataPassPercentage
      };
      console.log('Updated categories:', this.chartOptions.xaxis.categories);
    }
    else {
      console.error('chartOptions or xaxis is undefined');
    }
  }

  getSubjectsApi(semId: number): Observable<any> {
    return this.http.get<any>(`${this.authService.apiUrl}/subject/sem/${semId}`, this.home.httpOptions);
  }

  // Hàm tải lại bảng theo semId đã chọn
  reloadTable(semId: number): void {
    this.getSubjectsApi(semId).subscribe(
      (subjectResponse) => {
        this.subjectListTable = subjectResponse;
        this.selectedSubjectTable = this.subjectListTable[0].id;
        this.loadDataForSubject(this.selectedSubjectTable, 'table');
      },
      (error) => {
        console.error('Error fetching subjects for table:', error);
      }
    );
  }

  // Hàm xử lý khi chọn học kỳ cho bảng
  setSelectedSemTable(event: Event): void {
    const sem = (event.target as HTMLSelectElement).value as unknown as number;
    this.selectedSemTable = sem;
    this.reloadTable(this.selectedSemTable);
  }

  // Hàm xử lý khi chọn môn học cho bảng
  setSelectedSubjectTable(event: Event): void {
    const subjectId = (event.target as HTMLSelectElement).value;
    this.selectedSubjectTable = subjectId;
    this.loadDataForSubject(subjectId, 'table');
  }

  // Hàm tải lại bảng theo semId đã chọn
  reloadChart(semId: number): void {
    this.getSubjectsApi(semId).subscribe(
      (subjectResponse) => {
        this.subjectListChart = subjectResponse;
        this.selectedSubjectChart = this.subjectListChart[0].id;
        this.loadDataForSubject(this.subjectListChart[0].id, 'chart');
        this.loadDataForChart1(semId);
        this.loadDataForChart2(this.subjectListChart[0].id);
      },
      (error) => {
        console.error('Error fetching subjects for table:', error);
      }
    );
  }

  // Hàm xử lý khi chọn học kỳ cho biểu đồ
  setSelectedSemChart(event: Event): void {
    const sem = (event.target as HTMLSelectElement).value as unknown as number;
    this.selectedSemChart = sem;
    this.reloadChart(this.selectedSemChart);
  }

  // Hàm xử lý khi chọn môn học cho biểu đồ
  setSelectedSubjectChart(event: Event): void {
    const subjectId = (event.target as HTMLSelectElement).value;
    this.selectedSubjectChart = subjectId;
    this.loadDataForSubject(this.selectedSubjectChart, 'chart');
    this.loadDataForChart2(this.selectedSubjectChart);
  }

  // Dữ liệu chart 1
  loadDataForChart1(semId: string | number): void {
    this.http.get<any>(`${this.authService.apiUrl}/exam/finish/sem/${semId}`, this.home.httpOptions).subscribe((data) => {
      this.examListChart = data;
      this.calculateScoresChartSem(); // Gọi hàm tính toán số lượng loại điểm
      this.updateChart1(); // Cập nhật biểu đồ với dữ liệu mới
    },
    (error) => {
      console.error('Error fetching data:', error);
    });
  }

  // Dữ liệu chart 2
  loadDataForChart2(subjectId: string | number): void {
    this.http.get<any>(`${this.authService.apiUrl}/exam/subject/${subjectId}`, this.home.httpOptions).subscribe((data) => {
      this.examListChart = data;
      this.calculateScoresChartSubject(); // Gọi hàm tính toán số lượng loại điểm
      this.updateChart2(); // Cập nhật biểu đồ với dữ liệu mới
    },
    (error) => {
      console.error('Error fetching data:', error);
    });
  }

  // Hàm tính toán số lượng các loại điểm
  calculateScoresTable(): void {
    this.examFilter.forEach((exam: any) => {
      let reExamCount = 0;
      let passCount = 0;
      let creditCount = 0;
      let distinctionCount = 0;

      exam.markResponses.forEach((mark: any) => {
        const percentage = (mark.score / mark.maxScore) * 100;

        if (percentage < 40) {
          reExamCount++;
        } else if (percentage >= 40 && percentage < 60) {
          passCount++;
        } else if (percentage >= 60 && percentage < 70) {
          creditCount++;
        } else {
          distinctionCount++;
        }
      });

      // Gán số lượng các loại điểm cho từng bài kiểm tra
      exam.reExamCount = reExamCount;
      exam.passCount = passCount;
      exam.creditCount = creditCount;
      exam.distinctionCount = distinctionCount;
    });
  }

  // Tinh % chart Sem
  calculateScoresChartSem(): void {
    this.reExamCountSem = 0;
    this.passCountSem = 0;
    this.creditCountSem = 0;
    this.distinctionCountSem = 0;

    this.examListChart.forEach((exam: any) => {
      exam.markResponses.forEach((mark: any) => {
        const percentage = (mark.score / mark.maxScore) * 100;

        if (percentage < 40) {
          this.reExamCountSem++;
        } else if (percentage >= 40 && percentage < 60) {
          this.passCountSem++;
        } else if (percentage >= 60 && percentage < 70) {
          this.creditCountSem++;
        } else {
          this.distinctionCountSem++;
        }
      });
    });

    // Tính tỷ lệ Pass
    const total = this.reExamCountSem + this.passCountSem + this.creditCountSem + this.distinctionCountSem;
    this.passPercentageSem = ((this.passCountSem + this.creditCountSem + this.distinctionCountSem) / total) * 100;
  }

  // Tinh % chart subject
  calculateScoresChartSubject(): void {
    this.reExamCountSubject = 0;
    this.passCountSubject = 0;
    this.creditCountSubject = 0;
    this.distinctionCountSubject = 0;

    this.examListChart.forEach((exam: any) => {
      exam.markResponses.forEach((mark: any) => {
        const percentage = (mark.score / mark.maxScore) * 100;

        if (percentage < 40) {
          this.reExamCountSubject++;
        } else if (percentage >= 40 && percentage < 60) {
          this.passCountSubject++;
        } else if (percentage >= 60 && percentage < 70) {
          this.creditCountSubject++;
        } else {
          this.distinctionCountSubject++;
        }
      });
    });

    // Tính tỷ lệ Pass
    const total = this.reExamCountSubject + this.passCountSubject + this.creditCountSubject + this.distinctionCountSubject;
    this.passPercentageSubject = ((this.passCountSubject + this.creditCountSubject + this.distinctionCountSubject) / total) * 100;
  }

  // Cập nhật dữ liệu biểu đồ 1
  updateChart1(): void {
    this.chartOptions_1.series = [
      this.reExamCountSem,
      this.passCountSem,
      this.creditCountSem,
      this.distinctionCountSem
    ];
    this.chartOptions_1.labels = ['Re-exam', 'Pass', 'Credit', 'Distinction'];
    this.chartOptions_1.colors = ['#ff3b30', '#ffcc00', '#4cd964', '#007bff'];
  }

  // Cập nhật dữ liệu biểu đồ 2
  updateChart2(): void {
    // Cập nhật biểu đồ với dữ liệu có
    this.chartOptions_2.series = [
      this.reExamCountSubject,
      this.passCountSubject,
      this.creditCountSubject,
      this.distinctionCountSubject
    ];

    this.chartOptions_2.labels = ['Re-exam', 'Pass', 'Credit', 'Distinction'];

    // Cập nhật màu sắc cho từng phần của biểu đồ donut
    this.chartOptions_2.colors = ['#ff3b30', '#ffcc00', '#4cd964', '#007bff'];
  }

  filterExam(): void {
    this.examFilter = this.examListTable.filter((exam: any) =>
      exam.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      exam.code.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Hàm tải dữ liệu cho môn học
  loadDataForSubject(subjectId: string | number, type: string): void {
    this.http.get<any>(`${this.authService.apiUrl}/exam/subject/${subjectId}`, this.home.httpOptions).subscribe((data) => {
      if (type === 'chart') {
        this.examListChart = data;
        this.calculateScoresChartSubject();
      }
      if (type === 'table') {
        this.examListTable = data;
        this.examFilter = this.examListTable; // Khởi tạo examFilter với dữ liệu từ examList
        this.calculateScoresTable(); // Gọi hàm tính toán
      }
    },
    (error) => {
      console.error('Error fetching data:', error);
    });
  }

  // Hàm xử lý khi chọn môn học từ ID
  selectSubjectById(subjectId: string | number, type: string): void {
    this.loadDataForSubject(subjectId, type);
  }
}

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  fill: ApexFill;
  grid: ApexGrid;
  markers: ApexMarkers;
  theme: ApexTheme;
  title: ApexTitleSubtitle;
};
