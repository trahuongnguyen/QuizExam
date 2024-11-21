import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeComponent } from './employee/employee.component';
import { ClassComponent } from './class/class.component';
import { StudentComponent } from './student/student.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from '../service/authguard.service';
import { LevelComponent } from './level/level.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: DashboardComponent
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
        data: { roles: ['ADMIN', 'SRO'] },
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
        data: { roles: ['ADMIN', 'SRO'] },
      },
      {
        path: 'level',
        component: LevelComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'TEACHER'] },
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'DIRECTOR', 'TEACHER', 'SRO'] },
      },
      {
        path: 'subject',
        loadChildren: () => import('./subject/subject.module')
          .then(m => m.SubjectModule),
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'DIRECTOR', 'TEACHER'] },
      },
      {
        path: 'exam',
        loadChildren: () => import('./examination/examination.module')
          .then(m => m.ExaminationModule),
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'SRO'] },
      },
      {
        path: 'practice',
        loadChildren: () => import('./practice/practice.module')
          .then(m => m.PracticeModule),
        canActivate: [AuthGuard],
        data: { roles: ['EXAMPLE'] }, //data: { roles: ['ADMIN', 'TEACHER'] },
      },
      {
        path: 'authorize',
        loadChildren: () => import('./authorize/authorize.module')
          .then(m => m.AuthorizeModule),
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'DIRECTOR', 'TEACHER', 'SRO'] },
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
