
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubjectComponent } from './subject.component';
import { ListComponent } from './list/list.component';
import { ChapterComponent } from './chapter/chapter.component';
import { QuestionListComponent } from './question-list/question-list.component';
import { QuestionFormComponent } from './question-form/question-form.component';

const routes: Routes = [
  {
    path: '',
    component: SubjectComponent,
    children: [
      {
        path: '',
        component: ListComponent,
      },
      // {
      //   path: '',
      //   redirectTo: 'subject',
      //   pathMatch: 'full'
      // },
      {
        path: ':subjectId',
        component: ChapterComponent
      },
      {
        path: ':subjectId/questionList',
        component: QuestionListComponent,
      },
      {
        path: ':subjectId/questionForm',
        component: QuestionFormComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubjectRoutingModule { }
