import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ProfileComponent } from './profile/profile.component';
import { MarkComponent } from './mark/mark.component';
import { AuthGuard } from '../service/authguard.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: HomepageComponent
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
        data: { roles: ['STUDENT'] },
      },
      {
        path: 'mark',
        component: MarkComponent,
        canActivate: [AuthGuard],
        data: { roles: ['STUDENT'] },
      },
      {
        path: 'exam',
        loadChildren: () => import('./exam/exam.module')
          .then(m => m.ExamModule),
        canActivate: [AuthGuard],
        data: { roles: ['STUDENT'] },
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
