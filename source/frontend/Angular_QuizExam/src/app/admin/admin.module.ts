import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AdminRoutingModule } from './admin-routing.module';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import { FormsModule} from '@angular/forms';
import { AdminComponent } from './admin.component';
import { ReactiveFormsModule } from '@angular/forms'; 


@NgModule({
  declarations: [
    LoginComponent,
    AdminComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ToastrModule,
    ReactiveFormsModule
   
  ],
  providers: [
    NgModule
  ],
})
export class AdminModule { }
