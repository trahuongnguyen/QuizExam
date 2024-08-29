import { Component } from '@angular/core';
import {Swiper} from 'swiper';
import 'swiper/swiper-bundle.css'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  initializeSwiper(){
          // Lấy các phần tử DOM
    const progressCircle = document.querySelector<SVGElement>(".autoplay-progress svg");
    const progressContent = document.querySelector<HTMLSpanElement>(".autoplay-progress span");

    // Kiểm tra xem các phần tử có tồn tại trước khi sử dụng chúng
    if (progressCircle && progressContent) {
        // Tạo Swiper
        const swiper = new Swiper(".mySwiper", {
            spaceBetween: 30,
            centeredSlides: true,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
            },
            on: {
                autoplayTimeLeft(s: any, time: number, progress: number) {
                    progressCircle.style.setProperty("--progress", `${1 - progress}`);
                    progressContent.textContent = `${Math.ceil(time / 1000)}s`;
                }
            }
        });
    }

    }
}

