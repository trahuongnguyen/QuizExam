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


@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    StudentComponent,
    ClassComponent,
    EmployeeComponent,
    ProfileComponent,

  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    SubjectModule,
    ExaminationModule
  ]
})
export class HomeModule { }
