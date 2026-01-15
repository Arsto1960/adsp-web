import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-id6',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSliderModule,
    MatCardModule,
    NgChartsModule
  ],
  templateUrl: './id6.html',
  styleUrls: ['./id6.css']
})
export class Id6 implements OnInit {

  /* ===== Slider ===== */
  downsampleFactor = 1;

  /* ===== Signal params ===== */
  fs = 8000;
  f0 = 150;
  duration = 0.02;

  /* ===== Chart configs ===== */
  timeChartData!: ChartConfiguration<'line'>['data'];
  freqChartData!: ChartConfiguration<'line'>['data'];

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    animation: false,
    scales: {
      x: { title: { display: true, text: 'Time / Frequency' } },
      y: { title: { display: true, text: 'Amplitude / Magnitude (dB)' } }
    }
  };

  ngOnInit() {
    this.updateSignals();
  }

  onChange() {
    this.updateSignals();
  }

  /* ================= SIGNAL PROCESSING ================= */

  updateSignals() {
    const N = Math.floor(this.fs * this.duration);
    const t: number[] = [];
    const original: number[] = [];

    for (let n = 0; n < N; n++) {
      const time = n / this.fs;
      t.push(time);
      original.push(Math.sign(Math.sin(2 * Math.PI * this.f0 * time)));
    }

    const down = original.filter((_, i) => i % this.downsampleFactor === 0);
    const tDown = down.map((_, i) => i / (this.fs / this.downsampleFactor));

    /* ===== Time domain chart ===== */
    this.timeChartData = {
      labels: t,
      datasets: [
        {
          label: 'Original',
          data: original,
          borderColor: 'blue',
          pointRadius: 0
        },
        {
          label: `Downsampled ×${this.downsampleFactor}`,
          data: down,
          borderColor: 'red',
          pointRadius: 0
        }
      ]
    };

    /* ===== Frequency domain chart ===== */
    this.freqChartData = {
      labels: this.computeFFT(original, this.fs).map(p => p.x),
      datasets: [
        {
          label: 'Original',
          data: this.computeFFT(original, this.fs).map(p => p.y),
          borderColor: 'green',
          pointRadius: 0
        },
        {
          label: `Downsampled ×${this.downsampleFactor}`,
          data: this.computeFFT(down, this.fs / this.downsampleFactor).map(p => p.y),
          borderColor: 'orange',
          pointRadius: 0
        }
      ]
    };
  }

  /* ================= FFT ================= */

  computeFFT(signal: number[], fs: number) {
    const N = signal.length;
    const result: { x: number; y: number }[] = [];

    for (let k = 0; k < N / 2; k++) {
      let re = 0;
      let im = 0;

      for (let n = 0; n < N; n++) {
        const angle = (2 * Math.PI * k * n) / N;
        re += signal[n] * Math.cos(angle);
        im -= signal[n] * Math.sin(angle);
      }

      const mag = Math.sqrt(re * re + im * im) / N;
      result.push({
        x: (k * fs) / N,
        y: 20 * Math.log10(mag + 1e-6)
      });
    }

    return result;
  }
}
