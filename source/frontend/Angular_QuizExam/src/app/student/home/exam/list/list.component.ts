import { Component } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  semesters =["Sem 1", "Sem 2", "Sem 3", "Sem 4"];

  isPopupExam = false;
  popupExamIndex: number = 0;

  openPopupExam() {
    this.isPopupExam = true;
  }
 

  closePopupExam(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation(); // Ngăn việc sự kiện click ra ngoài ảnh hưởng đến việc đóng modal
    }
    this.isPopupExam = false;
    this.popupExamIndex = 0; // Reset khi đóng popup
  }
}
