import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeComponent } from './employee/employee.component';
import { ClassComponent } from './class/class.component';
import { StudentComponent } from './student/student.component';

const routes: Routes = [
    {
    path: '', 
    component: HomeComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'employee',
        component: EmployeeComponent
      },
      {
        path: 'class',
        component: ClassComponent
      },
      {
        path: 'student',
        component: StudentComponent
      },
    ]
  },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
