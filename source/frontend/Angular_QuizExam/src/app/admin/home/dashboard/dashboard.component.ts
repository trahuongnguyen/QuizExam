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
  ) {
    this.titleService.setTitle('Dashboard');
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
          data: [60, 75, 29, 55, 30, 45, 90, 85, 60, 45, 90, 55, 60, 80, 55, 75, 64, 95, 70] // Điểm ngẫu nhiên cho từng môn
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
      labels: ['New', 'Return'],
      series: [20, 15],
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
      colors: ['#d9d9d9', '#2ed8b6'],
      fill: {
        opacity: [1, 1]
      },
      stroke: {
        width: 0
      }
    };
  }

  examCount: number = 0;
  classCount: number = 0;
  studentCount: number = 0;
  employeeCount: number = 0;

  semester: any; // Danh sách học kỳ

  // Các thuộc tính cho bảng
  subjectListTable: any;
  semIdTable: number = 1;
  selectedSemTable: number = 1;
  selectedSubjectTable: string | number = '';
  examList: any;
  examFilter: any;

  // Các thuộc tính cho biểu đồ
  subjectListChart: any;
  semIdChart: number = 1;
  selectedSemChart: number = 1;
  selectedSubjectChart: string | number = '';

  searchTerm: string = '';
  currentPage: number = 1;

  ngOnInit(): void {
    const examRequest = this.http.get<any>(`${this.authService.apiUrl}/exam/all`, this.home.httpOptions);
    const classRequest = this.http.get<any>(`${this.authService.apiUrl}/class`, this.home.httpOptions);
    const studentRequest = this.http.get<any>(`${this.authService.apiUrl}/studentManagement/all-student`, this.home.httpOptions);
    const employeeRequest = this.http.get<any>(`${this.authService.apiUrl}/user`, this.home.httpOptions);
    const subjectRequest = this.http.get<any>(`${this.authService.apiUrl}/subject`, this.home.httpOptions);
    const semRequest = this.http.get<any>(`${this.authService.apiUrl}/sem`, this.home.httpOptions);
    
    forkJoin([examRequest, classRequest, studentRequest, employeeRequest, subjectRequest, semRequest])
    .subscribe(([examResponse, classResponse, studentResponse, employeeResponse, subjectResponse, semResponse]) => {
      this.examCount = examResponse.length;
      this.classCount = classResponse.length;
      this.studentCount = studentResponse.length;
      this.employeeCount = employeeResponse.length;

      if (this.chartOptions && this.chartOptions.xaxis) {
        this.chartOptions.xaxis.categories = subjectResponse.map((dt: any) => dt.name); // Gán dữ liệu từ API vào categories
      } else {
        console.error('chartOptions or xaxis is undefined');
      }

      this.semester = semResponse;

      // Lấy semId từ localStorage nếu có cho bảng
      const savedSemIdTable = localStorage.getItem('selectedSemIdTable');
      if (savedSemIdTable) {
        this.selectedSemTable = +savedSemIdTable;
      } else {
        this.selectedSemTable = 1;
      }
      this.reloadTable(this.selectedSemTable);

      // Lấy semId từ localStorage nếu có cho biểu đồ
      const savedSemIdChart = localStorage.getItem('selectedSemIdChart');
      if (savedSemIdChart) {
        this.selectedSemChart = +savedSemIdChart;
      } else {
        this.selectedSemChart = 1;
      }
      this.reloadChart(this.selectedSemChart);

      // Lấy subjectId từ localStorage nếu có cho bảng
      const savedSubjectIdTable = localStorage.getItem('selectedSubjectIdTable');
      if (savedSubjectIdTable) {
        this.selectSubjectById(savedSubjectIdTable, 'table');
      }

      // Lấy subjectId từ localStorage nếu có cho biểu đồ
      const savedSubjectIdChart = localStorage.getItem('selectedSubjectIdChart');
      if (savedSubjectIdChart) {
        this.selectSubjectById(savedSubjectIdChart, 'chart');
      }
    });
  }

  getSubjectsApi(semId: number): Observable<any> {
    return this.http.get<any>(`${this.authService.apiUrl}/subject/sem/${semId}`, this.home.httpOptions);
  }

  // Hàm tải lại bảng theo semId đã chọn
  reloadTable(semId: number): void {
    this.getSubjectsApi(semId).subscribe(
      (subjectResponse) => {
        this.subjectListTable = subjectResponse;
        if (this.selectedSubjectTable) {
          this.loadDataForSubjectTable(this.selectedSubjectTable, 'table');
        }
      },
      (error) => {
        console.error('Error fetching subjects for table:', error);
      }
    );
  }

  // Hàm xử lý khi chọn học kỳ cho bảng
  setSelectedSemTable(event: Event): void {
    const sem = (event.target as HTMLSelectElement).value;
    this.selectedSemTable = +sem;
    localStorage.setItem('selectedSemIdTable', this.selectedSemTable.toString());
    this.reloadTable(this.selectedSemTable);
  }

  // Hàm xử lý khi chọn môn học cho bảng
  setSelectedSubjectTable(event: Event): void {
    const subjectId = (event.target as HTMLSelectElement).value;
    this.selectedSubjectTable = subjectId;
    localStorage.setItem('selectedSubjectIdTable', subjectId);
    this.loadDataForSubjectTable(subjectId, 'table');
  }

  // Hàm tải lại bảng theo semId đã chọn
  reloadChart(semId: number): void {
    this.getSubjectsApi(semId).subscribe(
      (subjectResponse) => {
        this.subjectListChart = subjectResponse;
        if (this.selectedSubjectChart) {
          this.loadDataForSubject(this.selectedSubjectChart, 'chart');
        }
      },
      (error) => {
        console.error('Error fetching subjects for table:', error);
      }
    );
  }

  // Hàm xử lý khi chọn học kỳ cho biểu đồ
  setSelectedSemChart(event: Event): void {
    const sem = (event.target as HTMLSelectElement).value;
    this.selectedSemChart = +sem;
    localStorage.setItem('selectedSemIdChart', this.selectedSemChart.toString());
    this.reloadChart(this.selectedSemChart);
  }

  // Hàm xử lý khi chọn môn học cho biểu đồ
  setSelectedSubjectChart(event: Event): void {
    const subjectId = (event.target as HTMLSelectElement).value;
    this.selectedSubjectChart = subjectId;
    localStorage.setItem('selectedSubjectIdChart', subjectId);
    this.loadDataForSubject(subjectId, 'chart');
  }

  loadDataForSubjectTable(subjectId: string | number, type: string): void {
    this.http.get<any>(`${this.authService.apiUrl}/exam/subject/${subjectId}`, this.home.httpOptions).subscribe(
      (data) => {
        if (type === 'table') {
          this.examList = data;
          this.filterExam(); // Nếu cần lọc kết quả
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  filterExam(): void {
    this.examFilter = this.examList.filter((exam: any) =>
      exam.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      exam.code.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Hàm tải dữ liệu cho môn học
  loadDataForSubject(subjectId: string | number, type: string): void {
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
