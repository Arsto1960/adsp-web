import { Component, OnInit } from '@angular/core';
import { makeBlobs } from '../../../utils/makeBlobs';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-id5',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatSliderModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    NgChartsModule
  ],
  templateUrl: './id5.html',
  styleUrls: ['./id5.css'],
})
export class Id5 implements OnInit {

  /* ===== Data Setup ===== */
  samples = 1000;
  clusters = 4;
  dispersion = 0.8;

  /* ===== Algorithm ===== */
  targetSize = 8;
  epsilon = 0.02;

  /* ===== State ===== */
  data: number[][] = [];
  codebook: number[][] = [];
  history: number[] = [];
  stage = 'Init';

  /* ===== Charts ===== */
  scatterChartData!: ChartConfiguration<'bubble'>['data'];
  distortionChartData!: ChartConfiguration<'line'>['data'];

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    animation: false,
    scales: {
      x: { title: { display: true, text: 'X' } },
      y: { title: { display: true, text: 'Y / Distortion' } }
    }
  };

  ngOnInit(): void {
    this.generateData();
  }

  generateData(): void {
    const { X } = makeBlobs(this.samples, this.clusters, this.dispersion);
    this.data = X;
    this.codebook = [this.meanPoint(X)];
    this.history = [];
    this.stage = 'Init';
    this.updateScatterChart();
    this.updateDistortionChart();
  }

  meanPoint(points: number[][]): number[] {
    const dim = points[0].length;
    const mean = Array(dim).fill(0);
    for (let p of points)
      for (let i = 0; i < dim; i++)
        mean[i] += p[i];
    return mean.map(v => v / points.length);
  }

  getDistortion(X: number[][], cb: number[][]): number {
    let total = 0;
    for (let x of X) {
      const dists = cb.map(c =>
        x.reduce((s, v, i) => s + (v - c[i]) ** 2, 0)
      );
      total += Math.min(...dists);
    }
    return total / X.length;
  }

  stepKMeans(X: number[][], cb: number[][]): number[][] {
    const labels = X.map(x => {
      const dists = cb.map(c =>
        x.reduce((s, v, i) => s + (v - c[i]) ** 2, 0)
      );
      return dists.indexOf(Math.min(...dists));
    });

    return cb.map((_, i) => {
      const pts = X.filter((_, idx) => labels[idx] === i);
      return pts.length ? this.meanPoint(pts) : X[Math.floor(Math.random() * X.length)];
    });
  }

  split(cb: number[][]): number[][] {
    return cb.flatMap(v => [
      v.map(x => x * (1 + this.epsilon)),
      v.map(x => x * (1 - this.epsilon))
    ]);
  }

  doubleN(): void {
    if (this.codebook.length >= this.targetSize) return;

    this.codebook = this.split(this.codebook);
    this.stage = 'Split';

    for (let i = 0; i < 10; i++) {
      const newCb = this.stepKMeans(this.data, this.codebook);
      this.codebook = newCb;
      this.history.push(this.getDistortion(this.data, this.codebook));
    }

    this.stage = 'Optimized';
    this.updateScatterChart();
    this.updateDistortionChart();
  }

  reset(): void {
    this.generateData();
  }

  /* ================= CHARTS ================= */

  updateScatterChart(): void {
    this.scatterChartData = {
      datasets: [
        {
          label: 'Data',
          data: this.data.map(p => ({ x: p[0], y: p[1], r: 4 })),
          backgroundColor: 'rgba(0,123,255,0.6)'
        },
        {
          label: 'Centroids',
          data: this.codebook.map(p => ({ x: p[0], y: p[1], r: 8 })),
          backgroundColor: 'rgba(220,53,69,0.8)'
        }
      ]
    };
  }

  updateDistortionChart(): void {
    this.distortionChartData = {
      labels: this.history.map((_, i) => i),
      datasets: [
        {
          label: 'MSE',
          data: this.history,
          borderColor: 'black',
          fill: false
        }
      ]
    };
  }
}
