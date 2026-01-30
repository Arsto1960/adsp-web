import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-id83',
  templateUrl: './id83.html',
  styleUrls: ['./id83.css'],  // corrected
  imports: [
    CommonModule,
    MatExpansionModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatSliderModule,
    NgChartsModule
  ]
})
export class Id83 implements OnInit {

  M_poly: number = 4;   // Decimation Factor
  N_poly: number = 32;  // Filter length
  h_poly: number[] = [];

  // Cost metrics
  opsDirect: number = 0;
  opsPoly: number = 0;
  speedup: number = 0;

  // Chart
  public polyChartData: ChartConfiguration<'bar'>['data'] = {
    labels: Array.from({ length: 32 }, (_, i) => i),
    datasets: []
  };
  public polyChartType: 'bar' = 'bar';
  public polyChartOptions: ChartConfiguration<'bar'>['options'] = {  // corrected type
    responsive: true,
    plugins: {
      legend: { position: 'top' }
    },
    scales: {
      x: { title: { display: true, text: 'Sample Index' } },
      y: { title: { display: true, text: 'Amplitude' } }
    }
  };

  constructor() { }

  ngOnInit(): void {
    this.updatePolyphase();
  }

  updatePolyphase() {
    // Dummy filter
    this.h_poly = Array.from({ length: this.N_poly }, (_, i) => i + 1);

    // Computational cost
    const L_sig = 10000;
    this.opsDirect = L_sig * this.N_poly;
    this.opsPoly = this.opsDirect / this.M_poly;
    this.speedup = this.M_poly;

    // Update chart
    this.updateChart();
  }

  updateChart() {
    const labels = Array.from({ length: this.N_poly }, (_, i) => i);

    // Original filter as thin bars
    const original = {
      data: this.h_poly,
      label: 'Original H(z)',
      borderColor: 'black',
      backgroundColor: 'black',
      borderWidth: 1,
      barThickness: 3
    };

    // Phase 0
    const h0 = labels.map(i => (i % this.M_poly === 0 ? this.h_poly[i] : 0));
    const phase0 = {
      data: h0,
      label: 'H0 (Phase 0)',
      borderColor: 'red',
      backgroundColor: 'red',
      borderWidth: 1,
      barThickness: 3
    };

    // Phase 1
    const h1 = labels.map(i => (i % this.M_poly === 1 ? this.h_poly[i] : 0));
    const phase1 = {
      data: h1,
      label: 'H1 (Phase 1)',
      borderColor: 'green',
      backgroundColor: 'green',
      borderWidth: 1,
      barThickness: 3
    };

    this.polyChartData = {
      labels,
      datasets: [original, phase0, phase1]
    };
  }
}
