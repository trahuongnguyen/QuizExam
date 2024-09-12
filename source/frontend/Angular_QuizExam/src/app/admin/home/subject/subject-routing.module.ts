import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubjectComponent } from './subject.component';
import { ListComponent } from './list/list.component';
import { ChapterComponent } from './chapter/chapter.component';

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
            path: 'chapter',
            component: ChapterComponent
          },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SubjectRoutingModule { }
