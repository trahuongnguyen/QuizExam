import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { ChapterComponent } from './chapter/chapter.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ListComponent,
    ChapterComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class SubjectModule { }
