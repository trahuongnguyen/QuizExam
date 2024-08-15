import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './homepage/homepage.component';
import { ProfileComponent } from './profile/profile.component';
import { MarkComponent } from './mark/mark.component';



@NgModule({
  declarations: [
    HomepageComponent,
    ProfileComponent,
    MarkComponent
  ],
  imports: [
    CommonModule
  ]
})
export class HomeModule { }
