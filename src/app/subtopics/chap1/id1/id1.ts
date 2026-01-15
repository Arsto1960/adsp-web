import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-id1',
  standalone: true,
  imports: [
    FormsModule,
    MatSliderModule,
    MatCardModule,
    MatButtonModule
],
  templateUrl: './id1.html',
  styleUrl: './id1.css',
})
export class Id1 implements OnInit {

  amplitude = 1;
  frequency = 1;
  phase = 0;

  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;

  private svg: any;
  private xScale: any;
  private yScale: any;
  private line: any;

  // 🔊 Audio
  private audioCtx!: AudioContext;
  private oscillator!: OscillatorNode;
  private gainNode!: GainNode;
  isPlaying = false;

  ngOnInit(): void {
    this.createChart();
    this.updateChart();
  }

  createChart() {
    const width = 700;
    const height = 300;

    this.svg = d3.select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    this.xScale = d3.scaleLinear()
      .domain([0, 2 * Math.PI])
      .range([40, width - 20]);

    this.yScale = d3.scaleLinear()
      .domain([-2, 2])
      .range([height - 20, 20]);

    this.line = d3.line<any>()
      .x((d: any) => this.xScale(d.x))
      .y((d: any) => this.yScale(d.y));

    this.svg.append('g')
      .attr('transform', `translate(0, ${height / 2})`)
      .call(d3.axisBottom(this.xScale));

    this.svg.append('g')
      .attr('transform', 'translate(40,0)')
      .call(d3.axisLeft(this.yScale));

    this.svg.append('path')
      .attr('class', 'wave')
      .attr('fill', 'none')
      .attr('stroke', '#3f51b5')
      .attr('stroke-width', 2);
  }

  updateChart() {
    const data = d3.range(0, 2 * Math.PI, 0.01).map((x: number) => ({
      x,
      y: this.amplitude * Math.sin(this.frequency * x + this.phase)
    }));

    this.svg.select('.wave')
      .datum(data)
      .attr('d', this.line);

    // 🔊 Update audio live
    if (this.isPlaying) {
      this.oscillator.frequency.setValueAtTime(
        this.frequency * 100,
        this.audioCtx.currentTime
      );

      this.gainNode.gain.setValueAtTime(
        this.amplitude / 2,
        this.audioCtx.currentTime
      );

      const real = new Float32Array([0, Math.cos(this.phase)]);
      const imag = new Float32Array([0, Math.sin(this.phase)]);
      const wave = this.audioCtx.createPeriodicWave(real, imag);
      this.oscillator.setPeriodicWave(wave);
    }
  }

 startAudio() {
  if (this.isPlaying) return;

  this.audioCtx = new AudioContext();

  this.oscillator = this.audioCtx.createOscillator();
  this.gainNode = this.audioCtx.createGain();

  this.oscillator.type = 'sine';
  this.oscillator.frequency.value = this.frequency * 100; // Hz
  this.gainNode.gain.value = this.amplitude / 2;

  // Phase control
  const real = new Float32Array([0, Math.cos(this.phase)]);
  const imag = new Float32Array([0, Math.sin(this.phase)]);
  const wave = this.audioCtx.createPeriodicWave(real, imag);
  this.oscillator.setPeriodicWave(wave);

  this.oscillator.connect(this.gainNode);
  this.gainNode.connect(this.audioCtx.destination);

  this.oscillator.start();
  this.isPlaying = true;

  // 🔴 AUTO STOP AFTER 1 SECOND
  this.oscillator.stop(this.audioCtx.currentTime + 1);

  this.oscillator.onended = () => {
    this.audioCtx.close();
    this.isPlaying = false;
  };
}

 
}
