import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExaminationComponent } from './examination.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { DetailComponent } from './detail/detail.component';
import { FormsModule } from '@angular/forms';
import { ExaminationRoutingModule } from './examination-routing.module';


@NgModule({
  declarations: [
    ExaminationComponent,
    ListComponent,
    FormComponent,
    DetailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ExaminationRoutingModule,
  ]
})
export class ExaminationModule { }
