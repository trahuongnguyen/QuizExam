
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../service/authguard.service';

import { AuthorizeComponent } from './authorize.component';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';

const routes: Routes = [
  {
    path: '',
    component: AuthorizeComponent,
    children: [
      {
        path: '',
        component: ListComponent,
      },
      {
        path: 'detail/:roleId',
        component: DetailComponent,
      },
    ],
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'DIRECTOR'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthorizeRoutingModule { }
