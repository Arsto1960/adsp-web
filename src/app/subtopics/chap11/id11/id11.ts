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
  selector: 'app-id11',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule],
  templateUrl: './id11.html',
  styleUrls: ['./id11.css'],
})
export class Id11 implements AfterViewInit, OnDestroy {
  @ViewChild('canvas1') canvas1Ref!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas2') canvas2Ref!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas3') canvas3Ref!: ElementRef<HTMLCanvasElement>;

  activeTab: 'FILTER' | 'ANALYTIC' | 'SSB' = 'FILTER';

  // --- TAB 1: FILTER ---
  filterParams = { N: 31 };

  // --- TAB 2: ANALYTIC ---
  analyticParams = {
    type: 'AM',
    fc: 100,
    fm: 5,
    modIdx: 0.8,
    fStart: 20,
    fEnd: 200,
  };

  // --- TAB 3: SSB ---
  ssbParams = {
    carrier: 2000,
    sideband: 'USB' as const,
  };

  private ctx1!: CanvasRenderingContext2D;
  private ctx2!: CanvasRenderingContext2D;
  private ctx3!: CanvasRenderingContext2D;
  private resizeObserver!: ResizeObserver;

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(() => {
      this.initCanvases();
      this.render();
    });

    [this.canvas1Ref, this.canvas2Ref, this.canvas3Ref].forEach((ref) => {
      if (ref) this.resizeObserver.observe(ref.nativeElement.parentElement!);
    });
  }

  ngOnDestroy() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }

  setTab(t: 'FILTER' | 'ANALYTIC' | 'SSB') {
    this.activeTab = t;
    setTimeout(() => {
      this.initCanvases();
      this.render();
    }, 0);
  }

  private initCanvases() {
    this.initSingle(this.canvas1Ref, (c) => (this.ctx1 = c));
    this.initSingle(this.canvas2Ref, (c) => (this.ctx2 = c));
    this.initSingle(this.canvas3Ref, (c) => (this.ctx3 = c));
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
    // Responsive sizing based on parent container
    cvs.width = parent.clientWidth * dpr;
    cvs.height = parent.clientHeight * dpr;

    const ctx = cvs.getContext('2d')!;
    ctx.scale(dpr, dpr);
    cb(ctx);
  }

  render() {
    if (this.activeTab === 'FILTER') this.renderFilter();
    else if (this.activeTab === 'ANALYTIC') this.renderAnalytic();
    else if (this.activeTab === 'SSB') this.renderSSB();
  }

  // ==========================================================
  // LOGIC: TAB 1 (FILTER DESIGN)
  // ==========================================================
  renderFilter() {
    if (!this.ctx1 || !this.canvas1Ref) return;
    const w = this.ctx1.canvas.width / (window.devicePixelRatio || 1);
    const h = this.ctx1.canvas.height / (window.devicePixelRatio || 1);
    this.clearCtx(this.ctx1, w, h);

    const N = this.filterParams.N;
    const center = (N - 1) / 2;
    const h_impulse: number[] = [];

    for (let n = 0; n < N; n++) {
      const k = n - center;
      if (k === 0 || k % 2 === 0) {
        h_impulse.push(0);
      } else {
        const ideal = 2 / (Math.PI * k);
        const window = 0.54 - 0.46 * Math.cos((2 * Math.PI * n) / (N - 1));
        h_impulse.push(ideal * window);
      }
    }

    const paddedLen = 1024;
    const h_pad = [...h_impulse, ...new Array(paddedLen - N).fill(0)];
    const fftRes = this.fft(h_pad);

    const mags = fftRes.mag.slice(0, paddedLen / 2);
    const phases = fftRes.phase.slice(0, paddedLen / 2);
    const freqs = this.linspace(0, 1, paddedLen / 2);

    // PLOT 1: Impulse Response (Top half)
    const split = h * 0.4;
    this.drawStem(
      this.ctx1,
      w,
      split,
      h_impulse,
      'Impulse Response h[n] (Anti-Symmetric)',
      0,
      '#2563eb'
    );

    // PLOT 2: Frequency Response (Bottom half)
    const magDb = mags.map((m) => 20 * Math.log10(m + 1e-12));
    this.drawPlot(
      this.ctx1,
      w,
      h - split,
      freqs,
      magDb,
      'Freq Response (Mag dB / Phase)',
      split,
      '#dc2626',
      [-60, 5]
    );
    this.drawPhaseOverlay(this.ctx1, w, h - split, freqs, phases, split);
  }

  // ==========================================================
  // LOGIC: TAB 2 (ANALYTIC SIGNALS)
  // ==========================================================
  renderAnalytic() {
    if (!this.ctx2 || !this.canvas2Ref) return;
    const w = this.ctx2.canvas.width / (window.devicePixelRatio || 1);
    const h = this.ctx2.canvas.height / (window.devicePixelRatio || 1);
    this.clearCtx(this.ctx2, w, h);

    const fs = 1000;
    const dur = 0.5;
    const N = Math.floor(fs * dur);
    const t = this.linspace(0, dur, N);

    let sig: number[] = [];
    let envTrue: number[] = [];

    if (this.analyticParams.type === 'AM') {
      const fc = this.analyticParams.fc;
      const fm = this.analyticParams.fm;
      const m = this.analyticParams.modIdx;
      envTrue = t.map((v) => 1 + m * Math.cos(2 * Math.PI * fm * v));
      sig = t.map((v, i) => envTrue[i] * Math.cos(2 * Math.PI * fc * v));
    } else {
      const f0 = this.analyticParams.fStart;
      const f1 = this.analyticParams.fEnd;
      const k = (f1 - f0) / dur;
      sig = t.map((v) => Math.cos(2 * Math.PI * (f0 * v + (k / 2) * v * v)));
      envTrue = new Array(N).fill(1);
    }

    const analytic = this.hilbert(sig);
    const envCalc = analytic.real.map((r, i) =>
      Math.sqrt(r * r + analytic.imag[i] * analytic.imag[i])
    );

    // 3 Rows
    const rowH = h / 3;

    // Row 1: Signal + Envelope
    this.drawMultiLine(
      this.ctx2,
      w,
      rowH,
      t,
      [sig, envCalc],
      ['#94a3b8', '#dc2626'],
      'Signal (Grey) & Envelope (Red)',
      0
    );

    // Row 2: Real vs Imag (Zoom)
    const zoomN = Math.floor(N * 0.2);
    this.drawMultiLine(
      this.ctx2,
      w,
      rowH,
      t.slice(0, zoomN),
      [analytic.real.slice(0, zoomN), analytic.imag.slice(0, zoomN)],
      ['#2563eb', '#f59e0b'],
      'Analytic Components: Real (Blue) vs Imag (Amber)',
      rowH
    );

    // Row 3: Complex Plane
    this.drawIQPlot(
      this.ctx2,
      w,
      rowH,
      analytic.real.slice(0, zoomN),
      analytic.imag.slice(0, zoomN),
      rowH * 2
    );
  }

  // ==========================================================
  // LOGIC: TAB 3 (SSB)
  // ==========================================================
  renderSSB() {
    if (!this.ctx3 || !this.canvas3Ref) return;
    const w = this.ctx3.canvas.width / (window.devicePixelRatio || 1);
    const h = this.ctx3.canvas.height / (window.devicePixelRatio || 1);
    this.clearCtx(this.ctx3, w, h);

    const fs = 8000;
    const N = 2048;
    const t = this.linspace(0, N / fs, N);

    const msg = t.map(
      (v) =>
        1.0 * Math.sin(2 * Math.PI * 300 * v) +
        0.5 * Math.sin(2 * Math.PI * 600 * v) +
        0.3 * Math.sin(2 * Math.PI * 900 * v)
    );

    const msg_analytic = this.hilbert(msg);
    const msg_hat = msg_analytic.imag;
    const fc = this.ssbParams.carrier;
    const cosC = t.map((v) => Math.cos(2 * Math.PI * fc * v));
    const sinC = t.map((v) => Math.sin(2 * Math.PI * fc * v));

    let ssb: number[] = [];
    let color = '#16a34a'; // Green for USB
    if (this.ssbParams.sideband === 'USB') {
      ssb = msg.map((m, i) => m * cosC[i] - msg_hat[i] * sinC[i]);
    } else {
      ssb = msg.map((m, i) => m * cosC[i] + msg_hat[i] * sinC[i]);
      color = '#ef4444'; // Red for LSB
    }

    const spec = this.fft(ssb);
    const half = N / 2;
    const mag = spec.mag;
    const magShift = [...mag.slice(half), ...mag.slice(0, half)];
    const freqs = this.linspace(-fs / 2, fs / 2, N);
    const magDb = magShift.map((m) => 20 * Math.log10(m + 1e-9));

    const h2 = h / 2;
    // Plot 1: Time
    this.drawMultiLine(
      this.ctx3,
      w,
      h2,
      t.slice(0, 200),
      [msg.slice(0, 200), ssb.slice(0, 200)],
      ['#94a3b8', color],
      'Time Domain: Message (Grey) vs Modulated (Color)',
      0
    );

    // Plot 2: Spectrum
    this.drawPlot(
      this.ctx3,
      w,
      h2,
      freqs,
      magDb,
      `Spectrum Output (${this.ssbParams.sideband})`,
      h2,
      color,
      [-80, 40]
    );

    // Draw Carrier Line
    const xPct = (fc - -fs / 2) / fs;
    const xPos = 50 + xPct * (w - 100);
    this.ctx3.strokeStyle = '#475569';
    this.ctx3.setLineDash([4, 4]);
    this.ctx3.beginPath();
    this.ctx3.moveTo(xPos, h2 + 20);
    this.ctx3.lineTo(xPos, h - 30);
    this.ctx3.stroke();
    this.ctx3.setLineDash([]);
    this.ctx3.fillStyle = '#475569';
    this.ctx3.fillText('Carrier (Fc)', xPos + 5, h2 + 35);
  }

  // --- MATH HELPERS ---
  private linspace(s: number, e: number, n: number) {
    const arr = new Array(n);
    const step = (e - s) / (n - 1);
    for (let i = 0; i < n; i++) arr[i] = s + step * i;
    return arr;
  }

  private fft(sig: number[]) {
    const n = sig.length;
    const p2 = Math.pow(2, Math.ceil(Math.log2(n)));
    const real = new Float64Array(p2);
    const imag = new Float64Array(p2);
    for (let i = 0; i < n; i++) real[i] = sig[i];
    this.transform(real, imag, false);
    const mag = [],
      phase = [];
    for (let i = 0; i < p2; i++) {
      mag.push(Math.sqrt(real[i] ** 2 + imag[i] ** 2));
      phase.push(Math.atan2(imag[i], real[i]));
    }
    return { real, imag, mag, phase };
  }

  private ifft(real: Float64Array, imag: Float64Array) {
    this.transform(real, imag, true);
    for (let i = 0; i < real.length; i++) {
      real[i] /= real.length;
      imag[i] /= real.length;
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
      const wlen_r = Math.cos(ang),
        wlen_i = Math.sin(ang);
      for (let i = 0; i < n; i += len) {
        let w_r = 1,
          w_i = 0;
        for (let k = 0; k < len / 2; k++) {
          const u_r = real[i + k],
            u_i = imag[i + k];
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

  private hilbert(sig: number[]) {
    const N = sig.length;
    const f = this.fft(sig);
    const len = f.real.length;
    const h = new Float64Array(len).fill(0);
    h[0] = 1;
    h[len / 2] = 1;
    for (let i = 1; i < len / 2; i++) h[i] = 2;
    for (let i = 0; i < len; i++) {
      f.real[i] *= h[i];
      f.imag[i] *= h[i];
    }
    const res = this.ifft(f.real, f.imag);
    return {
      real: Array.from(res.real).slice(0, N),
      imag: Array.from(res.imag).slice(0, N),
    };
  }

  // --- DRAWING ---
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
    // Light container
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(10, top + 10, w - 20, h - 20);
    ctx.strokeStyle = '#e2e8f0';
    ctx.strokeRect(10, top + 10, w - 20, h - 20);
    ctx.fillStyle = '#334155'; // Dark slate text
    ctx.font = 'bold 12px Segoe UI';
    ctx.fillText(title, 20, top + 30);
  }

  private drawStem(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    data: number[],
    title: string,
    top: number,
    col: string
  ) {
    this.drawBg(ctx, w, h, title, top);
    const mid = top + h / 2;
    const scaleX = (w - 100) / data.length;
    const scaleY = (h / 2 - 30) / Math.max(...data.map(Math.abs));

    // Zero Line
    ctx.strokeStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(50, mid);
    ctx.lineTo(w - 50, mid);
    ctx.stroke();

    ctx.strokeStyle = col;
    ctx.fillStyle = col;
    for (let i = 0; i < data.length; i++) {
      const x = 50 + i * scaleX;
      const y = mid - data[i] * scaleY;
      ctx.beginPath();
      ctx.moveTo(x, mid);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, 6.28);
      ctx.fill();
    }
  }

  private drawPlot(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    x: number[],
    y: number[],
    title: string,
    top: number,
    col: string,
    rng?: number[]
  ) {
    this.drawBg(ctx, w, h, title, top);
    let min = Math.min(...y),
      max = Math.max(...y);
    if (rng) {
      min = rng[0];
      max = rng[1];
    }
    const scX = (w - 100) / (x[x.length - 1] - x[0]);
    const scY = (h - 60) / (max - min);

    // Light Grid
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // Horizontal center line
    const yZero = top + h - 30 - (0 - min) * scY;
    if (yZero > top && yZero < top + h) {
       ctx.moveTo(50, yZero); ctx.lineTo(w-50, yZero);
    }
    ctx.stroke();

    ctx.strokeStyle = col;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < x.length; i++) {
      const px = 50 + (x[i] - x[0]) * scX;
      const py = top + h - 30 - (y[i] - min) * scY;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  private drawPhaseOverlay(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    x: number[],
    y: number[],
    top: number
  ) {
    const scX = (w - 100) / (x[x.length - 1] - x[0]);
    const scY = (h - 60) / (2 * Math.PI);
    ctx.strokeStyle = '#16a34a'; // Green
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    for (let i = 0; i < x.length; i++) {
      const px = 50 + (x[i] - x[0]) * scX;
      const py = top + h - 30 - (y[i] + Math.PI) * scY;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  private drawMultiLine(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    x: number[],
    ys: number[][],
    cols: string[],
    title: string,
    top: number
  ) {
    this.drawBg(ctx, w, h, title, top);
    let min = Infinity,
      max = -Infinity;
    ys.forEach((a) => {
      min = Math.min(min, ...a);
      max = Math.max(max, ...a);
    });
    const rng = max - min || 1;
    const scX = (w - 100) / (x[x.length - 1] - x[0]);
    const scY = (h - 60) / rng;

    ys.forEach((y, idx) => {
      ctx.strokeStyle = cols[idx];
      ctx.lineWidth = idx === 0 ? 1 : 2; // Make second line thicker
      ctx.beginPath();
      for (let i = 0; i < x.length; i++) {
        const px = 50 + (x[i] - x[0]) * scX;
        const py = top + h - 30 - (y[i] - min) * scY;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    });
  }

  private drawIQPlot(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    I: number[],
    Q: number[],
    top: number
  ) {
    this.drawBg(ctx, w, h, 'Complex Phasor (Analytic Signal)', top);
    const cx = w / 2,
      cy = top + h / 2;
    const sc = Math.min(w, h) / 4;

    // Crosshairs
    ctx.strokeStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(cx, top + 10);
    ctx.lineTo(cx, top + h - 10);
    ctx.moveTo(10, cy);
    ctx.lineTo(w - 10, cy);
    ctx.stroke();

    // Trace
    ctx.strokeStyle = '#9333ea'; // Purple
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < I.length; i++) {
      const x = cx + I[i] * sc;
      const y = cy - Q[i] * sc;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}