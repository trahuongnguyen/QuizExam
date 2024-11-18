
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../service/authguard.service';

import { ExaminationComponent } from './examination.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { DetailComponent } from './detail/detail.component';
import { AddStudentComponent } from './add-student/add-student.component';
import { EditExamInfoComponent } from './edit-exam-info/edit-exam-info.component';

const routes: Routes = [
  {
    path: '',
    component: ExaminationComponent,
    children: [
      {
        path: '',
        component: ListComponent,
      },
      {
        path: 'create-exam',
        component: FormComponent
      },
      {
        path: 'add-student/:examId',
        component: AddStudentComponent
      },
      {
        path: 'detail/:examId',
        component: DetailComponent,
      },
      {
        path: 'edit-exam/:examId',
        component: EditExamInfoComponent
      },
    ],
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'SRO'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExaminationRoutingModule { }
