import { NgModule } from '@angular/core';
import { StudentRoutingModule } from './student-routing.module';

import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import { StudentComponent } from './student.component';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    StudentComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    ToastrModule,
    StudentRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    NgModule
  ],
  bootstrap: []
})
export class StudentModule { }
