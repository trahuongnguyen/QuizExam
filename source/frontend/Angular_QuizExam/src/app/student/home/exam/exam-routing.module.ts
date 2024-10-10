import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../service/authguard.service';
import { ExamComponent } from './exam.component';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { ResultComponent } from './result/result.component';

const routes: Routes = [
  {
    path: '',
    component: ExamComponent,
    children: [
      {
        path: '',
        component: ListComponent,
      },
      {
        path: 'detail',
        component: DetailComponent
      },
      {
        path: 'result',
        component: ResultComponent,
      },

    ],
    // canActivate: [AuthGuard],
    // data: {roles: ['ADMIN', 'STUDENT']},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamRoutingModule { }