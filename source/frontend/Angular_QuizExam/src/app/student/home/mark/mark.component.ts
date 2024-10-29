import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT, NgForOf } from '@angular/common';
import { AuthService } from '../../service/auth.service'; 
import { HomeComponent } from '../home.component'; 
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mark',
  templateUrl: './mark.component.html',
  styleUrl: './mark.component.css'
})
@Injectable()
export class MarkComponent implements OnInit {
  semesters: any;
  selectedSem: number = 1; // Default chọn Sem 1
  subjects: any[] = [];
  apiData: any;

  constructor(private authService: AuthService, private home: HomeComponent, private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any>(`${this.authService.apiUrl}/mark`, this.home.httpOptions).subscribe((data: any) => {
      this.apiData = data;
      console.log(this.apiData);
    });

    this.http.get<any>(`${this.authService.apiUrl}/sem`, this.home.httpOptions).subscribe(response => {
      this.semesters = response;
    })
  }

  getOverall(index:number):number { 
    let sum = 0;
    let total = 0;
    for (let i = 0; i < index; i++) {
      sum += this.subjects[i].mark;
      total += ((this.subjects[i].mark / this.subjects[i].maxMark) * 100);
    }
    return index < this.subjects.length-1 ? ((this.subjects[index].mark / this.subjects[index].maxMark) * 100):total/index; 
  }
  
}


