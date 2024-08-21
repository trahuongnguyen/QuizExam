import { NgModule } from '@angular/core';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { NgClass } from '@angular/common';


@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    HomeRoutingModule,
    NgClass
  ],
  providers: [
  ],
  bootstrap: []
})
export class HomeModule { }