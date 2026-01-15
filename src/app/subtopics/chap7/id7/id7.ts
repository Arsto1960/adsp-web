import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-id7',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSliderModule,
    MatCardModule
  ],
  templateUrl: './id7.html',
  styleUrl: './id7.css',
})
export class Id7 implements AfterViewInit {

  // ---- Controls ----
  r_p = 0.8;
  theta_p = 45;
  r_z = 1.0;
  theta_z = 90;

  // ---- Charts ----
  freqChart!: Chart;
  impulseChart!: Chart;

  @ViewChild('zPlane', { static: true })
  zPlane!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    this.updatePlots();
  }

  updatePlots() {
    const poles = this.getComplex(this.r_p, this.theta_p);
    const zeros = this.getComplex(this.r_z, this.theta_z);

    const freq = this.frequencyResponse(poles, zeros);
    const impulse = this.impulseResponse(poles, zeros);

    this.drawFrequency(freq);
    this.drawImpulse(impulse);
    this.drawZPlane();
  }

  // ---- Math ----
  getComplex(r: number, theta: number) {
    const rad = theta * Math.PI / 180;
    return { re: r * Math.cos(rad), im: r * Math.sin(rad) };
  }

  frequencyResponse(p: any, z: any) {
    const w = Array.from({ length: 256 }, (_, i) => i * Math.PI / 256);
    return w.map(ω => {
      const num = Math.hypot(Math.cos(ω) - z.re, Math.sin(ω) - z.im);
      const den = Math.hypot(Math.cos(ω) - p.re, Math.sin(ω) - p.im);
      return num / den;
    });
  }

  impulseResponse(p: any, z: any) {
    const N = 40;
    const h = Array(N).fill(0);
    h[0] = 1;
    for (let n = 1; n < N; n++) {
      h[n] = p.re * h[n - 1];
    }
    return h;
  }

  // ---- Z Plane ----
  drawZPlane() {
    const canvas = this.zPlane.nativeElement;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width;
    const h = canvas.height;
    const center = w / 2;
    const scale = w / 3;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = this.isStable() ? '#ffffff' : '#ffe6e6';
    ctx.fillRect(0, 0, w, h);

    // Axes
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, center);
    ctx.lineTo(w, center);
    ctx.moveTo(center, 0);
    ctx.lineTo(center, h);
    ctx.stroke();

    // Unit circle
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(center, center, scale, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    const pole = this.getComplex(this.r_p, this.theta_p);
    const zero = this.getComplex(this.r_z, this.theta_z);

    this.drawPole(ctx, center + pole.re * scale, center - pole.im * scale);
    this.drawZero(ctx, center + zero.re * scale, center - zero.im * scale);

    if (this.theta_p > 0 && this.theta_p < 180)
      this.drawPole(ctx, center + pole.re * scale, center + pole.im * scale);

    if (this.theta_z > 0 && this.theta_z < 180)
      this.drawZero(ctx, center + zero.re * scale, center + zero.im * scale);
  }

  drawPole(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 8, y - 8);
    ctx.lineTo(x + 8, y + 8);
    ctx.moveTo(x + 8, y - 8);
    ctx.lineTo(x - 8, y + 8);
    ctx.stroke();
  }

  drawZero(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // ---- Charts ----
  drawFrequency(data: number[]) {
    if (this.freqChart) this.freqChart.destroy();

    this.freqChart = new Chart('freqCanvas', {
      type: 'line',
      data: {
        labels: data.map((_, i) => i / data.length),
        datasets: [{
          data,
          borderColor: '#00a8cc',
          fill: true,
          backgroundColor: 'rgba(0,168,204,0.2)'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });
  }

  drawImpulse(data: number[]) {
    if (this.impulseChart) this.impulseChart.destroy();

    this.impulseChart = new Chart('impCanvas', {
      type: 'bar',
      data: {
        labels: data.map((_, i) => i),
        datasets: [{
          data,
          backgroundColor: '#ff4b4b'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });
  }

  isStable() {
    return this.r_p < 1;
  }
}
