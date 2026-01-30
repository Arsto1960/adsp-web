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
  selector: 'app-id4',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule],
  templateUrl: './id4.html',
  styleUrls: ['./id4.css'],
})
export class Id4 implements AfterViewInit, OnDestroy {
  @ViewChild('pdfCanvas') pdfRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('tfCanvas') tfRef!: ElementRef<HTMLCanvasElement>;

  // --- CONFIG ---
  numLevels = 4;
  
  // --- STATE ---
  centroids: number[] = [];
  boundaries: number[] = [];
  mseHistory: number[] = [];
  iteration = 0;

  // PDF Data
  private xGrid: number[] = [];
  private pdf: number[] = [];
  private minX = -4;
  private maxX = 4;
  private step = 0.01;

  // Visuals
  private ctxPdf!: CanvasRenderingContext2D;
  private ctxTf!: CanvasRenderingContext2D;
  private resizeObserver!: ResizeObserver;

  ngAfterViewInit() {
    // Observer ensures canvases resize if the grid layout changes (e.g. mobile <-> desktop)
    this.resizeObserver = new ResizeObserver(() => {
      this.initCanvases();
      this.render();
    });

    [this.pdfRef, this.tfRef].forEach((ref) => {
      if (ref) this.resizeObserver.observe(ref.nativeElement.parentElement!);
    });

    this.generatePDF();
    this.resetUniform();
  }

