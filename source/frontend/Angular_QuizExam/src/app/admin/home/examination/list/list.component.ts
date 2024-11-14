import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Title } from '@angular/platform-browser';
import { AdminComponent } from '../../../admin.component';
import { HomeComponent } from '../../home.component';
import { ExaminationComponent } from '../examination.component';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { UrlService } from '../../../../shared/service/url.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private titleService: Title,
    public admin : AdminComponent,
    private home: HomeComponent,
    public examComponent: ExaminationComponent,
    private http: HttpClient,
    private toastr: ToastrService,
    public urlService: UrlService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  examId: any;
  semId: number = 1;
  name: String = '';
  semester: any;
  selectedSem: number = 1; // Default chọn Sem 1

  examList: any = [];
  filteredExamList: any = [];
  searchTerm: string = '';
  
  pagedExamList: any = [];
  currentPage: number = 1; // Trang hiện tại
  itemsPerPage: number = 4; // Số phần tử trên mỗi trang
  totalPages: number = 0; // Tổng số trang
  pages: number[] = []; // Mảng số trang

  ngOnInit(): void {
    this.titleService.setTitle('List of Exams');
    this.selectSem(this.selectedSem);
    this.http.get<any>(`${this.authService.apiUrl}/sem`, this.home.httpOptions).subscribe(response => {
      this.semester = response;
    })
  }

  selectSem(sem: number): void {
    this.selectedSem = sem;
    this.http.get<any>(`${this.authService.apiUrl}/exam/sem/${this.selectedSem}`, this.home.httpOptions).subscribe((data: any) => {
      this.examList = data;
      this.filteredExamList = data;
      this.calculatePagination();
      this.updatePagedList();
    });
    this.semId = sem;
    console.log('Selected Sem:', sem);
  }

  getExamDetail(id: any) {
    this.examComponent.step = false;
    this.router.navigate([this.urlService.examDetailUrl(id)]);
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredExamList = this.examList.filter((exam: any) =>
      exam.name.toLowerCase().includes(term) || exam.code.toLowerCase().includes(term)
    );
    this.calculatePagination();
    this.updatePagedList();
  }
//  paginstion
  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredExamList.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  updatePagedList(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedExamList = this.filteredExamList.slice(start, end);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedList();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedList();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedList();
    }
  }

}


