import { Component, OnInit, Renderer2, HostListener  } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent  implements OnInit {
  //Mode Switch
  darkModeEnabled = false;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    const buttonSwitch = this.renderer.selectRootElement('#buttonSwitch', true);
    const nav = this.renderer.selectRootElement('#nav-id', true);

    buttonSwitch.addEventListener('click', () => {
      this.darkModeEnabled = !this.darkModeEnabled;
      if (this.darkModeEnabled) {
        this.renderer.removeClass(nav, 'light');
        this.renderer.addClass(nav, 'dark');
      } else {
        this.renderer.removeClass(nav, 'dark');
        this.renderer.addClass(nav, 'light');
      }
    });
  }
}
