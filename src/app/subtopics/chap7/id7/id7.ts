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
import { MatExpansionModule } from '@angular/material/expansion'; // Added for expander

@Component({
  selector: 'app-id7',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatExpansionModule],
  templateUrl: './id7.html',
  styleUrls: ['./id7.css'],
})
export class Id7 implements AfterViewInit, OnDestroy {
  @ViewChild('zPlaneCanvas') zCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('freqCanvas') freqCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('impulseCanvas') impCanvasRef!: ElementRef<HTMLCanvasElement>;

  // --- STATE ---
  params = {
    r_p: 0.8,
    theta_p: 45,
    r_z: 1.0,
    theta_z: 90,
  };

  isStable = true;
  private resizeObserver!: ResizeObserver;

  // Canvas Contexts
  private ctxZ!: CanvasRenderingContext2D;
  private ctxFreq!: CanvasRenderingContext2D;
  private ctxImp!: CanvasRenderingContext2D;

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(() => {
      this.initCanvases();
      this.render();
    });

    [this.zCanvasRef, this.freqCanvasRef, this.impCanvasRef].forEach((ref) => {
      if (ref) this.resizeObserver.observe(ref.nativeElement.parentElement!);
    });
  }

  ngOnDestroy() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }

  update() {
    this.render();
  }

  private initCanvases() {
    // Note: Height is controlled via CSS .canvas-card height
    this.initSingle(this.zCanvasRef, (c) => (this.ctxZ = c));
    this.initSingle(this.freqCanvasRef, (c) => (this.ctxFreq = c));
    this.initSingle(this.impCanvasRef, (c) => (this.ctxImp = c));
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
    if (!this.ctxZ || !this.ctxFreq || !this.ctxImp) return;

    // 1. Math Logic (Polar -> Cartesian)
    const p_rad = (this.params.theta_p * Math.PI) / 180;
    const z_rad = (this.params.theta_z * Math.PI) / 180;

    const poles = [
      { r: this.params.r_p, ang: p_rad },
      { r: this.params.r_p, ang: -p_rad }, // Conjugate
    ];

    const zeros = [
      { r: this.params.r_z, ang: z_rad },
      { r: this.params.r_z, ang: -z_rad }, // Conjugate
    ];

    this.isStable = this.params.r_p < 1.0;

    // 2. Polynomials H(z) = B/A
    const a1 = -2 * this.params.r_p * Math.cos(p_rad);
    const a2 = this.params.r_p * this.params.r_p;
    const A = [1, a1, a2];

    const b1 = -2 * this.params.r_z * Math.cos(z_rad);
    const b2 = this.params.r_z * this.params.r_z;
    const B = [1, b1, b2];

    // 3. Frequency Response
    const N = 200;
    const freqs = this.linspace(0, Math.PI, N);
    const H_mag = [];
    for (let w of freqs) {
      const num = this.polyVal(B, w);
      const den = this.polyVal(A, w);
      const mag = num / den;
      H_mag.push(mag);
    }

    // 4. Impulse Response
    const impLen = 50;
    const impulse = new Array(impLen).fill(0);
    impulse[0] = 1;
    const h_n = this.filter(B, A, impulse);

    // --- DRAWING (Matplotlib Style) ---
    
    // A. Z-Plane
    const zw = this.zCanvasRef.nativeElement.width / (window.devicePixelRatio || 1);
    const zh = this.zCanvasRef.nativeElement.height / (window.devicePixelRatio || 1);
    this.drawZPlane(this.ctxZ, zw, zh, poles, zeros, this.isStable);

    // B. Frequency Response
    const fw = this.freqCanvasRef.nativeElement.width / (window.devicePixelRatio || 1);
    const fh = this.freqCanvasRef.nativeElement.height / (window.devicePixelRatio || 1);
    this.drawPlot(this.ctxFreq, fw, fh, freqs, H_mag, 'Frequency Response', 'Magnitude', '#00a8cc', true);

    // C. Impulse Response
    const iw = this.impCanvasRef.nativeElement.width / (window.devicePixelRatio || 1);
    const ih = this.impCanvasRef.nativeElement.height / (window.devicePixelRatio || 1);
    this.drawStem(this.ctxImp, iw, ih, h_n, 'Impulse Response');
  }

  // --- DRAWING FUNCTIONS (Mimic Matplotlib) ---

  private drawZPlane(ctx: CanvasRenderingContext2D, w: number, h: number, poles: any[], zeros: any[], stable: boolean) {
    // Background color based on stability (mimic your Python code)
    ctx.fillStyle = stable ? '#f9f9f9' : '#ffe6e6';
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const scale = Math.min(w, h) / 3.5;

    // Grid (Light gray dotted)
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]); // Dotted
    ctx.beginPath();
    ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
    ctx.moveTo(0, cy); ctx.lineTo(w, cy);
    ctx.stroke();
    ctx.setLineDash([]); // Reset

    // Unit Circle (Green Dashed)
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(cx, cy, scale, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    // Poles (Red X)
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    poles.forEach(p => {
      const x = cx + p.r * Math.cos(p.ang) * scale;
      const y = cy - p.r * Math.sin(p.ang) * scale; 
      const s = 8;
      ctx.beginPath();
      ctx.moveTo(x-s, y-s); ctx.lineTo(x+s, y+s);
      ctx.moveTo(x+s, y-s); ctx.lineTo(x-s, y+s);
      ctx.stroke();
    });

    // Zeros (Blue Circle, empty fill)
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 3;
    zeros.forEach(z => {
      const x = cx + z.r * Math.cos(z.ang) * scale;
      const y = cy - z.r * Math.sin(z.ang) * scale;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2*Math.PI);
      ctx.stroke();
    });

    // Title
    ctx.fillStyle = '#333';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Complex Z-Plane', cx, 20);
  }

  private drawPlot(ctx: CanvasRenderingContext2D, w: number, h: number, x: number[], y: number[], title: string, ylabel: string, col: string, fill: boolean) {
    ctx.clearRect(0,0,w,h);
    // Margins for axes
    const ml = 40, mb = 30, mt = 30, mr = 20;
    const pltW = w - ml - mr;
    const pltH = h - mt - mb;

    // Background white
    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,w,h);

    const max = Math.max(...y) || 1;
    const scX = pltW / Math.PI;
    const scY = pltH / max;

    // Grid
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // Horizontal grid lines
    for(let i=0; i<=4; i++) {
        const py = mt + (pltH/4)*i;
        ctx.moveTo(ml, py); ctx.lineTo(ml+pltW, py);
    }
    ctx.stroke();

    // Line
    ctx.strokeStyle = col;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < x.length; i++) {
      const px = ml + x[i] * scX;
      const py = mt + pltH - y[i] * scY; // y is inverted
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    if (fill) {
      ctx.lineTo(ml + pltW, mt + pltH);
      ctx.lineTo(ml, mt + pltH);
      ctx.fillStyle = col + '33'; // hex transparency
      ctx.fill();
    }

    // Axes Spines (Matplotlib style: usually removed top/right)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ml, mt); ctx.lineTo(ml, mt+pltH); ctx.lineTo(ml+pltW, mt+pltH); // Left and Bottom
    ctx.stroke();

    // Title & Labels
    ctx.fillStyle = '#333';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, ml + pltW/2, 20);
    
    ctx.font = '12px sans-serif';
    ctx.fillText('Frequency (× π rad/sample)', ml + pltW/2, h - 5);
    
    ctx.save();
    ctx.translate(15, mt + pltH/2);
    ctx.rotate(-Math.PI/2);
    ctx.textAlign = 'center';
    ctx.fillText(ylabel, 0, 0);
    ctx.restore();
  }

  private drawStem(ctx: CanvasRenderingContext2D, w: number, h: number, data: number[], title: string) {
    ctx.clearRect(0,0,w,h);
    const ml = 40, mb = 30, mt = 30, mr = 20;
    const pltW = w - ml - mr;
    const pltH = h - mt - mb;

    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,w,h);

    const maxVal = Math.max(...data.map(Math.abs)) || 1;
    const midY = mt + pltH / 2;
    // Scale to fit max in half-height
    const scaleY = (pltH / 2) / (maxVal * 1.1); 
    const scaleX = pltW / data.length;

    // Grid
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ml, midY); ctx.lineTo(ml+pltW, midY); // Zero line
    ctx.stroke();

    // Stem plot
    ctx.strokeStyle = '#555';
    ctx.fillStyle = '#ff4b4b'; // Red dots like Python
    ctx.lineWidth = 1;

    for (let i = 0; i < data.length; i++) {
      const px = ml + i * scaleX;
      const py = midY - data[i] * scaleY;
      
      // Stem
      ctx.beginPath();
      ctx.moveTo(px, midY); ctx.lineTo(px, py);
      ctx.stroke();

      // Dot
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, 2*Math.PI);
      ctx.fill();
    }

    // Axes
    ctx.strokeStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(ml, mt); ctx.lineTo(ml, mt+pltH); ctx.lineTo(ml+pltW, mt+pltH);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#333';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, ml + pltW/2, 20);
    
    ctx.font = '12px sans-serif';
    ctx.fillText('Time (Samples)', ml + pltW/2, h - 5);
    
    ctx.save();
    ctx.translate(15, mt + pltH/2);
    ctx.rotate(-Math.PI/2);
    ctx.textAlign = 'center';
    ctx.fillText('Amplitude', 0, 0);
    ctx.restore();
  }

  // --- DSP MATH ---
  private linspace(s: number, e: number, n: number) { return Array.from({ length: n }, (_, i) => s + i * (e - s) / (n - 1)); }
  private polyVal(c: number[], w: number): number { let re = 0, im = 0; for (let k = 0; k < c.length; k++) { re += c[k] * Math.cos(-w * k); im += c[k] * Math.sin(-w * k); } return Math.sqrt(re * re + im * im); }
  private filter(B: number[], A: number[], x: number[]): number[] { const y = new Array(x.length).fill(0); for (let n = 0; n < x.length; n++) { let val = 0; for (let k = 0; k < B.length; k++) if (n - k >= 0) val += B[k] * x[n - k]; for (let k = 1; k < A.length; k++) if (n - k >= 0) val -= A[k] * y[n - k]; y[n] = val; } return y; }
}