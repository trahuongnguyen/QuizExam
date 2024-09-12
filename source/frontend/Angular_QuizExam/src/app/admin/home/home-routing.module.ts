import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeComponent } from './employee/employee.component';
import { ClassComponent } from './class/class.component';
import { StudentComponent } from './student/student.component';
import { ProfileComponent } from './profile/profile.component';

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
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'subject',
        loadChildren: () => import('./subject/subject.module')
          .then(m => m.SubjectModule),
      },
    ]
  },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
