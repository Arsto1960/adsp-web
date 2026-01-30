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
  selector: 'app-id2',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule],
  templateUrl: './id2.html',
  styleUrls: ['./id2.css'],
})
export class Id2 implements AfterViewInit, OnDestroy {
  @ViewChild('timeCanvas') timeCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pdfCanvas') pdfCanvasRef!: ElementRef<HTMLCanvasElement>;

  // --- Parameters ---
  bitDepth = 4; // N (Bits)
  amplitude = 1.0; // Scaling factor (Full range = 1.0)
  signalType = 'Sine'; // 'Sine', 'Triangular', 'Sawtooth'

  // --- Metrics ---
  snrTheoretical = 0;
  snrMeasured = 0;
  quantizationSteps = 0;

  private ctxTime!: CanvasRenderingContext2D;
  private ctxPdf!: CanvasRenderingContext2D;
  private resizeObserver!: ResizeObserver;

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(() => {
      this.initCanvases();
      this.render();
    });

    [this.timeCanvasRef, this.pdfCanvasRef].forEach((ref) => {
      if (ref) this.resizeObserver.observe(ref.nativeElement.parentElement!);
    });
  }

  ngOnDestroy() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }

  // --- SIMULATION ENGINE ---
  render() {
    if (!this.ctxTime || !this.ctxPdf) return;

    const N_samples = 1000;
    const t = this.linspace(0, 2 * Math.PI, N_samples);
    let original = new Float32Array(N_samples);

    // 1. Generate Signal based on Type
    for (let i = 0; i < N_samples; i++) {
      let val = 0;
      if (this.signalType === 'Sine') {
        val = Math.sin(t[i]);
      } else if (this.signalType === 'Triangular') {
        const period = 2 * Math.PI;
        val =
          2 * Math.abs(2 * (t[i] / period - Math.floor(t[i] / period + 0.5))) -
          1;
      } else if (this.signalType === 'Sawtooth') {
        const period = 2 * Math.PI;
        val = 2 * (t[i] / period - Math.floor(t[i] / period + 0.5));
      }
      original[i] = val * this.amplitude; // Apply scaling
    }

    // 2. Quantize
    const L = Math.pow(2, this.bitDepth);
    this.quantizationSteps = L;

    // Step size Delta = FullRange / L = 2 / L
    const delta = 2.0 / L;

    const quantized = new Float32Array(N_samples);
    const error = new Float32Array(N_samples);

    for (let i = 0; i < N_samples; i++) {
      // Normalize to 0..2 range first
      let norm = original[i] + 1;
      let qIndex = Math.floor(norm / delta);
      // Clamp index
      qIndex = Math.max(0, Math.min(L - 1, qIndex));

      // Reconstruct (mid-rise quantizer)
      let qVal = qIndex * delta + delta / 2 - 1;
      quantized[i] = qVal;
      error[i] = original[i] - quantized[i];
    }

    // 3. Calculate SNR (Measured)
    let p_sig = 0,
      p_err = 0;
    for (let i = 0; i < N_samples; i++) {
      p_sig += original[i] * original[i];
      p_err += error[i] * error[i];
    }
    p_sig /= N_samples;
    p_err /= N_samples;

    this.snrMeasured = 10 * Math.log10(p_sig / p_err);

    // 4. Calculate SNR (Theoretical)
    let factor = 0;
    if (this.signalType === 'Sine') factor = 1.76;
    else factor = 0; // Uniform (Tri/Saw) assumption

    const loss = this.amplitude < 1 ? 20 * Math.log10(1 / this.amplitude) : 0;
    this.snrTheoretical = 6.02 * this.bitDepth + factor - loss;

    // --- VISUALIZATION ---
    this.drawTime(original, quantized, error);
    this.drawPDF(original);
  }

  // --- DRAWING HELPERS ---

  drawTime(orig: Float32Array, quant: Float32Array, err: Float32Array) {
    const w = this.ctxTime.canvas.width / (window.devicePixelRatio || 1);
    const h = this.ctxTime.canvas.height / (window.devicePixelRatio || 1);
    this.clearCtx(this.ctxTime, w, h);

    // Plot Signal
    this.drawSignal(this.ctxTime, orig, '#444', 1, false, w, h);
    // Plot Quantized (Stepped)
    this.drawSignal(this.ctxTime, quant, '#00ff00', 2, false, w, h); // Green

    // Plot Error (Zoomed x5 for visibility)
    const errShift = err.map((e) => e * 5 - 1.5);
    this.drawSignal(this.ctxTime, errShift, '#ff0055', 1, false, w, h);

    // Labels
    this.ctxTime.fillStyle = '#aaa';
    this.ctxTime.fillText('Quantized (Green) vs Original (Gray)', 10, 20);
    this.ctxTime.fillStyle = '#ff0055';
    this.ctxTime.fillText('Error Noise (Red, x5 zoomed)', 10, h - 20);
  }

  drawPDF(signal: Float32Array) {
    const w = this.ctxPdf.canvas.width / (window.devicePixelRatio || 1);
    const h = this.ctxPdf.canvas.height / (window.devicePixelRatio || 1);
    this.clearCtx(this.ctxPdf, w, h);

    // Compute Histogram
    const bins = 50;
    const hist = new Array(bins).fill(0);
    for (let s of signal) {
      let idx = Math.floor(((s + 1) / 2) * bins);
      idx = Math.max(0, Math.min(bins - 1, idx));
      hist[idx]++;
    }
    const maxH = Math.max(...hist);

    // Draw
    const binW = w / bins;
    this.ctxPdf.fillStyle = '#00aaff';
    for (let i = 0; i < bins; i++) {
      const barH = (hist[i] / maxH) * (h - 20);
      this.ctxPdf.fillRect(i * binW, h - barH, binW - 1, barH);
    }

    this.ctxPdf.fillStyle = '#eee';
    this.ctxPdf.fillText('Signal Probability Density (PDF)', 10, 20);
  }

  drawSignal(
    ctx: CanvasRenderingContext2D,
    data: Float32Array | Float32Array,
    col: string,
    lw: number,
    step: boolean,
    w: number,
    h: number
  ) {
    const scX = w / data.length;
    const midY = h / 2;
    const scY = h / 2.5; // Scale +/- 1.25

    ctx.strokeStyle = col;
    ctx.lineWidth = lw;
    ctx.beginPath();

    for (let i = 0; i < data.length; i++) {
      const x = i * scX;
      const y = midY - data[i] * scY;
      if (step && i > 0) {
        ctx.lineTo(x, midY - data[i - 1] * scY);
      }
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // --- UTILS ---
  private linspace(s: number, e: number, n: number) {
    const step = (e - s) / (n - 1);
    return Array.from({ length: n }, (_, i) => s + i * step);
  }

  private initCanvases() {
    this.initSingle(this.timeCanvasRef, (c) => (this.ctxTime = c));
    this.initSingle(this.pdfCanvasRef, (c) => (this.ctxPdf = c));
  }

  private initSingle(
    ref: ElementRef,
    cb: (c: CanvasRenderingContext2D) => void
  ) {
    if (!ref) return;
    const cvs = ref.nativeElement;
    const parent = cvs.parentElement;
    if (!parent || parent.clientWidth === 0) return;
    
    const dpr = window.devicePixelRatio || 1;
    
    // UPDATED: Use parent height instead of hardcoded 250
    cvs.width = parent.clientWidth * dpr;
    cvs.height = parent.clientHeight * dpr; 

    const ctx = cvs.getContext('2d')!;
    ctx.scale(dpr, dpr);
    cb(ctx);
  }

  private clearCtx(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.fillStyle = '#0e1117';
    ctx.fillRect(0, 0, w, h);
  }
}