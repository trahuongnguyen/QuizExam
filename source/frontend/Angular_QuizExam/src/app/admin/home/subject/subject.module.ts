import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { ChapterComponent } from './chapter/chapter.component';
import { FormsModule } from '@angular/forms';
import { SubjectRoutingModule } from './subject-routing.module';
import { SubjectComponent } from './subject.component';


@NgModule({
  declarations: [
    SubjectComponent,
    ListComponent,
    ChapterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SubjectRoutingModule
  ]
})
export class SubjectModule { }
