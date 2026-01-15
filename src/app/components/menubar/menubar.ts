import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';

// Angular Material modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTreeModule } from '@angular/material/tree';

interface MenuNode {
  icon: string;
  label: string;
  route: string;
  children?: MenuNode[];
}



// Menu items available for sidenav, why? easily editable code for buttons on sidebar
const menuItems: MenuNode[] = [
  {
    icon: 'keyboard_double_arrow_right', // Icon for the 'Home' menu item. where to get? Material Icon just google it and there are plenty of icons
    label: '1. Introduction ',     // Label for the 'Home' menu item
    route: 'chapter1',     // Route to navigate to when 'Home' is clicked
    children: [
      {
        icon: 'science',
        label: 'Lab ',
        route: 'chapter1/lab1'
      },
       {
        icon: 'play_circle',
        label: 'Interactive Demo',
        route: 'chapter1/id1'
      },

    ]
  },
  {
    icon: 'keyboard_double_arrow_right',      
    label: '2. Quantization Signal to Noise Ratio (SNR)',
    route: 'chapter2', // Route to navigate to when 'Analytics' is clicked
    children: [
      {
        icon: 'topic',
        label: '2.1 Calculating the SNR ',
        route: 'chapter2/subtopic1'
      },
      {
        icon: 'topic',
        label: '2.2  Non-full Range Signals ',
        route: 'chapter2/subtopic2'
      },
      {
        icon: 'topic',
        label: '2.3 Non-uniformly Distributed Signals ',
        route: 'chapter2/subtopic1.3'
      },
      {
        icon: 'science',
        label: 'Lab ',
        route: 'chapter2/lab2'
      },
    ]
  },
  {
    icon: 'keyboard_double_arrow_right',      
    label: '3. SNR and Non-uniform Quantization',
    route: 'chapter3',
    children: [
      {
        icon: 'topic',
        label: '3.1 SNR with Sinusoidal Signals ',
        route: 'chapter3/subtopic31'
      },
      {
        icon: 'topic',
        label: '3.2 Companding',
        route: 'chapter3/subtopic32'
      },
      {
        icon: 'science',
        label: 'Lab',
        route: 'chapter3/lab3'
      },
       {
        icon: 'play_circle',
        label: 'Interactive Demo',
        route: 'chapter3/id3'
      },
    ]
  },

  {
    icon: 'keyboard_double_arrow_right',      
    label: '4. Lloyd-Max Quantizer ',
    route: 'chapter4'
    ,
    children: [
     
       {
        icon: 'science',
        label: 'Lab ',
        route: 'chapter4/lab4'
      },
    ]
  },

  {
    icon: 'keyboard_double_arrow_right',      
    label: ' 5. Vector Quantization, LBG',
    route: 'chapter5'
    ,
    children: [
      
      {
        icon: 'science',
        label: 'Lab ',
        route: 'chapter5/lab5'
      },
       {
        icon: 'play_circle',
        label: 'Interactive Demo',
        route: 'chapter5/id5'
      },
    ]
  },
  {
    icon: 'keyboard_double_arrow_right',      
    label: '6. Sampling: Downsampling, Upsampling',
    route: 'chapter6'
    ,
    children: [
      {
        icon: 'topic',
        label: '6.1. Sampling the Analog Signal, Normalized Frequency',
        route: 'chapter6/st61'
      },
       {
        icon: 'topic',
        label: '6.2 Upsampling',
        route: 'chapter6/st62'
      },
       {
        icon: 'topic',
        label: '6.3 Reconstruction ',
        route: 'chapter6/st63'
      },
      {
        icon: 'science',
        label: ' Lab ',
        route: 'chapter6/lab6'
      },
       {
        icon: 'play_circle',
        label: ' Interactive Demo ',
        route: 'chapter6/id6'
      },
    ]
  },
  {
    icon: 'keyboard_double_arrow_right',      
    label: '7. z-Transform, Filters',
    route: 'chapter7'
    ,
    children: [
      {
        icon: 'topic',
        label: '7.1 The z-Transform ',
        route: 'chapter7/subtopic71'
      },
      {
        icon: 'topic',
        label: '7.2 Filters',
        route: 'chapter7/subtopic72'
      },
      {
        icon: 'science',
        label: ' Lab ',
        route: 'chapter7/lab7'
      },
       {
        icon: 'play_circle',
        label: ' Interactive Demo ',
        route: 'chapter7/id7'
      },
    ]
  },
  {
    icon: 'keyboard_double_arrow_right',      
    label: '8. Filters, Noble Identities',
    route: 'chapter8'
    ,
    children: [
      {
        icon: 'topic',
        label: '8.1 Filter Design  ',
        route: 'chapter8/subtopic81'
      },
      {
        icon: 'topic',
        label: ' 8.2 Filtering and Sampling, Multirate Noble Identities ',
        route: 'chapter8/subtopic82'
      },
      {
        icon: 'topic',
        label: ' 8.3 Polyphase Representation  ',
        route: 'chapter8/subtopic83'
      },
      {
        icon: 'science',
        label: ' Lab ',
        route: 'chapter8/lab8'
      },
       {
        icon: 'play_circle',
        label: ' Interactive Demo ',
        route: 'chapter8/id8'
      },
    ]
  },
  {
    icon: 'keyboard_double_arrow_right',      
    label: '9. Allpass Filters, Warping',
    route: 'chapter9'
    ,
    children: [

      {
        icon: 'science',
        label: ' Lab',
        route: 'chapter9/lab9'
      },
    ]
  },
  {
    icon: 'keyboard_double_arrow_right',      
    label: '10. Minimum Phase Filters',
    route: 'chapter10'
    ,
    children: [
      {
        icon: 'topic',
        label: '10.1 Introduction ',
        route: 'chapter10/subtopic101'
      },
        {
        icon: 'topic',
        label: '10.2 Summary of Minimum Phase Filters ',
        route: 'chapter10/subtopic102'
      },
        {
        icon: 'topic',
        label: '10.3 Homework Problems ',
        route: 'chapter10/subtopic103'
      },
      {
        icon: 'science',
        label: ' Lab',
        route: 'chapter10/lab10'
      },
    ]
  },
  {
    icon: 'keyboard_double_arrow_right',      
    label: '11. Hilbert Transform',
    route: 'chapter11'
    ,
    children: [
      {
        icon: 'topic',
        label: ' Introduction ',
        route: 'chapter11/subtopic111'
      },
        {
        icon: 'topic',
        label: '11.1 Python Example ',
        route: 'chapter11/subtopic112'
      },
      {
        icon: 'topic',
        label: '11.3 Summary ',
        route: 'chapter11/subtopic113'
      },
       {
        icon: 'science',
        label: ' Lab',
        route: 'chapter11/lab11'
      },
    ]
  },
  {
    icon: 'keyboard_double_arrow_right',      
    label: '12. Wiener & Matched Filters',
    route: 'chapter12'
    ,
    children: [
      {
        icon: 'topic',
        label: '12.1 Introduction & Wiener Filter',
        route: 'chapter12/subtopic121'
      },
         {
        icon: 'topic',
        label: '12.2 Matched Filter',
        route: 'chapter12/subtopic122'
      },
         {
        icon: 'topic',
        label: '12.3 Prediction',
        route: 'chapter12/subtopic123'
      },
         {
        icon: 'topic',
        label: '12.4 Python Example ',
        route: 'chapter12/subtopic124'
      },
         {
        icon: 'topic',
        label: '12.5 Neural Network Implementation ',
        route: 'chapter12/subtopic125'
      },
         {
        icon: 'topic',
        label: '12.6 Online Adaptation, LPC ',
        route: 'chapter12/subtopic126'
      },
         {
        icon: 'topic',
        label: '12.7 Least Mean Squares (LMS) Algorithm',
        route: 'chapter12/subtopic127'
      },
         {
        icon: 'topic',
        label: '12.8 Prediction with Quantizer',
        route: 'chapter12/subtopic128'
      },
         {
        icon: 'topic',
        label: '12.9 Summary',
        route: 'chapter12/subtopic129'
      },

     {
        icon: 'topic',
        label: '12.10 Homework Problems ',
        route: 'chapter12/subtopic1210'
      },

       {
        icon: 'science',
        label: ' Lab',
        route: 'chapter12/lab12'
      },
    ]
  },
  {
    icon: 'book_2',      
    label: '13. Bibliography',
    route: 'bibliography',
   

  },

];


@Component({
  selector: 'app-menubar',
  imports: [
    FormsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    RouterModule,
    MatTreeModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatBadgeModule
],
  templateUrl: './menubar.html',
  styleUrl: './menubar.css'
})
export class Menubar {


  isMobile = false;
  badgevisible = false;

  dataSource = menuItems;

  childrenAccessor = (node: MenuNode) => node.children ?? [];
  hasChild = (_: number, node: MenuNode) =>
    !!node.children && node.children.length > 0;

  /* ✅ CONSTRUCTOR — INSIDE CLASS */
  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private snackBar: MatSnackBar
  ) {
    // Listen to route changes and scroll to top
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }



  /* ✅ LIFECYCLE HOOK */
  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  badgevisibility() {
    this.badgevisible = !this.badgevisible;
  }


}