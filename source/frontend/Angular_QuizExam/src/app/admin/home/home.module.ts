import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';


import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentComponent } from './student/student.component';
import { ClassComponent } from './class/class.component';
import { EmployeeComponent } from './employee/employee.component';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule } from '@angular/forms';
import { SubjectModule } from './subject/subject.module';
import { ExaminationModule } from './examination/examination.module';
import { LevelComponent } from './level/level.component';

import { NgApexchartsModule } from "ng-apexcharts";
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    StudentComponent,
    ClassComponent,
    EmployeeComponent,
    ProfileComponent,
    LevelComponent,

  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    SubjectModule,
    ExaminationModule,
    NgApexchartsModule,
    NgScrollbarModule,
    NgxPaginationModule,
  ]
})
export class HomeModule { }
