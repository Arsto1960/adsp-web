import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-id3',
  standalone: true,
  imports: [FormsModule, MatSliderModule, MatCardModule, MatButtonModule],
  templateUrl: './id3.html',
  styleUrls: ['./id3.css']
})
export class Id3 implements OnInit {

  snrDb = 20;
  isPlaying = false;

  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;

  private audioCtx!: AudioContext;
  private signalOsc!: OscillatorNode;
  private noiseSource!: AudioBufferSourceNode;
  private signalGain!: GainNode;
  private noiseGain!: GainNode;

  // D3
  private svg: any;
  private xScale: any;
  private yScale: any;
  private line: any;

  ngOnInit() {
    this.createChart();
    this.updateChart(); // initial chart
  }

  /* 🔹 D3 Chart Setup */
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
      .domain([-1, 1])
      .range([height - 20, 20]);

    this.line = d3.line<any>()
      .x((d: any) => this.xScale(d.x))
      .y((d: any) => this.yScale(d.y));

    // Axes
    this.svg.append('g')
      .attr('transform', `translate(0, ${height / 2})`)
      .call(d3.axisBottom(this.xScale));

    this.svg.append('g')
      .attr('transform', 'translate(40,0)')
      .call(d3.axisLeft(this.yScale));

    // Wave path
    this.svg.append('path')
      .attr('class', 'wave')
      .attr('fill', 'none')
      .attr('stroke', '#3f51b5')
      .attr('stroke-width', 2);
  }

  /* 🔹 Update chart based on slider */
  updateChart() {
    const snrLinear = Math.pow(10, this.snrDb / 20);
    const signalAmp = 0.5;
    const noiseAmp = signalAmp / snrLinear;

    const data = d3.range(0, 2 * Math.PI, 0.01).map(x => ({
      x,
      y: signalAmp * Math.sin(440 * x) + noiseAmp * (Math.random() * 2 - 1)
    }));

    this.svg.select('.wave')
      .datum(data)
      .attr('d', this.line);
  }

  /* 🔊 AUDIO PLAYBACK */
  startAudio() {
    if (this.isPlaying) return;

    this.audioCtx = new AudioContext();

    /* Signal */
    this.signalOsc = this.audioCtx.createOscillator();
    this.signalOsc.type = 'sine';
    this.signalOsc.frequency.value = 440;

    this.signalGain = this.audioCtx.createGain();
    this.signalGain.gain.value = 0.5;

    /* Noise */
    const bufferSize = this.audioCtx.sampleRate;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    this.noiseSource = this.audioCtx.createBufferSource();
    this.noiseSource.buffer = noiseBuffer;
    this.noiseSource.loop = true;

    this.noiseGain = this.audioCtx.createGain();
    this.updateNoiseLevel();

    /* Connections */
    this.signalOsc.connect(this.signalGain).connect(this.audioCtx.destination);
    this.noiseSource.connect(this.noiseGain).connect(this.audioCtx.destination);

    this.signalOsc.start();
    this.noiseSource.start();
    this.isPlaying = true;

    /* Stop automatically after 1 second */
    this.signalOsc.stop(this.audioCtx.currentTime + 1);
    this.noiseSource.stop(this.audioCtx.currentTime + 1);

    this.signalOsc.onended = () => {
      this.audioCtx.close();
      this.isPlaying = false;
    };
  }

  stopAudio() {
    if (!this.isPlaying) return;

    this.signalOsc.stop();
    this.noiseSource.stop();
    this.audioCtx.close();
    this.isPlaying = false;
  }

  /* 🔹 Update noise based on slider */
  updateNoiseLevel() {
    if (!this.signalGain || !this.noiseGain) return;

    const signalAmp = this.signalGain.gain.value;
    const noiseAmp = signalAmp / Math.pow(10, this.snrDb / 20);
    this.noiseGain.gain.setValueAtTime(noiseAmp, this.audioCtx.currentTime);

    // Update chart visually
    this.updateChart();
  }

}
