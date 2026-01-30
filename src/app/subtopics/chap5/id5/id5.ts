import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

type Vec2 = [number, number];

interface Bounds {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
}

@Component({
  selector: 'app-id5',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule],
  templateUrl: './id5.html',
  styleUrls: ['./id5.css'],
})
export class Id5 implements AfterViewInit {
  @ViewChild('viz') vizRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('mseCanvas') mseRef!: ElementRef<HTMLCanvasElement>;

  // --- Configuration ---
  cfg = {
    nSamples: 1000,
    nBlobs: 4,
    clusterStd: 0.8,
    targetSize: 32,
    eps: 0.02,
    showTraj: true,
    regionCellPx: 5,
    maxItersPerSplit: 20,
    tol: 1e-4,
  };

  targetOptions = [2, 4, 8, 16, 32, 64, 128];

  // --- State ---
  X: Vec2[] = [];
  codebook: Vec2[] = [];
  regionCodebook: Vec2[] = [];
  centroidsHistory: Vec2[][] = [];
  mseHistory: number[] = [];

  stage: 'Init' | 'Split' | 'Optimized' | 'Target Reached' = 'Init';
  mse = 0;

  // --- Canvas ---
  private ctx!: CanvasRenderingContext2D;
  private mseCtx!: CanvasRenderingContext2D;
  private W = 0;
  private H = 0;
  private bounds: Bounds = { xmin: 0, xmax: 1, ymin: 0, ymax: 1 };
  private cachedBg: ImageData | null = null;

  ngAfterViewInit(): void {
    // Initialize Visualizer Canvas
    this.initCanvas(this.vizRef.nativeElement, (c, w, h) => {
      this.ctx = c;
      this.W = w;
      this.H = h;
    });

    // Initialize MSE Canvas
    this.initCanvas(this.mseRef.nativeElement, (c) => {
      this.mseCtx = c;
    });

    // Generate initial data
    setTimeout(() => this.generateData(), 0);
  }

  // --- Actions ---

  generateData(): void {
    this.X = this.makeBlobs(
      this.cfg.nSamples,
      this.cfg.nBlobs,
      this.cfg.clusterStd
    );
    this.bounds = this.getBounds(this.X);

    const initial = this.mean2(this.X);
    this.codebook = [initial];
    this.regionCodebook = [initial];

    this.centroidsHistory = [];
    this.mseHistory = [];
    this.stage = 'Init';
    this.mse = this.getDistortion(this.X, this.codebook);

    this.drawFullScene();
    this.drawMse();
  }

  reset(): void {
    if (!this.X.length) {
      this.generateData();
      return;
    }

    const initial = this.mean2(this.X);
    this.codebook = [initial];
    this.regionCodebook = [initial];
    this.centroidsHistory = [];
    this.mseHistory = [];
    this.stage = 'Init';
    this.mse = this.getDistortion(this.X, this.codebook);

    this.drawFullScene();
    this.drawMse();
  }

  doubleN(): void {
    if (this.codebook.length >= this.cfg.targetSize) return;

    this.stage = 'Split';

    // 1. Snapshot trajectory
    this.centroidsHistory = [this.cloneCb(this.codebook)];

    // 2. Split vectors
    this.codebook = this.split(this.codebook, this.cfg.eps);

    // 3. Optimize Immediately (Synchronous loop for LBG)
    let iter = 0;
    while (iter < this.cfg.maxItersPerSplit) {
      const oldCb = this.codebook;
      const newCb = this.stepKMeans(this.X, oldCb);

      this.codebook = newCb;
      this.centroidsHistory.push(this.cloneCb(newCb));

      if (this.allClose(oldCb, newCb, this.cfg.tol)) {
        break;
      }
      iter++;
    }

    // 4. Update Metrics
    this.mse = this.getDistortion(this.X, this.codebook);
    this.mseHistory.push(this.mse);

    // 5. Update Background Regions (Voronoi)
    this.regionCodebook = this.cloneCb(this.codebook);

    // 6. Update Stage
    if (this.codebook.length >= this.cfg.targetSize) {
      this.stage = 'Target Reached';
    } else {
      this.stage = 'Optimized';
    }

    // 7. Render
    this.drawFullScene();
    this.drawMse();
  }

