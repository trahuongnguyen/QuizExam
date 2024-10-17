import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExaminationComponent } from './examination.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { DetailComponent } from './detail/detail.component';
import { FormsModule } from '@angular/forms';
import { ExaminationRoutingModule } from './examination-routing.module';
import { AddStudentComponent } from './add-student/add-student.component';


@NgModule({
  declarations: [
    ExaminationComponent,
    ListComponent,
    FormComponent,
    DetailComponent,
    AddStudentComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ExaminationRoutingModule,
  ]
})
export class ExaminationModule { }
