import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExaminationComponent } from './examination/examination.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { DetailComponent } from './detail/detail.component';



@NgModule({
  declarations: [
    ExaminationComponent,
    ListComponent,
    FormComponent,
    DetailComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ExaminationModule { }
