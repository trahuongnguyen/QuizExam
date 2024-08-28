import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonComponent } from './common/common.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentComponent } from './student/student.component';
import { ClassComponent } from './class/class.component';
import { EmployeeComponent } from './employee/employee.component';
import { ProfileComponent } from './profile/profile.component';



@NgModule({
  declarations: [
    CommonComponent,
    DashboardComponent,
    StudentComponent,
    ClassComponent,
    EmployeeComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule
  ]
})
export class HomeModule { }
