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
  selector: 'app-id1',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule],
  templateUrl: './id1.html',
  styleUrls: ['./id1.css'],
})
export class Id1 implements AfterViewInit, OnDestroy {
  @ViewChild('waveCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  // --- PARAMS ---
  amp = 5.0; // 0 to 10
  freq = 440; // 0 to 1000 Hz
  phase = 0.0; // -PI to PI

  private ctx!: CanvasRenderingContext2D;
  private resizeObserver!: ResizeObserver;

  // Audio State
  private audioCtx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  isPlaying = false;

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(() => {
      this.initCanvas();
      this.draw();
    });
    if (this.canvasRef) {
      this.resizeObserver.observe(this.canvasRef.nativeElement.parentElement!);
    }
    // Initial draw
    setTimeout(() => this.draw(), 0);
  }

  ngOnDestroy() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
    this.stopAudio();
    if (this.audioCtx) this.audioCtx.close();
  }

  // --- ACTIONS ---

  update() {
    this.draw();
    if (this.isPlaying) {
      this.updateAudioParams();
    }
  }

  toggleAudio() {
    if (this.isPlaying) {
      this.stopAudio();
    } else {
      this.startAudio();
    }
  }

  private startAudio() {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
    this.audioCtx.resume();

    this.osc = this.audioCtx.createOscillator();
    this.osc.type = 'sine';

    this.gain = this.audioCtx.createGain();
    this.osc.connect(this.gain);
    this.gain.connect(this.audioCtx.destination);

    this.updateAudioParams();
    this.osc.start();
    this.isPlaying = true;
  }

  private stopAudio() {
    if (this.osc) {
      this.osc.stop();
      this.osc.disconnect();
      this.osc = null;
    }
    this.isPlaying = false;
  }

  private updateAudioParams() {
    if (this.osc && this.gain && this.audioCtx) {
      // Ramp to avoid clicks
      const now = this.audioCtx.currentTime;
      this.osc.frequency.setTargetAtTime(this.freq, now, 0.05);
      // Map amp 0-10 to 0-0.5 gain to prevent clipping
      this.gain.gain.setTargetAtTime(this.amp / 20, now, 0.05);
    }
  }


  // --- VISUALIZATION ---
  private initCanvas() {
    if (!this.canvasRef) return;
    const cvs = this.canvasRef.nativeElement;
    const parent = cvs.parentElement;
    if (!parent || parent.clientWidth === 0) return;

    const dpr = window.devicePixelRatio || 1;
    // MATCH PARENT SIZE exactly
    cvs.width = parent.clientWidth * dpr;
    cvs.height = parent.clientHeight * dpr;

    this.ctx = cvs.getContext('2d')!;
    this.ctx.scale(dpr, dpr);
  }

  private draw() {
    if (!this.ctx) return;
    const cvs = this.canvasRef.nativeElement;
    // Logical width/height (CSS pixels)
    const w = cvs.width / (window.devicePixelRatio || 1);
    const h = cvs.height / (window.devicePixelRatio || 1);

    // 1. Clear with Dark Background (Scope Screen Color)
    this.ctx.fillStyle = '#0a0a0a'; 
    this.ctx.fillRect(0, 0, w, h);

    // 2. Draw Grid
    this.drawGrid(w, h);

    // 3. Draw Sine Wave
    const viewDuration = 0.01; // 10ms window
    const sampleRate = 44100;
    const totalSamples = Math.floor(viewDuration * sampleRate);

    // Scale calculation
    const paddingX = 40;
    const scX = (w - paddingX) / totalSamples;
    const maxAmp = 11; 
    const scY = (h / 2 - 20) / maxAmp;
    const midY = h / 2;
    const offX = paddingX;

    this.ctx.beginPath();
    // NEON CYAN COLOR for the wave
    this.ctx.strokeStyle = '#00e5ff'; 
    this.ctx.lineWidth = 3;
    // Add a slight glow effect (optional, looks great)
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = '#00e5ff';

    for (let i = 0; i < totalSamples; i++) {
      const t = i / sampleRate;
      const y = this.amp * Math.sin(2 * Math.PI * this.freq * t + this.phase);

      const px = offX + i * scX;
      const py = midY - y * scY;

      if (i === 0) this.ctx.moveTo(px, py);
      else this.ctx.lineTo(px, py);
    }
    this.ctx.stroke();
    
    // Reset shadow for text
    this.ctx.shadowBlur = 0;

    // 4. Labels
    this.ctx.fillStyle = '#666';
    this.ctx.font = '10px monospace';
    this.ctx.fillText('+10', 5, midY - 10 * scY);
    this.ctx.fillText('-10', 5, midY + 10 * scY);
    this.ctx.fillText('0', 10, midY + 3);
    
    this.ctx.fillStyle = '#888';
    this.ctx.fillText('Amplitude', 5, 20);
    this.ctx.fillText('Time -> (10ms)', w - 80, h - 10);
  }

  private drawGrid(w: number, h: number) {
    this.ctx.strokeStyle = '#222'; // Very subtle dark grey
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    
    // Horizontal Center
    this.ctx.moveTo(0, h/2);
    this.ctx.lineTo(w, h/2);
    
    // Vertical grid every 10%
    const stepX = w / 10;
    for(let x = 0; x < w; x+=stepX) {
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, h);
    }

    // Horizontal grid lines
    const stepY = h / 8;
    for(let y = 0; y < h; y+=stepY) {
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(w, y);
    }

    this.ctx.stroke();
  }
}