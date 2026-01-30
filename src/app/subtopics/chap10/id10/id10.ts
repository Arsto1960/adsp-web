import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-id10',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule],
  templateUrl: './id10.html',
  styleUrls: ['./id10.css'],
})
export class Id10 implements AfterViewInit, OnInit {
  @ViewChild('canvas1') canvas1Ref!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasEq') canvasEqRef!: ElementRef<HTMLCanvasElement>;

  activeModule: 'PHASE' | 'EQUALIZER' = 'PHASE';

  // --- MODULE 1: PHASE ---
  phaseParams = {
    taps: 17,
    window: 'hamming',
  };
  phaseMetrics = { linDelay: 0, minDelay: 0, savings: 0 };

  // --- MODULE 2: EQUALIZER ---
  eqParams = {
    type: 'MIN' as 'MIN' | 'NON_MIN',
  };
  eqStatus = { unstable: false };

  private ctx1!: CanvasRenderingContext2D;
  private ctxEq!: CanvasRenderingContext2D;

  ngOnInit() {
    this.runSimulation();
  }

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(() => {
      this.initCanvases();
      this.runSimulation();
    });

    [this.canvas1Ref, this.canvasEqRef].forEach((ref) => {
      if (ref) this.resizeObserver.observe(ref.nativeElement.parentElement!);
    });
  }

  private resizeObserver!: ResizeObserver;

  setModule(m: 'PHASE' | 'EQUALIZER') {
    this.activeModule = m;
    setTimeout(() => {
      this.initCanvases();
      this.runSimulation();
    }, 0);
  }

  runSimulation() {
    if (this.activeModule === 'PHASE') this.runPhaseAnalysis();
    else this.runEqualizer();
  }

  // ==========================================================
  // MODULE 1: PHASE ANALYZER
  // ==========================================================
  runPhaseAnalysis() {
    if (!this.ctx1) return;
    const w = this.ctx1.canvas.width / (window.devicePixelRatio || 1);
    const h = this.ctx1.canvas.height / (window.devicePixelRatio || 1);
    this.clearCtx(this.ctx1, w, h);

    // 1. Design Linear Phase FIR (Sinc + Window)
    const N = this.phaseParams.taps;
    const h_lin = this.firDesign(N, 0.4, this.phaseParams.window);

    // 2. Compute Minimum Phase Equivalent (Cepstral Method)
    const h_min = this.getMinPhase(h_lin);

    // 3. Analysis (FFT)
    const fftN = 1024;
    const freqLin = this.fft(this.pad(h_lin, fftN));
    const freqMin = this.fft(this.pad(h_min, fftN));

    // Magnitude (dB)
    const magLin = freqLin.mag.map((m) => 20 * Math.log10(m + 1e-9));
    const magMin = freqMin.mag.map((m) => 20 * Math.log10(m + 1e-9));

    // Group Delay
    const gdLin = this.calcGroupDelay(freqLin.phase);
    const gdMin = this.calcGroupDelay(freqMin.phase);

    // Metrics
    const avgLin = gdLin.reduce((a, b) => a + b, 0) / gdLin.length;
    const avgMin = gdMin.reduce((a, b) => a + b, 0) / gdMin.length;
    this.phaseMetrics = {
      linDelay: avgLin,
      minDelay: avgMin,
      savings: ((avgLin - avgMin) / avgLin) * 100,
    };

    // --- DRAWING ---
    // Split canvas into 3 zones
    const zoneH = h / 3;

    // 1. Impulse Response
    this.drawBg(this.ctx1, w, zoneH, 'Impulse Response h[n]', 0);
    this.drawStem(this.ctx1, h_lin, '#2563eb', 0, zoneH, w, 'Linear Phase');
    this.drawStem(this.ctx1, h_min, '#ea580c', 0, zoneH, w, 'Min-Phase', true); 

    // 2. Magnitude (Should overlap)
    this.drawBg(this.ctx1, w, zoneH, 'Magnitude (dB) - Identical', zoneH);
    const freqs = this.linspace(0, 1, fftN / 2);
    this.drawPlot(
      this.ctx1,
      freqs,
      magLin.slice(0, fftN / 2),
      zoneH,
      zoneH,
      w,
      '#2563eb',
      [-60, 5]
    );
    this.drawPlot(
      this.ctx1,
      freqs,
      magMin.slice(0, fftN / 2),
      zoneH,
      zoneH,
      w,
      '#ea580c',
      [-60, 5],
      true // Dashed
    );

    // 3. Group Delay
    this.drawBg(this.ctx1, w, zoneH, 'Group Delay (Samples)', zoneH * 2);
    this.drawPlot(
      this.ctx1,
      freqs,
      gdLin.slice(0, fftN / 2),
      zoneH * 2,
      zoneH,
      w,
      '#2563eb'
    );
    this.drawPlot(
      this.ctx1,
      freqs,
      gdMin.slice(0, fftN / 2),
      zoneH * 2,
      zoneH,
      w,
      '#ea580c'
    );

    // Legend
    this.drawLegend(
      this.ctx1,
      ['Linear Phase', 'Minimum Phase'],
      ['#2563eb', '#ea580c']
    );
  }

  // ==========================================================
  // MODULE 2: EQUALIZER
  // ==========================================================
  runEqualizer() {
    if (!this.ctxEq) return;
    const w = this.ctxEq.canvas.width / (window.devicePixelRatio || 1);
    const h = this.ctxEq.canvas.height / (window.devicePixelRatio || 1);
    this.clearCtx(this.ctxEq, w, h);

    // 1. Define Channel
    let h_chan: number[];
    if (this.eqParams.type === 'MIN') {
      // Min phase: Energy concentrated at start
      h_chan = [1.0, 0.5, 0.25];
    } else {
      // Non-min phase: Energy concentrated at end
      h_chan = [0.25, 0.5, 1.0];
    }

    // 2. Signal
    const sigLen = 50;
    const sig = new Array(sigLen).fill(0);
    sig[10] = 1.0;
    sig[15] = 0.5;
    sig[25] = -0.8;

    // 3. Distort (Convolution)
    const distorted = new Array(sigLen).fill(0);
    for (let n = 0; n < sigLen; n++) {
      for (let k = 0; k < h_chan.length; k++) {
        if (n - k >= 0) distorted[n] += h_chan[k] * sig[n - k];
      }
    }

    // 4. Equalize (Inverse Filter 1/H)
    // IIR Implementation: y[n] = x[n] - a1*y[n-1] - a2*y[n-2]...
    // Numerator=[1], Denominator=h_chan
    
    const restored = new Array(sigLen).fill(0);
    let unstable = false;
    const a0 = h_chan[0];

    for (let n = 0; n < sigLen; n++) {
      let val = distorted[n]; 
      for (let k = 1; k < h_chan.length; k++) {
        if (n - k >= 0) val -= h_chan[k] * restored[n - k];
      }
      val /= a0;

      if (Math.abs(val) > 10) {
        unstable = true;
        val = 10 * Math.sign(val); // Clamp for visualization
      } 
      restored[n] = val;
    }

    this.eqStatus.unstable = unstable;

    // --- DRAWING ---
    const rowH = h / 3;

    // 1. Original
    this.drawBg(this.ctxEq, w, rowH, '1. Original Transmission', 0);
    this.drawStem(this.ctxEq, sig, '#16a34a', 0, rowH, w, '');

    // 2. Distorted
    this.drawBg(this.ctxEq, w, rowH, '2. Received (Channel Distortion)', rowH);
    this.drawStem(this.ctxEq, distorted, '#f59e0b', rowH, rowH, w, '');

    // 3. Restored
    const resTitle = unstable
      ? '3. Equalizer Output (FAILED - Unstable Inverse)'
      : '3. Equalizer Output (Restored)';
    const resCol = unstable ? '#dc2626' : '#0891b2';

    this.drawBg(this.ctxEq, w, rowH, resTitle, rowH * 2);
    this.drawStem(this.ctxEq, restored, resCol, rowH * 2, rowH, w, '');
  }

  // ==========================================================
  // MATH ENGINE (TypeScript DSP)
  // ==========================================================

  private firDesign(N: number, fc: number, winType: string): number[] {
    const h = [];
    const center = (N - 1) / 2;
    for (let n = 0; n < N; n++) {
      const k = n - center;
      const val =
        k === 0 ? 2 * fc : Math.sin(2 * Math.PI * fc * k) / (Math.PI * k);
      let win = 1;
      if (winType === 'hamming')
        win = 0.54 - 0.46 * Math.cos((2 * Math.PI * n) / (N - 1));
      else if (winType === 'hann')
        win = 0.5 - 0.5 * Math.cos((2 * Math.PI * n) / (N - 1));
      else if (winType === 'blackman')
        win =
          0.42 -
          0.5 * Math.cos((2 * Math.PI * n) / (N - 1)) +
          0.08 * Math.cos((4 * Math.PI * n) / (N - 1));

      h.push(val * win);
    }
    return h;
  }

  private getMinPhase(h: number[]): number[] {
    const N = 1024;
    const padded = this.pad(h, N);
    const f = this.fft(padded);

    const logMag = f.mag.map((m) => Math.log(m + 1e-10));
    const zeros = new Float64Array(N).fill(0);
    const cepstrum = this.ifft(new Float64Array(logMag), zeros);

    const w = new Float64Array(N).fill(0);
    w[0] = 1;
    w[N / 2] = 1;
    for (let i = 1; i < N / 2; i++) w[i] = 2;

    const c_real = new Float64Array(N);
    const c_imag = new Float64Array(N); 
    for (let i = 0; i < N; i++) c_real[i] = cepstrum.real[i] * w[i];

    this.transform(c_real, c_imag, false); 

    const H_min_real = new Float64Array(N);
    const H_min_imag = new Float64Array(N);

    for (let i = 0; i < N; i++) {
      const mag = Math.exp(c_real[i]);
      H_min_real[i] = mag * Math.cos(c_imag[i]);
      H_min_imag[i] = mag * Math.sin(c_imag[i]);
    }

    const h_min_complex = this.ifft(H_min_real, H_min_imag);
    return Array.from(h_min_complex.real).slice(0, h.length);
  }

  private calcGroupDelay(phase: number[]): number[] {
    const unwrapped = [phase[0]];
    for (let i = 1; i < phase.length; i++) {
      let d = phase[i] - phase[i - 1];
      if (d > Math.PI) d -= 2 * Math.PI;
      if (d < -Math.PI) d += 2 * Math.PI;
      unwrapped.push(unwrapped[i - 1] + d);
    }

    const gd = [];
    for (let i = 0; i < unwrapped.length - 1; i++) {
      const diff = unwrapped[i + 1] - unwrapped[i];
      gd.push(-diff / ((2 * Math.PI) / phase.length));
    }
    gd.push(gd[gd.length - 1]); // pad
    return gd;
  }

  // --- FFT CORE ---
  private fft(sig: number[]) {
    const n = sig.length;
    const real = new Float64Array(n);
    const imag = new Float64Array(n);
    for (let i = 0; i < n; i++) real[i] = sig[i];
    this.transform(real, imag, false);
    const mag = [], phase = [];
    for (let i = 0; i < n; i++) {
      mag.push(Math.sqrt(real[i] ** 2 + imag[i] ** 2));
      phase.push(Math.atan2(imag[i], real[i]));
    }
    return { mag, phase, real, imag };
  }

  private ifft(real: Float64Array, imag: Float64Array) {
    this.transform(real, imag, true);
    const n = real.length;
    for (let i = 0; i < n; i++) {
      real[i] /= n;
      imag[i] /= n;
    }
    return { real, imag };
  }

  private transform(real: Float64Array, imag: Float64Array, inverse: boolean) {
    const n = real.length;
    if (n <= 1) return;
    let j = 0;
    for (let i = 0; i < n; i++) {
      if (i < j) {
        [real[i], real[j]] = [real[j], real[i]];
        [imag[i], imag[j]] = [imag[j], imag[i]];
      }
      let m = n >> 1;
      while (j >= m && m > 0) {
        j -= m;
        m >>= 1;
      }
      j += m;
    }
    for (let len = 2; len <= n; len <<= 1) {
      const ang = ((inverse ? -2 : 2) * Math.PI) / len;
      const wlen_r = Math.cos(ang), wlen_i = Math.sin(ang);
      for (let i = 0; i < n; i += len) {
        let w_r = 1, w_i = 0;
        for (let k = 0; k < len / 2; k++) {
          const u_r = real[i + k], u_i = imag[i + k];
          const v_r = real[i + k + len / 2] * w_r - imag[i + k + len / 2] * w_i;
          const v_i = real[i + k + len / 2] * w_i + imag[i + k + len / 2] * w_r;
          real[i + k] = u_r + v_r;
          imag[i + k] = u_i + v_i;
          real[i + k + len / 2] = u_r - v_r;
          imag[i + k + len / 2] = u_i - v_i;
          const temp_r = w_r;
          w_r = w_r * wlen_r - w_i * wlen_i;
          w_i = temp_r * wlen_i + w_i * wlen_r;
        }
      }
    }
  }

  private pad(arr: number[], len: number) {
    return [...arr, ...new Array(Math.max(0, len - arr.length)).fill(0)];
  }
  private linspace(s: number, e: number, n: number) {
    const step = (e - s) / (n - 1);
    return Array.from({ length: n }, (_, i) => s + i * step);
  }

  // --- CANVAS DRAWING (LIGHT THEME) ---
  private initCanvases() {
    this.initSingle(this.canvas1Ref, (c) => (this.ctx1 = c));
    this.initSingle(this.canvasEqRef, (c) => (this.ctxEq = c));
  }

  private initSingle(
    ref: ElementRef,
    cb: (c: CanvasRenderingContext2D) => void
  ) {
    if (!ref) return;
    const cvs = ref.nativeElement;
    const parent = cvs.parentElement;
    if (!parent || parent.clientWidth === 0) return;
    
    // Responsive sizing based on CSS Grid
    const dpr = window.devicePixelRatio || 1;
    cvs.width = parent.clientWidth * dpr;
    cvs.height = parent.clientHeight * dpr;
    const ctx = cvs.getContext('2d')!;
    ctx.scale(dpr, dpr);
    cb(ctx);
  }

  private clearCtx(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.fillStyle = '#ffffff'; // White background
    ctx.fillRect(0, 0, w, h);
  }

  private drawBg(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    title: string,
    top: number
  ) {
    // Container Frame
    ctx.fillStyle = '#f8fafc'; // Very light gray
    ctx.fillRect(10, top + 10, w - 20, h - 20);
    ctx.strokeStyle = '#e2e8f0'; // Light gray border
    ctx.strokeRect(10, top + 10, w - 20, h - 20);
    
    // Title
    ctx.fillStyle = '#1e293b'; // Slate text
    ctx.font = 'bold 12px Segoe UI';
    ctx.fillText(title, 20, top + 30);
  }

  private drawStem(
    ctx: CanvasRenderingContext2D,
    data: number[],
    col: string,
    top: number,
    h: number,
    w: number,
    lbl: string,
    offset = false
  ) {
    const mid = top + h / 2;
    const scX = (w - 100) / data.length;
    const maxVal = Math.max(...data.map(Math.abs)) || 1;
    const scY = (h / 2 - 30) / maxVal;
    const offX = 50 + (offset ? 5 : 0); 

    // Zero line
    if (!offset) {
      ctx.beginPath();
      ctx.strokeStyle = '#94a3b8'; // Axis
      ctx.moveTo(50, mid);
      ctx.lineTo(w - 50, mid);
      ctx.stroke();
    }

    ctx.strokeStyle = col;
    ctx.fillStyle = col;
    for (let i = 0; i < data.length; i++) {
      const x = offX + i * scX;
      const y = mid - data[i] * scY;
      ctx.beginPath();
      ctx.moveTo(x, mid);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 6.28);
      ctx.fill();
    }
  }

  private drawPlot(
    ctx: CanvasRenderingContext2D,
    x: number[],
    y: number[],
    top: number,
    h: number,
    w: number,
    col: string,
    yRange?: [number, number],
    dash = false
  ) {
    let min = Math.min(...y), max = Math.max(...y);
    if (yRange) { min = yRange[0]; max = yRange[1]; }
    const scX = (w - 100) / (x[x.length - 1] - x[0]);
    const scY = (h - 60) / (max - min);

    // Grid (Light)
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, top + h/2); ctx.lineTo(w-50, top + h/2);
    ctx.stroke();

    ctx.strokeStyle = col;
    ctx.lineWidth = 2;
    if (dash) ctx.setLineDash([5, 5]);
    else ctx.setLineDash([]);
    
    ctx.beginPath();
    for (let i = 0; i < x.length; i++) {
      const px = 50 + (x[i] - x[0]) * scX;
      const py = top + h - 30 - (y[i] - min) * scY;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  private drawLegend(
    ctx: CanvasRenderingContext2D,
    labels: string[],
    cols: string[]
  ) {
    const x = ctx.canvas.width / (window.devicePixelRatio || 1) - 150;
    const y = 30;
    labels.forEach((l, i) => {
      ctx.fillStyle = cols[i];
      ctx.fillRect(x, y + i * 20, 10, 10);
      ctx.fillStyle = '#475569';
      ctx.fillText(l, x + 15, y + i * 20 + 9);
    });
  }
}