  // --- Algorithms ---

  private getDistortion(X: Vec2[], cb: Vec2[]): number {
    let sum = 0;
    for (const xi of X) {
      let best = Infinity;
      for (const ck of cb) {
        const d2 = (xi[0] - ck[0]) ** 2 + (xi[1] - ck[1]) ** 2;
        if (d2 < best) best = d2;
      }
      sum += best;
    }
    return sum / Math.max(1, X.length);
  }

  private stepKMeans(X: Vec2[], cb: Vec2[]): Vec2[] {
    const K = cb.length;
    const sumX = new Float64Array(K);
    const sumY = new Float64Array(K);
    const cnt = new Int32Array(K);

    for (const xi of X) {
      let bestDist = Infinity;
      let bestK = -1;
      for (let k = 0; k < K; k++) {
        const d2 = (xi[0] - cb[k][0]) ** 2 + (xi[1] - cb[k][1]) ** 2;
        if (d2 < bestDist) {
          bestDist = d2;
          bestK = k;
        }
      }
      if (bestK !== -1) {
        sumX[bestK] += xi[0];
        sumY[bestK] += xi[1];
        cnt[bestK]++;
      }
    }

    const newCb: Vec2[] = [];
    for (let k = 0; k < K; k++) {
      if (cnt[k] > 0) {
        newCb.push([sumX[k] / cnt[k], sumY[k] / cnt[k]]);
      } else {
        // Re-init dead cluster to random point
        const r = X[Math.floor(Math.random() * X.length)];
        newCb.push([r[0], r[1]]);
      }
    }
    return newCb;
  }

  private split(cb: Vec2[], eps: number): Vec2[] {
    const out: Vec2[] = [];
    for (const v of cb) {
      out.push([v[0] * (1 + eps), v[1] * (1 + eps)]);
      out.push([v[0] * (1 - eps), v[1] * (1 - eps)]);
    }
    return out;
  }

  // --- Rendering ---

  drawFullScene() {
    this.updateBackgroundCache();
    this.renderFrame();
  }

  private updateBackgroundCache() {
    if (!this.ctx || !this.regionCodebook.length) return;

    const step = Math.max(4, this.cfg.regionCellPx);
    const cb = this.regionCodebook;

    this.ctx.clearRect(0, 0, this.W, this.H);

    for (let py = 0; py < this.H; py += step) {
      for (let px = 0; px < this.W; px += step) {
        const world = this.canvasToWorld([px + step / 2, py + step / 2]);
        let best = Infinity;
        let k = 0;
        for (let i = 0; i < cb.length; i++) {
          const dx = world[0] - cb[i][0];
          const dy = world[1] - cb[i][1];
          const d2 = dx * dx + dy * dy;
          if (d2 < best) {
            best = d2;
            k = i;
          }
        }
        this.ctx.fillStyle = this.getColor(k);
        this.ctx.fillRect(px, py, step, step);
      }
    }
    this.cachedBg = this.ctx.getImageData(0, 0, this.W, this.H);
  }

