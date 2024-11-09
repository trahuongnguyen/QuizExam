import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogPopupComponent } from './dialog-popup/dialog-popup.component';

@NgModule({
  declarations: [
    DialogPopupComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DialogPopupComponent
  ]
})
export class SharedModule { }