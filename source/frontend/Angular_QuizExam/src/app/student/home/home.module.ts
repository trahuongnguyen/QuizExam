import { NgModule } from '@angular/core';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { CommonModule, NgClass, NgFor, NgForOf } from '@angular/common';
import { MarkComponent } from './mark/mark.component';


@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    MarkComponent
  ],
  imports: [
    HomeRoutingModule,
    NgClass,
    CommonModule,
    NgForOf
  ],
  providers: [
  ],
  bootstrap: []
})
export class HomeModule { }