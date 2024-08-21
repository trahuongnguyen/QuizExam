import { NgModule } from '@angular/core';
import { StudentRoutingModule } from './student-routing.module';

import { FormsModule, NgModel } from '@angular/forms';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import { StudentComponent } from './student.component';
import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [
    StudentComponent,
    LoginComponent
  ],
  imports: [
    ToastrModule,
    StudentRoutingModule,
    FormsModule,
  ],
  providers: [
    NgModule
  ],
  bootstrap: []
})
export class StudentModule { }
