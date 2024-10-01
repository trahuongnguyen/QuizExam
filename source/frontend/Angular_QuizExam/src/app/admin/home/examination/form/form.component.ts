import { Component } from '@angular/core';
import { HomeComponent } from '../../home.component';
import { ExaminationComponent } from '../examination.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {
  constructor(public examComponent: ExaminationComponent){}
}
