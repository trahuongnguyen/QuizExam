import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './home/common/header/header.component';
import { HomeComponent } from './home/home.component';
import { StudentComponent } from './student.component';
import { HomepageComponent } from './home/homepage/homepage.component';

const routes: Routes = [
    {
    path: '', 
    component: StudentComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadChildren: () => import('./home/home.module')
          .then(m => m.HomeModule),
      },
    ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StudentRoutingModule { }
