import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from '../../home.component';
import { response } from 'express';
import { PracticeComponent } from '../practice.component';
import { Title } from '@angular/platform-browser';
import { AdminComponent } from '../../../admin.component';
declare var $: any;

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
    public practiceComponent: PracticeComponent,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  dataList: any;
  apiData: any;
  subjectDetail: any = null;
  isPopupDetail = false;
  isPopupCreate = false;
  isPopupUpdate = false;

  examList: any;

  examId: any;
  subjectId: any;
  semId: number = 1;
  name: String = '';
  image: String = '';
  sem: any;
  selectedSem: number = 1; // Default chọn Sem 1
  
  ngOnInit(): void {
    this.titleService.setTitle('List of Practices');
    this.authService.entityExporter = 'subject';
    // this.http.get<any>(`${this.authService.apiUrl}/subject/sem/${this.selectedSem}`, this.home.httpOptions).subscribe((data: any) => {
    //   this.apiData = data;
    //   this.initializeDataTable();
    // });

    this.http.get<any>(`${this.authService.apiUrl}/sem`, this.home.httpOptions).subscribe(response => {
      this.sem = response;
    })

    this.http.get<any>(`${this.authService.apiUrl}/exam`, this.home.httpOptions).subscribe((data: any) => {
      this.examList = data;
    });
  }

  selectSem(sem: number): void {
    this.selectedSem = sem;
    this.semId = sem;
    // Thực hiện các logic nếu cần thiết khi chọn Sem
    //this.reloadTable(this.selectedSem);
    console.log('Selected Sem:', sem);
  }

  getExamDetail(id: any){
    this.router.navigate([`/admin/home/exam/${id}`])
  }

  ngOnDestroy(): void {
    if (this.dataList) {
      this.dataList.destroy();
    }
  }
}


