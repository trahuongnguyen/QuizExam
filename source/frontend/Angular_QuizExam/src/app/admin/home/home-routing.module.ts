import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeComponent } from './employee/employee.component';
import { ClassComponent } from './class/class.component';
import { StudentComponent } from './student/student.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from '../service/authguard.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'DIRECTOR', 'TEACHER', 'SRO'] },
    children: [
      {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'DIRECTOR', 'TEACHER', 'SRO'] },
      },
      {
        path: 'employee',
        component: EmployeeComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'DIRECTOR'] },
      },
      {
        path: 'class',
        component: ClassComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'DIRECTOR', 'SRO'] },
      },
      {
        path: 'student',
        component: StudentComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'SRO'] },
      },
      {
        path: 'class/:classId',
        component: StudentComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'DIRECTOR', 'SRO'] },
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
      {
        path: 'exam',
        loadChildren: () => import('./examination/examination.module')
          .then(m => m.ExaminationModule),
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
