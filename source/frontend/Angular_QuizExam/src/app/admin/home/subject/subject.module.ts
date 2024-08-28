import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { ChapterComponent } from './chapter/chapter.component';



@NgModule({
  declarations: [
    ListComponent,
    ChapterComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SubjectModule { }