  private renderFrame() {
    if (!this.ctx) return;

    // 1. Draw Background (Voronoi Regions)
    if (this.cachedBg) {
      this.ctx.putImageData(this.cachedBg, 0, 0);
    } else {
      this.ctx.fillStyle = '#f3f4f6'; // Light fallback
      this.ctx.fillRect(0, 0, this.W, this.H);
    }

    // 2. Draw Data Points (Dark dots for Light Theme)
    this.ctx.fillStyle = 'rgba(0,0,0,0.4)';
    for (const p of this.X) {
      const c = this.worldToCanvas(p);
      this.ctx.fillRect(c[0], c[1], 2, 2);
    }

    // 3. Draw Trajectories
    if (this.cfg.showTraj && this.centroidsHistory.length > 1) {
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = 'rgba(0,0,0,0.4)'; // Darker lines
      const K = this.codebook.length;
      const validHist = this.centroidsHistory;

      for (let k = 0; k < K; k++) {
        this.ctx.beginPath();
        let started = false;
        for (let t = 0; t < validHist.length; t++) {
          if (validHist[t].length !== K) continue;
          const pt = this.worldToCanvas(validHist[t][k]);
          if (!started) {
            this.ctx.moveTo(pt[0], pt[1]);
            started = true;
          } else this.ctx.lineTo(pt[0], pt[1]);
        }
        this.ctx.stroke();
      }
    }

    // 4. Draw Centroids
    for (const c of this.codebook) {
      const pt = this.worldToCanvas(c);
      this.drawX(pt[0], pt[1]);
    }
  }

  private drawX(x: number, y: number) {
    // White Outline (for contrast against colored regions)
    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = 'white';
    this.ctx.beginPath();
    this.ctx.moveTo(x - 6, y - 6);
    this.ctx.lineTo(x + 6, y + 6);
    this.ctx.moveTo(x + 6, y - 6);
    this.ctx.lineTo(x - 6, y + 6);
    this.ctx.stroke();

    // Red Center
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#e11d48'; // Red
    this.ctx.beginPath();
    this.ctx.moveTo(x - 6, y - 6);
    this.ctx.lineTo(x + 6, y + 6);
    this.ctx.moveTo(x + 6, y - 6);
    this.ctx.lineTo(x - 6, y + 6);
    this.ctx.stroke();
  }

  // --- Helpers ---

  private initCanvas(
    cvs: HTMLCanvasElement,
    cb: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
  ) {
    // UPDATED: Use Parent Element for Responsive sizing
    const parent = cvs.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    cvs.width = rect.width * dpr;
    cvs.height = rect.height * dpr;

    const ctx = cvs.getContext('2d', {
      alpha: false,
      willReadFrequently: true,
    })!;
    ctx.scale(dpr, dpr);
    cb(ctx, rect.width, rect.height);
  }

  private canvasToWorld(c: Vec2): Vec2 {
    const b = this.bounds;
    const u = c[0] / this.W;
    const v = 1 - c[1] / this.H;
    return [b.xmin + u * (b.xmax - b.xmin), b.ymin + v * (b.ymax - b.ymin)];
  }

  private worldToCanvas(w: Vec2): Vec2 {
    const b = this.bounds;
    const u = (w[0] - b.xmin) / (b.xmax - b.xmin);
    const v = (w[1] - b.ymin) / (b.ymax - b.ymin);
    return [u * this.W, (1 - v) * this.H];
  }

  private makeBlobs(n: number, clusters: number, std: number): Vec2[] {
    const centers: Vec2[] = [];
    for (let i = 0; i < clusters; i++) {
      centers.push([Math.random() * 10 - 5, Math.random() * 8 - 4]);
    }
    const data: Vec2[] = [];
    for (let i = 0; i < n; i++) {
      const c = centers[Math.floor(Math.random() * clusters)];
      data.push([c[0] + this.randn() * std, c[1] + this.randn() * std]);
    }
    return data;
  }