  ngOnDestroy() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }

  // --- CORE LOGIC ---

  generatePDF() {
    this.xGrid = [];
    this.pdf = [];
    for (let x = this.minX; x <= this.maxX; x += this.step) {
      this.xGrid.push(x);
      const val = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
      this.pdf.push(val);
    }
  }

  resetUniform() {
    this.iteration = 0;
    this.mseHistory = [];
    
    // Reset to uniform distribution [-3, 3]
    const range = 6;
    const delta = range / this.numLevels;
    this.centroids = [];
    for (let i = 0; i < this.numLevels; i++) {
      this.centroids.push(-3 + (i + 0.5) * delta);
    }

    this.updateBoundaries();
    this.calcMSE();
    this.render();
  }

  iterate() {
    // 1. Update Centroids (Centroids of the sliced PDF areas)
    const newCentroids = [];
    const bounds = [this.minX, ...this.boundaries, this.maxX];

    for (let i = 0; i < this.numLevels; i++) {
      const start = bounds[i];
      const end = bounds[i + 1];

      let num = 0; 
      let den = 0; 

      for (let k = 0; k < this.xGrid.length; k++) {
        const x = this.xGrid[k];
        if (x >= start && x <= end) {
          const p = this.pdf[k];
          num += x * p * this.step;
          den += p * this.step;
        }
      }

      if (den < 1e-9) newCentroids.push(this.centroids[i]);
      else newCentroids.push(num / den);
    }

    this.centroids = newCentroids;

    // 2. Update Boundaries (Midpoints between centroids)
    this.updateBoundaries();

    // 3. Stats
    this.iteration++;
    this.calcMSE();
    this.render();
  }

  runConverge() {
    let prevMse = Infinity;
    for (let i = 0; i < 20; i++) {
      this.iterate();
      const currMse = this.mseHistory[this.mseHistory.length - 1];
      if (Math.abs(prevMse - currMse) < 1e-6) break;
      prevMse = currMse;
    }
  }

  private updateBoundaries() {
    this.boundaries = [];
    for (let i = 0; i < this.numLevels - 1; i++) {
      this.boundaries.push(0.5 * (this.centroids[i] + this.centroids[i + 1]));
    }
  }

  private calcMSE() {
    let error = 0;
    const bounds = [this.minX, ...this.boundaries, this.maxX];

    for (let i = 0; i < this.numLevels; i++) {
      const c = this.centroids[i];
      const start = bounds[i];
      const end = bounds[i + 1];

      for (let k = 0; k < this.xGrid.length; k++) {
        const x = this.xGrid[k];
        if (x >= start && x <= end) {
          const dist = x - c;
          error += dist * dist * this.pdf[k] * this.step;
        }
      }
    }
    this.mseHistory.push(error);
  }

  // --- VISUALIZATION ---

  private initCanvases() {
    this.initSingle(this.pdfRef, (c) => (this.ctxPdf = c));
    this.initSingle(this.tfRef, (c) => (this.ctxTf = c));
  }

  private initSingle(
    ref: ElementRef,
    cb: (c: CanvasRenderingContext2D) => void
  ) {
    if (!ref) return;
    const cvs = ref.nativeElement;
    const parent = cvs.parentElement;
    if (!parent || parent.clientWidth === 0) return;
    
    // Scale for High DPI displays
    const dpr = window.devicePixelRatio || 1;
    cvs.width = parent.clientWidth * dpr;
    cvs.height = parent.clientHeight * dpr;

    const ctx = cvs.getContext('2d')!;
    ctx.scale(dpr, dpr);
    cb(ctx);
  }

  render() {
    if (!this.ctxPdf || !this.ctxTf) return;
    this.renderPDF();
    this.renderTF();
  }

  renderPDF() {
    const w = this.ctxPdf.canvas.width / (window.devicePixelRatio || 1);
    const h = this.ctxPdf.canvas.height / (window.devicePixelRatio || 1);
    const ctx = this.ctxPdf;

    // Clear
    ctx.fillStyle = '#0e1117';
    ctx.fillRect(0, 0, w, h);
    
    const top = 20;
    const bot = h - 20;
    const pltH = bot - top;

    // Scale
    const maxP = 0.45;
    const scaleX = w / (this.maxX - this.minX);
    const scaleY = pltH / maxP;

    const toPx = (x: number) => (x - this.minX) * scaleX;
    const toPy = (y: number) => bot - y * scaleY;

    // 1. Draw Zones
    const bounds = [this.minX, ...this.boundaries, this.maxX];
    const colors = ['rgba(59, 130, 246, 0.15)', 'rgba(16, 185, 129, 0.15)'];

    for (let i = 0; i < this.numLevels; i++) {
      const x1 = toPx(bounds[i]);
      const x2 = toPx(bounds[i + 1]);
      ctx.fillStyle = colors[i % 2];
      ctx.fillRect(x1, top, Math.max(x2 - x1, 1), pltH);

      // Centroid Line
      const cx = toPx(this.centroids[i]);
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(cx, top);
      ctx.lineTo(cx, bot);
      ctx.stroke();
      ctx.setLineDash([]);

      // Centroid Dot
      const p_at_c = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * this.centroids[i] ** 2);
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(cx, toPy(p_at_c), 3, 0, 2 * Math.PI);
      ctx.fill();
    }

    // 2. Draw PDF Curve
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < this.xGrid.length; i++) {
      const px = toPx(this.xGrid[i]);
      const py = toPy(this.pdf[i]);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  renderTF() {
    const w = this.ctxTf.canvas.width / (window.devicePixelRatio || 1);
    const h = this.ctxTf.canvas.height / (window.devicePixelRatio || 1);
    const ctx = this.ctxTf;

    ctx.fillStyle = '#0e1117';
    ctx.fillRect(0, 0, w, h);
    
    const m = 30;
    const pltW = w - 2 * m;
    const pltH = h - 2 * m;

    const scale = Math.min(pltW, pltH) / (this.maxX - this.minX);
    const originX = m + pltW / 2;
    const originY = m + pltH / 2;

    const toPx = (val: number) => originX + val * scale;
    const toPy = (val: number) => originY - val * scale;

    // Grid
    ctx.strokeStyle = '#30363d';
    ctx.beginPath();
    ctx.moveTo(m, originY);
    ctx.lineTo(w - m, originY);
    ctx.moveTo(originX, m);
    ctx.lineTo(originX, h - m);
    ctx.stroke();

    // Staircase
    const bounds = [this.minX, ...this.boundaries, this.maxX];
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < this.numLevels; i++) {
      // Clamp drawing to visible area for cleanliness
      const bStart = Math.max(bounds[i], -3.5);
      const bEnd = Math.min(bounds[i+1], 3.5);
      
      const xStart = toPx(bStart);
      const xEnd = toPx(bEnd);
      const yVal = toPy(this.centroids[i]);

      ctx.moveTo(xStart, yVal);
      ctx.lineTo(xEnd, yVal);

      if (i < this.numLevels - 1) {
        const yNext = toPy(this.centroids[i + 1]);
        ctx.lineTo(xEnd, yNext);
      }
    }
    ctx.stroke();

    // 1:1 Reference Line
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(toPx(-3), toPy(-3));
    ctx.lineTo(toPx(3), toPy(3));
    ctx.stroke();
    ctx.setLineDash([]);
  }
}