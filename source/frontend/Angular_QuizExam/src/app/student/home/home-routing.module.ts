import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarkComponent } from './mark/mark.component';
import { HomeComponent } from './home.component';
import { HomepageComponent } from './homepage/homepage.component';

const routes: Routes = [
    {
    path: '', 
    component: HomeComponent,
    children: [
      {
        path: 'homepage',
        component: HomepageComponent,
      },
      {
        path: '',
        redirectTo: 'homepage',
        pathMatch: 'full'
      },
      {
        path: 'mark',
        component: MarkComponent
      },
    ]
  },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
