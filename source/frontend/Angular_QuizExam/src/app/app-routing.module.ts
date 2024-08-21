import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './student/login/login.component';
import { HeaderComponent } from './student/home/common/header/header.component';
import { FooterComponent } from './student/home/common/footer/footer.component';
import { HomepageComponent } from './student/home/homepage/homepage.component';
import { StudentComponent } from './student/student.component';
import { HomeComponent } from './student/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/student', pathMatch: 'full' },
  {
    path: 'student',
    loadChildren: () => import('./student/student.module')
      .then(m => m.StudentModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module')
      .then(m => m.AdminModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