  private randn(): number {
    let u = 0,
      v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  private mean2(arr: Vec2[]): Vec2 {
    let x = 0,
      y = 0;
    for (const p of arr) {
      x += p[0];
      y += p[1];
    }
    return [x / arr.length, y / arr.length];
  }

  private cloneCb(cb: Vec2[]): Vec2[] {
    return cb.map((v) => [v[0], v[1]]);
  }

  private allClose(a: Vec2[], b: Vec2[], tol: number): boolean {
    if (a.length !== b.length) return false;
    const tol2 = tol * tol;
    for (let i = 0; i < a.length; i++) {
      const d2 = (a[i][0] - b[i][0]) ** 2 + (a[i][1] - b[i][1]) ** 2;
      if (d2 > tol2) return false;
    }
    return true;
  }

  private getBounds(X: Vec2[]): Bounds {
    if (X.length === 0) return { xmin: 0, xmax: 1, ymin: 0, ymax: 1 };
    let xmin = Infinity,
      xmax = -Infinity,
      ymin = Infinity,
      ymax = -Infinity;
    for (const p of X) {
      if (p[0] < xmin) xmin = p[0];
      if (p[0] > xmax) xmax = p[0];
      if (p[1] < ymin) ymin = p[1];
      if (p[1] > ymax) ymax = p[1];
    }
    return {
      xmin: xmin - 1,
      xmax: xmax + 1,
      ymin: ymin - 1,
      ymax: ymax + 1,
    };
  }

  private getColor(k: number): string {
    // Standard Tab20 Palette (Light Theme friendly)
    const colors = [
      '#1f77b4',
      '#ff7f0e',
      '#2ca02c',
      '#d62728',
      '#9467bd',
      '#8c564b',
      '#e377c2',
      '#7f7f7f',
      '#bcbd22',
      '#17becf',
      '#aec7e8',
      '#ffbb78',
      '#98df8a',
      '#ff9896',
      '#c5b0d5',
      '#c49c94',
      '#f7b6d2',
      '#c7c7c7',
      '#dbdb8d',
      '#9edae5',
    ];
    const hex = colors[k % colors.length];
    // Add transparency for "Light" feel
    return hex + '88';
  }

  // --- UPDATED MSE PLOT (Light Theme) ---
  private drawMse() {
    if (!this.mseCtx) return;
    const w = this.mseCtx.canvas.width / (window.devicePixelRatio || 1);
    const h = this.mseCtx.canvas.height / (window.devicePixelRatio || 1);
    const ctx = this.mseCtx;

    // 1. White Background
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    if (this.mseHistory.length < 1) {
      // Empty State Text
      ctx.fillStyle = '#9ca3af';
      ctx.font = '14px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Waiting for data...', w / 2, h / 2);
      return;
    }

    // 2. Margins
    const m = { t: 20, b: 25, l: 45, r: 15 };
    const chartW = w - m.l - m.r;
    const chartH = h - m.t - m.b;

    // 3. Range
    const maxVal = Math.max(...this.mseHistory) * 1.1;
    const minVal = 0;
    const count = this.mseHistory.length;

    // 4. Grid & Y-Labels (Light Grey)
    ctx.font = '10px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 1;

    const rows = 4;
    for (let i = 0; i <= rows; i++) {
      const pct = i / rows;
      const y = m.t + chartH * (1 - pct);
      const val = minVal + pct * (maxVal - minVal);

      // Grid Line
      ctx.strokeStyle = '#e5e7eb';
      ctx.beginPath();
      ctx.moveTo(m.l, y);
      ctx.lineTo(w - m.r, y);
      ctx.stroke();

      // Label
      ctx.fillStyle = '#6b7280';
      ctx.fillText(val.toFixed(2), m.l - 6, y);
    }

    // Y-Axis Vertical Line
    ctx.strokeStyle = '#d1d5db';
    ctx.beginPath();
    ctx.moveTo(m.l, m.t);
    ctx.lineTo(m.l, h - m.b);
    ctx.stroke();

    // 5. Data Line (Blue)
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();

    for (let i = 0; i < count; i++) {
      const xPct = count > 1 ? i / (count - 1) : 0;
      const x = m.l + xPct * chartW;
      const val = this.mseHistory[i];
      const valPct = (val - minVal) / (maxVal - minVal);
      const y = m.t + chartH * (1 - valPct);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 6. X-Axis Label (Bottom)
    ctx.textAlign = 'center';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('Splits / Iterations', m.l + chartW / 2, h - 5);
  }
}