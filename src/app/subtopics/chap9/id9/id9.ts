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
  selector: 'app-id9',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule],
  templateUrl: './id9.html',
  styleUrls: ['./id9.css'],
})
export class Id9 implements AfterViewInit, OnDestroy {
  @ViewChild('canvas1') canvas1Ref!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas2') canvas2Ref!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas3') canvas3Ref!: ElementRef<HTMLCanvasElement>;

  activeTab: 'FUNDAMENTALS' | 'FRACTIONAL' | 'WARPING' = 'FUNDAMENTALS';
  private resizeObserver!: ResizeObserver;

  // --- PARAMS ---
  fundParams = { a: 0.5 };
  fracParams = { delay: 4.5, firLen: 10 };
  warpParams = { a: 0.5 };

  private ctx1!: CanvasRenderingContext2D;
  private ctx2!: CanvasRenderingContext2D;
  private ctx3!: CanvasRenderingContext2D;

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

  setTab(t: 'FUNDAMENTALS' | 'FRACTIONAL' | 'WARPING') {
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
    cvs.width = parent.clientWidth * dpr;
    cvs.height = parent.clientHeight * dpr;
    
    const ctx = cvs.getContext('2d')!;
    ctx.scale(dpr, dpr);
    cb(ctx);
  }

  render() {
    if (this.activeTab === 'FUNDAMENTALS') this.renderFundamentals();
    else if (this.activeTab === 'FRACTIONAL') this.renderFractional();
    else if (this.activeTab === 'WARPING') this.renderWarping();
  }

  // ==========================================================
  // TAB 1: FUNDAMENTALS (Optimized Layout)
  // ==========================================================
  renderFundamentals() {
    if (!this.ctx1) return;
    const w = this.ctx1.canvas.width / (window.devicePixelRatio || 1);
    const h = this.ctx1.canvas.height / (window.devicePixelRatio || 1);
    this.clearCtx(this.ctx1, w, h);

    const a = this.fundParams.a;
    
    // Split Vertically: Top for Pole-Zero, Bottom for Group Delay
    const h1 = h * 0.5; 
    const h2 = h - h1;

    // --- 1. Pole-Zero Plot (Top) ---
    const cx = w / 2;
    const cy = h1 / 2 + 10;
    const radius = Math.min(w, h1) * 0.35;

    this.drawBg(this.ctx1, w, h1, 'Pole-Zero Plot (Z-Plane)', 0);

    // Axes
    this.ctx1.strokeStyle = '#cbd5e1';
    this.ctx1.beginPath();
    this.ctx1.moveTo(cx, 20); this.ctx1.lineTo(cx, h1 - 20);
    this.ctx1.moveTo(w/2 - radius - 40, cy); this.ctx1.lineTo(w/2 + radius + 40, cy);
    this.ctx1.stroke();

    // Unit Circle
    this.ctx1.strokeStyle = '#16a34a';
    this.ctx1.lineWidth = 1.5;
    this.ctx1.beginPath();
    this.ctx1.arc(cx, cy, radius, 0, 2 * Math.PI);
    this.ctx1.stroke();

    // Pole (at a)
    const px = cx + a * radius;
    this.drawXMarker(this.ctx1, px, cy, '#dc2626'); // Red X

    // Zero (at 1/a)
    if (Math.abs(a) > 0.1) {
      const zx = cx + (1 / a) * radius;
      if (zx > 0 && zx < w) {
        this.ctx1.strokeStyle = '#2563eb';
        this.ctx1.beginPath();
        this.ctx1.arc(zx, cy, 6, 0, 2 * Math.PI);
        this.ctx1.stroke();
      }
    }

    // --- 2. Group Delay (Bottom) ---
    const N = 200;
    const freqs = this.linspace(0, Math.PI, N);
    const gd = freqs.map((w) => (1 - a * a) / (1 + a * a - 2 * a * Math.cos(w)));

    this.drawBg(this.ctx1, w, h2, 'Group Delay (Samples)', h1);
    
    // Plot Setup
    const plotW = w - 80;
    const plotH = h2 - 60;
    const offX = 50;
    const offY = h1 + 40;

    const maxGd = Math.max(...gd);
    const minGd = Math.min(...gd);
    const rng = (maxGd - minGd) || 1;

    // Grid Lines
    this.ctx1.strokeStyle = '#e2e8f0';
    this.ctx1.lineWidth = 1;
    this.ctx1.beginPath();
    this.ctx1.rect(offX, offY, plotW, plotH);
    this.ctx1.stroke();

    // Curve
    this.ctx1.strokeStyle = '#2563eb';
    this.ctx1.lineWidth = 2;
    this.ctx1.beginPath();
    for (let i = 0; i < N; i++) {
      const x = offX + (i / (N - 1)) * plotW;
      const y = offY + plotH - ((gd[i] - minGd) / rng) * plotH;
      if (i === 0) this.ctx1.moveTo(x, y);
      else this.ctx1.lineTo(x, y);
    }
    this.ctx1.stroke();

    // Labels
    this.ctx1.fillStyle = '#64748b';
    this.ctx1.font = '10px monospace';
    this.ctx1.fillText(maxGd.toFixed(1), 10, offY + 10);
    this.ctx1.fillText(minGd.toFixed(1), 10, offY + plotH);
    this.ctx1.textAlign = 'center';
    this.ctx1.fillText('Frequency (0 to π)', w/2, h - 5);
    this.ctx1.textAlign = 'left'; // Reset
  }

  // ==========================================================
  // TAB 2: FRACTIONAL DELAYS
  // ==========================================================
  renderFractional() {
    if (!this.ctx2) return;
    const w = this.ctx2.canvas.width / (window.devicePixelRatio || 1);
    const h = this.ctx2.canvas.height / (window.devicePixelRatio || 1);
    this.clearCtx(this.ctx2, w, h);

    const delay = this.fracParams.delay;
    const L = this.fracParams.firLen;

    // 1. Calculate FIR
    const h_fir: number[] = [];
    for (let n = 0; n < L; n++) {
      const x = n - delay;
      const sinc = x === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x);
      const win = Math.sin((Math.PI / L) * (n + 0.5));
      h_fir.push(sinc * win);
    }

    // 2. Calculate IIR
    const N_iir = Math.floor(delay) + 1; 
    const a_coeffs = [1.0];
    let curr = 1.0;
    const tau = delay; 
    for (let k = 0; k < N_iir; k++) {
      const term = ((N_iir - k) * (N_iir - k - tau)) / ((k + 1) * (k + 1 + tau));
      curr *= term;
      a_coeffs.push(curr);
    }
    const b_coeffs = [...a_coeffs].reverse();

    // 3. Responses
    const testLen = 40;
    const fir_imp = new Array(testLen).fill(0);
    const iir_imp = new Array(testLen).fill(0);

    for (let n = 0; n < testLen; n++) if (n < L) fir_imp[n] = h_fir[n];

    const x = new Array(testLen).fill(0);
    x[0] = 1;
    for (let n = 0; n < testLen; n++) {
      let val = 0;
      for (let k = 0; k < b_coeffs.length; k++) if (n - k >= 0) val += b_coeffs[k] * x[n - k];
      for (let k = 1; k < a_coeffs.length; k++) if (n - k >= 0) val -= a_coeffs[k] * iir_imp[n - k];
      iir_imp[n] = val; 
    }

    // Drawing
    this.drawBg(this.ctx2, w, h, 'Impulse Response Comparison', 0);
    const plotH = h - 80;
    const midY = h / 2 + 20;
    const scaleX = (w - 100) / testLen;
    const offX = 50;

    // Target Line
    const tx = offX + delay * scaleX;
    this.ctx2.strokeStyle = '#16a34a';
    this.ctx2.setLineDash([5, 5]);
    this.ctx2.beginPath(); this.ctx2.moveTo(tx, 40); this.ctx2.lineTo(tx, h-40); this.ctx2.stroke();
    this.ctx2.setLineDash([]);
    this.ctx2.fillStyle = '#16a34a'; this.ctx2.fillText(`Delay: ${delay}`, tx+5, 50);

    // FIR (Blue Stem)
    this.drawStem(this.ctx2, fir_imp, offX, midY, scaleX, plotH/2.5, '#2563eb', 'FIR (Sinc)');
    
    // IIR (Red Line)
    this.ctx2.strokeStyle = '#dc2626';
    this.ctx2.lineWidth = 2;
    this.ctx2.beginPath();
    for(let i=0; i<testLen; i++) {
        const x = offX + i * scaleX;
        const y = midY - iir_imp[i] * (plotH/2.5);
        if(i===0) this.ctx2.moveTo(x,y); else this.ctx2.lineTo(x,y);
    }
    this.ctx2.stroke();
    this.ctx2.fillStyle = '#dc2626'; this.ctx2.fillText('IIR (Thiran)', w-100, 50);
  }

  // ==========================================================
  // TAB 3: WARPING
  // ==========================================================
  renderWarping() {
    if (!this.ctx3) return;
    const w = this.ctx3.canvas.width / (window.devicePixelRatio || 1);
    const h = this.ctx3.canvas.height / (window.devicePixelRatio || 1);
    this.clearCtx(this.ctx3, w, h);

    const a = this.warpParams.a;
    const N = 200;
    const w_in = this.linspace(0, Math.PI, N);
    const w_out = w_in.map((o) => {
      const num = a * Math.sin(o);
      const den = 1 - a * Math.cos(o);
      return -(-o - 2 * Math.atan(num / den)); 
    });

    this.drawBg(this.ctx3, w, h, `Frequency Mapping (a = ${a})`, 0);
    const plotW = w - 100; const plotH = h - 100;
    const offX = 60; const offY = 60;

    // Grid & Diagonal
    this.ctx3.strokeStyle = '#e2e8f0'; this.ctx3.strokeRect(offX, offY, plotW, plotH);
    this.ctx3.strokeStyle = '#cbd5e1'; this.ctx3.setLineDash([4,4]);
    this.ctx3.beginPath(); this.ctx3.moveTo(offX, offY+plotH); this.ctx3.lineTo(offX+plotW, offY); this.ctx3.stroke();
    this.ctx3.setLineDash([]);

    // Curve
    this.ctx3.strokeStyle = '#2563eb'; this.ctx3.lineWidth = 3;
    this.ctx3.beginPath();
    for(let i=0; i<N; i++) {
        const x = offX + (w_in[i]/Math.PI)*plotW;
        const y = offY + plotH - (w_out[i]/Math.PI)*plotH;
        if(i===0) this.ctx3.moveTo(x,y); else this.ctx3.lineTo(x,y);
    }
    this.ctx3.stroke();

    // Labels
    this.ctx3.fillStyle = '#64748b';
    this.ctx3.textAlign = 'center';
    this.ctx3.fillText('Input Freq (x PI)', w/2, h-15);
    this.ctx3.save(); this.ctx3.translate(15, h/2); this.ctx3.rotate(-Math.PI/2);
    this.ctx3.fillText('Warped Freq (x PI)', 0, 0); this.ctx3.restore();
  }

  // --- HELPERS ---
  private clearCtx(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h);
  }
  private drawBg(ctx: CanvasRenderingContext2D, w: number, h: number, title: string, top: number) {
    // Just a clean title, no box background to keep it airy
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 14px Segoe UI';
    ctx.textAlign = 'left';
    ctx.fillText(title, 20, top + 25);
  }
  private drawXMarker(ctx: CanvasRenderingContext2D, x: number, y: number, col: string) {
    ctx.strokeStyle = col; ctx.lineWidth = 2; const s = 6;
    ctx.beginPath(); ctx.moveTo(x-s, y-s); ctx.lineTo(x+s, y+s); ctx.moveTo(x+s, y-s); ctx.lineTo(x-s, y+s); ctx.stroke();
  }
  private drawStem(ctx: CanvasRenderingContext2D, data: number[], ox: number, oy: number, sx: number, sy: number, col: string, lbl: string) {
    ctx.strokeStyle = col; ctx.fillStyle = col;
    for(let i=0; i<data.length; i++) {
        const x = ox + i * sx; const y = oy - data[i] * sy;
        ctx.beginPath(); ctx.moveTo(x, oy); ctx.lineTo(x, y); ctx.stroke();
        ctx.beginPath(); ctx.arc(x, y, 2, 0, 2*Math.PI); ctx.fill();
    }
  }
  private linspace(s: number, e: number, n: number) {
    const step = (e - s) / (n - 1); return Array.from({length: n}, (_, i) => s + i * step);
  }
}