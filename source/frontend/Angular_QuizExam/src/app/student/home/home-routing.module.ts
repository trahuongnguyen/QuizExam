import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ProfileComponent } from './profile/profile.component';
import { MarkComponent } from './mark/mark.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: HomepageComponent,
      },
      // {
      //   path: '',
      //   redirectTo: 'homepage',
      //   pathMatch: 'full'
      // },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'mark',
        component: MarkComponent
      },
      {
        path: 'exam',
        loadChildren: () => import('./exam/exam.module')
          .then(m => m.ExamModule),
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
