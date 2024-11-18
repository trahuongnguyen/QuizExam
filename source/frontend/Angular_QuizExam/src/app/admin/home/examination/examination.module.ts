import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExaminationComponent } from './examination.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { DetailComponent } from './detail/detail.component';
import { FormsModule } from '@angular/forms';
import { ExaminationRoutingModule } from './examination-routing.module';
import { AddStudentComponent } from './add-student/add-student.component';
import { SharedModule } from '../../../shared/shared.module';
import { EditExamInfoComponent } from './edit-exam-info/edit-exam-info.component';


@NgModule({
  declarations: [
    ExaminationComponent,
    ListComponent,
    FormComponent,
    DetailComponent,
    AddStudentComponent,
    EditExamInfoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ExaminationRoutingModule,
  ]
})
export class ExaminationModule { }
