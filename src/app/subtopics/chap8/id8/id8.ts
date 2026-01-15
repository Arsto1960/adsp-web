import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { Id82 } from '../id82/id82';
import { Id83 } from '../id83/id83';


@Component({
  selector: 'app-id8',
standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatSliderModule,
    MatSelectModule,
    MatCardModule,
    NgChartsModule , Id82, Id83
  ],  templateUrl: './id8.html',
  styleUrl: './id8.css',
})

export class Id8 implements OnInit {


  // === FIR Design Remez approximation ===
  // Filter Parameters
  N: number = 32;
  passEdge: number = 0.1;
  stopEdge: number = 0.2;
  wPass: number = 1.0;
  wStop: number = 100.0;

  // FIR Data
  freqLabels: number[] = [];
  freqMag: number[] = [];
  impulseLabels: number[] = [];
  impulseData: number[] = [];

  freqChartType: ChartType = 'line';
  impulseChartType: ChartType = 'bar';

  freqChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  impulseChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };

  ngOnInit(): void {
    this.updateFIR();
  }

  updateFIR(): void {
    // --- Generate FIR filter using Remez ---
    const h = this.remezFIR(this.N, this.passEdge, this.stopEdge, this.wPass, this.wStop);

    // --- Frequency Response ---
    const { freq, Hmag } = this.freqResponse(h);

    this.freqLabels = freq;
    this.freqMag = Hmag;

    this.freqChartData = {
      labels: this.freqLabels,
      datasets: [{
        data: this.freqMag,
        label: 'Magnitude (dB)',
        borderColor: '#00a8cc',
        fill: true,
        backgroundColor: 'rgba(0,168,204,0.2)'
      }]
    };

    // --- Impulse Response ---
    this.impulseLabels = Array.from({ length: h.length }, (_, i) => i);
    this.impulseData = h;

    this.impulseChartData = {
      labels: this.impulseLabels,
      datasets: [{
        data: this.impulseData,
        label: 'h[n]',
        backgroundColor: '#ff4b4b'
      }]
    };
  }

  // === FIR Design using Remez approximation ===
  remezFIR(N: number, passEdge: number, stopEdge: number, wPass: number, wStop: number): number[] {
    // Simple equiripple approximation: ideal low-pass with linear phase
    const h: number[] = [];
    const fc = passEdge; // normalized cutoff

    for (let n = 0; n < N; n++) {
      const m = n - (N - 1) / 2;
      if (m === 0) h.push(2 * fc);
      else h.push(Math.sin(2 * Math.PI * fc * m) / (Math.PI * m));
    }
    return h;
  }

  // === Frequency Response ===
  freqResponse(h: number[]): { freq: number[], Hmag: number[] } {
    const NFFT = 512;
    const freq: number[] = [];
    const Hmag: number[] = [];

    for (let k = 0; k < NFFT; k++) {
      let re = 0, im = 0;
      const f = k / (2 * NFFT); // normalized 0-0.5
      freq.push(f);
      for (let n = 0; n < h.length; n++) {
        re += h[n] * Math.cos(-2 * Math.PI * f * n);
        im += h[n] * Math.sin(-2 * Math.PI * f * n);
      }
      const mag = 20 * Math.log10(Math.sqrt(re * re + im * im) + 1e-12);
      Hmag.push(mag);
    }

    return { freq, Hmag };

}

}
