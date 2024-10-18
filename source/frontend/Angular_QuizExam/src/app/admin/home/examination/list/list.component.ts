import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HomeComponent } from '../../home.component';
import { response } from 'express';
import { ExaminationComponent } from '../examination.component';
declare var $: any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  constructor(private authService: AuthService, public home: HomeComponent, private http: HttpClient, public toastr: ToastrService, private router: Router, public examComponent: ExaminationComponent) { }

  dataList: any;
  apiData: any;
  subjectDetail: any = null;
  isPopupDetail = false;

  examList: any;

  examId: any;
  subjectId: any;
  semId: number = 1;
  name: String = '';
  image: String = '';
  sem: any;
  selectedSem: number = 1; // Default chọn Sem 1
  
  ngOnInit(): void {
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

  getExamDetail(id: any) {
    this.examComponent.step = false;
    this.router.navigate([`/admin/home/exam/detail/${id}`])
  }

  ngOnDestroy(): void {
    if (this.dataList) {
      this.dataList.destroy();
    }
  }
}


