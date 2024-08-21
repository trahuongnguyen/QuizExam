import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './student/login/login.component';
import { HeaderComponent } from './student/home/common/header/header.component';
import { FooterComponent } from './student/home/common/footer/footer.component';
import { HomepageComponent } from './student/home/homepage/homepage.component';
import { StudentComponent } from './student/student.component';
import { HomeComponent } from './student/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/homepage', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'footer', component: FooterComponent},
  { path: 'homepage', component: HomepageComponent},
  { path: 'student', component: StudentComponent},
  { path: 'home', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
