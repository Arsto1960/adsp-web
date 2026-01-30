import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-id3',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule],
  templateUrl: './id3.html',
  styleUrls: ['./id3.css'],
})
export class Id3 implements AfterViewInit, OnDestroy {
  @ViewChild('plotCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  // --- PARAMS ---
  snrParam = 40; // dB
  isPlaying = false;

  // --- STATE ---
  private audioCtx: AudioContext | null = null;
  private originalSignal: Float32Array | null = null;
  private sampleRate = 44100;
  private noisySignal: Float32Array | null = null;
  private resizeObserver!: ResizeObserver;
  private ctx!: CanvasRenderingContext2D;

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(() => {
      this.initCanvas();
      this.render();
    });
    if (this.canvasRef) {
      this.resizeObserver.observe(this.canvasRef.nativeElement.parentElement!);
    }

    // Generate default signal on load
    setTimeout(() => this.generateSyntheticSignal(), 100);
  }

  ngOnDestroy() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.audioCtx) this.audioCtx.close();
  }

  // --- ACTIONS ---

  async handleFileUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!this.audioCtx) this.audioCtx = new AudioContext();

    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);

    this.originalSignal = audioBuffer.getChannelData(0); // Use mono
    this.sampleRate = audioBuffer.sampleRate;

    this.updateProcessing();
  }

  generateSyntheticSignal() {
    // Generate a "Speech-like" AM modulated burst
    this.sampleRate = 44100;
    const duration = 2.0;
    const N = Math.floor(duration * this.sampleRate);
    this.originalSignal = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      const t = i / this.sampleRate;
      // Carrier 200Hz, Modulator 5Hz (syllabic rate)
      const envelope = 0.5 * (1 + Math.cos(2 * Math.PI * 5 * t));
      // Add some harmonics for "voice" texture
      const carrier =
        Math.sin(2 * Math.PI * 200 * t) +
        0.5 * Math.sin(2 * Math.PI * 400 * t) +
        0.2 * Math.sin(2 * Math.PI * 600 * t);
      
      // FIXED: Slower decay (-0.5 instead of -2) so it is audible longer
      this.originalSignal[i] = envelope * carrier * Math.exp(-0.5 * t); 
    }
    this.updateProcessing();
  }

  updateProcessing() {
    if (!this.originalSignal) return;

    // 1. Calculate Signal Power
    let sumSq = 0;
    for (let x of this.originalSignal) sumSq += x * x;
    const sigPower = sumSq / this.originalSignal.length;

    // 2. Determine Noise Amplitude
    const targetNoisePower = sigPower / Math.pow(10, this.snrParam / 10);
    const noiseStd = Math.sqrt(targetNoisePower);

    // 3. Generate Noise & Mix
    const N = this.originalSignal.length;
    this.noisySignal = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      // Gaussian Noise: Box-Muller
      let u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      const noise = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

      this.noisySignal[i] = this.originalSignal[i] + noise * noiseStd;
    }

    this.render();
  }

  // FIXED: Direct Audio Playback
  playSignal() {
    if (!this.noisySignal) return;

    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const buffer = this.audioCtx.createBuffer(1, this.noisySignal.length, this.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Copy signal to audio buffer
    for (let i = 0; i < this.noisySignal.length; i++) {
      data[i] = this.noisySignal[i];
    }

    const source = this.audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioCtx.destination);
    source.start();

    this.isPlaying = true;
    source.onended = () => {
      this.isPlaying = false;
    };
  }

 
  private initCanvas() {
    if (!this.canvasRef) return;
    const cvs = this.canvasRef.nativeElement;
    const parent = cvs.parentElement;
    if (!parent || parent.clientWidth === 0) return;

    const dpr = window.devicePixelRatio || 1;
    cvs.width = parent.clientWidth * dpr;
    cvs.height = parent.clientHeight * dpr;

    this.ctx = cvs.getContext('2d')!;
    this.ctx.scale(dpr, dpr);
  }

  private render() {
    if (!this.ctx || !this.noisySignal) return;
    const w =
      this.canvasRef.nativeElement.width / (window.devicePixelRatio || 1);
    const h =
      this.canvasRef.nativeElement.height / (window.devicePixelRatio || 1);

    // Clear
    this.ctx.fillStyle = '#0e1117';
    this.ctx.fillRect(0, 0, w, h);

    // Grid
    this.drawBg(w, h, `Signal + Noise (SNR = ${this.snrParam} dB)`);

    // Plot
    const data = this.noisySignal;
    const step = Math.ceil(data.length / w);

    this.ctx.beginPath();
    this.ctx.strokeStyle = '#00ff00';
    this.ctx.lineWidth = 1;

    const mid = h / 2;
    const maxVal = 2.0; 
    const scaleY = (h / 2 - 20) / maxVal;

    for (let i = 0; i < w; i++) {
      const idx = i * step;
      if (idx >= data.length) break;
      const val = data[idx];
      const y = mid - val * scaleY;
      if (i === 0) this.ctx.moveTo(i, y);
      else this.ctx.lineTo(i, y);
    }
    this.ctx.stroke();
  }

  private drawBg(w: number, h: number, title: string) {
    this.ctx.strokeStyle = '#333';
    this.ctx.beginPath();
    this.ctx.moveTo(0, h / 2);
    this.ctx.lineTo(w, h / 2);
    this.ctx.stroke();

    this.ctx.fillStyle = '#eee';
    this.ctx.font = '14px Helvetica';
    this.ctx.fillText(title, 10, 20);
  }
}