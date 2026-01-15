import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { MathJaxDirective } from '../../../components/mathjax.directive';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-id82',
imports: [CommonModule, FormsModule,MatCardModule, MatSelectModule, MatSliderModule, NgChartsModule , MathJaxDirective],
  templateUrl: './id82.html',
  styleUrl: './id82.css',
})
export class Id82  implements OnInit {
  M: number = 2;
  signalType: 'Step' | 'Ramp' | 'Random' = 'Step';

  L: number = 20; // Signal length
  hSimple: number[] = [1, 2, 3, 2, 1];

  x: number[] = [];
  yLeft: number[] = [];
  yRight: number[] = [];

  inputChartType: ChartType = 'bar';
  leftChartType: ChartType = 'line';
  rightChartType: ChartType = 'line';

  inputChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  leftChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  rightChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };

  ngOnInit(): void {
    this.updateNoble();
  }

  updateNoble(): void {
    // Generate input signal
    if (this.signalType === 'Step') {
      this.x = Array(this.L).fill(1);
    } else if (this.signalType === 'Ramp') {
      this.x = Array.from({ length: this.L }, (_, i) => i);
    } else {
      this.x = Array.from({ length: this.L }, () => Math.floor(Math.random() * 10));
    }

    // Left Side: Downsample -> Filter
    const xDown = this.x.filter((_, i) => i % this.M === 0);
    this.yLeft = this.convolve(xDown, this.hSimple);

    // Right Side: Filter(Up) -> Downsample
    const hUp: number[] = [];
    this.hSimple.forEach(v => {
      hUp.push(v);
      for (let i = 1; i < this.M; i++) hUp.push(0);
    });
    const yTemp = this.convolve(this.x, hUp);
    this.yRight = yTemp.filter((_, i) => i % this.M === 0);

    // Prepare chart data
    this.inputChartData = {
      labels: this.x.map((_, i) => i.toString()),
      datasets: [{ label: 'Input Signal', data: this.x, backgroundColor: 'black' }]
    };
    this.leftChartData = {
      labels: this.yLeft.map((_, i) => i.toString()),
      datasets: [{ label: 'Left Side', data: this.yLeft, borderColor: 'blue', fill: false }]
    };
    this.rightChartData = {
      labels: this.yRight.map((_, i) => i.toString()),
      datasets: [{ label: 'Right Side', data: this.yRight, borderColor: 'red', fill: false }]
    };
  }

  // Simple 1D convolution
  convolve(x: number[], h: number[]): number[] {
    const y = Array(x.length + h.length - 1).fill(0);
    for (let i = 0; i < x.length; i++) {
      for (let j = 0; j < h.length; j++) {
        y[i + j] += x[i] * h[j];
      }
    }
    return y;
  }

  verifyIdentity(): boolean {
    return this.yLeft.length === this.yRight.length &&
           this.yLeft.every((v, i) => Math.abs(v - this.yRight[i]) < 1e-6);
  }
}