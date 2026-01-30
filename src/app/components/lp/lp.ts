import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import { MatCard } from '@angular/material/card';

import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-lp',
  standalone: true,
  imports: [MatIcon , MatCard , RouterModule],
  templateUrl: './lp.html',
  styleUrls: ['./lp.css'],
})
export class Lp implements AfterViewInit {
  @ViewChild('nav1') nav1!: ElementRef;
  @ViewChild('nav2') nav2!: ElementRef;
  @ViewChild('center1') center1!: ElementRef;
  @ViewChild('about1') about1!: ElementRef;
  @ViewChild('platform') platform!: ElementRef;

  ngAfterViewInit() {
    gsap.registerPlugin(ScrollTrigger);

    // Timeline 1 for nav + center section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.nav1.nativeElement,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
        
      }
    });

    tl.from(this.nav1.nativeElement, {
      y: -30,
      opacity: 0,
      duration: 0.5,
    
    })
      .from(this.nav2.nativeElement, {
        y: -40,
        opacity: 0,
        duration: 0.5,
        delay: 0.5
      })
      .from(this.center1.nativeElement.querySelector('h1'), {
        x: -300,
        opacity: 0,
      }, '-=0.3')
      .from(this.center1.nativeElement.querySelector('h2'), {
        x: -200,
        opacity: 0,
      }, '-=0.3')
      .from(this.center1.nativeElement.querySelector('button'), {
        y: 40,
        opacity: 0,
      }, '-=0.3');
     

    // Timeline 2 for about section / platform
    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: this.platform.nativeElement,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
         scrub:2,
      }
    });

    tl2.from(this.about1.nativeElement, {
      x: -200,
      opacity: 0,
      duration: 0.5,
     
    }, '-=0.3')
    
    tl2.from(this.platform.nativeElement, {
      x: 100,
      duration: 0.5,
     
    }, '-=0.3')
  }
}
