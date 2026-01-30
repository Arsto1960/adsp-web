// import {
//   Component,
//   ElementRef,
//   ViewChild,
//   AfterViewInit,
//   OnInit,
// } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { MatCardModule } from '@angular/material/card';

// @Component({
//   selector: 'app-id12',
//   standalone: true,
//   imports: [CommonModule, FormsModule, MatCardModule],
//   templateUrl: './id12.html',
//   styleUrls: ['./id12.css'],
// })
// export class Id12 implements AfterViewInit, OnInit {
//   @ViewChild('mainCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

//   // --- State ---
//   activeMission: 'HUNTER' | 'CLARITY' | 'ORACLE' = 'HUNTER';

//   // Mission 1: CLARITY
//   wienerParams = { taps: 15, noiseLevel: 'Medium', seed: 42 };
//   wienerMetrics = { mseRaw: 0, mseFilt: 0, improvement: 0 };

//   // Mission 2: HUNTER
//   hunterParams = { shape: 'Rect', noisePwr: 1.0, targetLoc: 150 };
//   hunterResult = { detectedLoc: 0, success: false };

//   // Mission 3: ORACLE
//   oracleParams = { order: 5, horizon: 50 };
//   oracleError = 0;

//   private ctx!: CanvasRenderingContext2D;
//   private width = 0;
//   private height = 0;

//   ngOnInit() {
//     // Initial setup handled in AfterViewInit
//   }

//   ngAfterViewInit() {
//     setTimeout(() => {
//       this.resizeCanvas();
//       this.runMission();
//     }, 100);

//     window.addEventListener('resize', () => this.resizeCanvas());
//   }

//   resizeCanvas() {
//     if (!this.canvasRef) return;
//     const canvas = this.canvasRef.nativeElement;
//     const parent = canvas.parentElement;
//     if (parent) {
//       const rect = parent.getBoundingClientRect();
//       const dpr = window.devicePixelRatio || 1;

//       // Fixed height for stability
//       const h = 500; 
      
//       canvas.width = rect.width * dpr;
//       canvas.height = h * dpr;

//       this.width = rect.width;
//       this.height = h;

//       this.ctx = canvas.getContext('2d')!;
//       this.ctx.scale(dpr, dpr);
//       this.runMission();
//     }
//   }

//   setMission(m: 'HUNTER' | 'CLARITY' | 'ORACLE') {
//     this.activeMission = m;
//     setTimeout(() => this.runMission(), 0);
//   }

//   runMission() {
//     if (!this.ctx) return;
//     // Clear Canvas with DARK Theme
//     this.ctx.fillStyle = '#0e1117';
//     this.ctx.fillRect(0, 0, this.width, this.height);

//     if (this.activeMission === 'CLARITY') this.runWiener();
//     else if (this.activeMission === 'HUNTER') this.runMatched();
//     else if (this.activeMission === 'ORACLE') this.runLPC();
//   }

//   // ==========================================
//   // MISSION 1: WIENER FILTER
//   // ==========================================
//   runWiener() {
//     const N = 500;
//     const t = this.linspace(0, 1, N);

//     // Clean Signal
//     const clean = t.map(
//       (v) =>
//         Math.sin(2 * Math.PI * 5 * v) * Math.exp(-2 * v) +
//         0.5 * Math.sin(2 * Math.PI * 20 * v)
//     );

//     // Noise
//     const noiseMap: any = { Low: 0.1, Medium: 0.4, High: 0.8, Critical: 1.5 };
//     const std = noiseMap[this.wienerParams.noiseLevel];
//     const noise = this.randnArray(N, std);
//     const received = clean.map((v, i) => v + noise[i]);

//     // Wiener Design
//     const L = this.wienerParams.taps;
    
//     // Proper correlation slicing
//     const corrFull = this.correlate(clean, received); 
//     const mid = Math.floor(corrFull.length / 2);
//     const r_yx = corrFull.slice(mid, mid + L);

//     const autoFull = this.correlate(received, received);
//     const r_yy = autoFull.slice(mid, mid + L);

//     const Ryy = this.toeplitz(r_yy);
//     for (let i = 0; i < L; i++) Ryy[i][i] += 1e-6; // Regularize

//     const h_opt = this.solveLinear(Ryy, r_yx);
//     const restored = this.convolve(received, h_opt).slice(0, N);

//     // Metrics
//     const mseRaw = this.meanSquareError(clean, received);
//     const mseFilt = this.meanSquareError(clean, restored);
//     this.wienerMetrics = {
//       mseRaw,
//       mseFilt,
//       improvement: 10 * Math.log10(mseRaw / mseFilt),
//     };

//     // Draw
//     this.drawGrid(
//       'Time (s)',
//       'Amplitude',
//       [0, 0.2, 0.4, 0.6, 0.8, 1.0],
//       [-2, -1, 0, 1, 2]
//     );
//     this.drawSignal(t, received, '#444444', 1, false); // Dark Gray Noise
//     this.drawSignal(t, clean, '#00ff00', 2, false);    // Neon Green Clean
//     this.drawSignal(t, restored, '#00ccff', 2, true);  // Cyan Restored
//     this.drawLegend(
//       ['Corrupted Input', 'True Intel', 'Wiener Est.'],
//       ['#444', '#0f0', '#0cf']
//     );
//   }

//   wienerNewTx() {
//     this.wienerParams.seed = Math.random();
//     this.runMission();
//   }

//   // ==========================================
//   // MISSION 2: MATCHED FILTER
//   // ==========================================
//   runMatched() {
//     const N = 500;
//     const L_sig = 60;

//     // 1. Define Signal
//     let sig = new Array(L_sig).fill(0);
//     if (this.hunterParams.shape === 'Rect') sig.fill(1);
//     else if (this.hunterParams.shape === 'Gaussian') {
//       const center = (L_sig - 1) / 2;
//       for (let i = 0; i < L_sig; i++)
//         sig[i] = Math.exp(-0.5 * Math.pow((i - center) / 10, 2));
//     } else if (this.hunterParams.shape === 'Chirp') {
//       for (let i = 0; i < L_sig; i++) {
//         const t = i / L_sig;
//         sig[i] = Math.sin(2 * Math.PI * (1 * t + 4.5 * t * t)); // Chirp
//       }
//     }

//     // 2. Noisy Environment
//     const noise = this.randnArray(N, this.hunterParams.noisePwr);
//     const received = [...noise];

//     // 3. Plant Target
//     const loc = this.hunterParams.targetLoc;
//     if (loc + L_sig < N) {
//       for (let i = 0; i < L_sig; i++) received[loc + i] += sig[i];
//     }

//     // 4. Matched Filter
//     const h_matched = [...sig].reverse();
//     const full_conv = this.convolve(received, h_matched);

//     // Proper 'mode=same' centering
//     const start = Math.floor(h_matched.length / 2);
//     const score = full_conv.slice(start, start + N);

//     // 5. Detect
//     let peakVal = -Infinity;
//     let peakIdx = 0;
//     for (let i = 0; i < score.length; i++) {
//       if (Math.abs(score[i]) > peakVal) {
//         peakVal = Math.abs(score[i]);
//         peakIdx = i;
//       }
//     }

//     const detectedLoc = peakIdx - Math.floor(L_sig / 2);

//     this.hunterResult = {
//       detectedLoc: detectedLoc,
//       success: Math.abs(detectedLoc - loc) < 10,
//     };

//     // 6. Draw Split Screen
//     const h2 = this.height / 2;

//     // TOP: Raw
//     this.ctx.save();
//     this.ctx.beginPath();
//     this.ctx.rect(0, 0, this.width, h2);
//     this.ctx.clip();
//     this.drawGrid(
//       'Sample Index',
//       'Amplitude',
//       [0, 100, 200, 300, 400, 500],
//       [-3, 0, 3],
//       0,
//       h2
//     );
//     this.drawSignal(
//       this.linspace(0, N, N),
//       received,
//       '#00ff00', // Matrix Green
//       1,
//       false,
//       0,
//       h2
//     );
//     this.ctx.fillStyle = '#00ff00';
//     this.ctx.font = 'bold 12px Helvetica';
//     this.ctx.fillText('RAW SENSOR DATA', 50, 20);
//     this.ctx.restore();

//     // BOTTOM: Correlation
//     this.ctx.save();
//     this.ctx.beginPath();
//     this.ctx.rect(0, h2, this.width, h2);
//     this.ctx.clip();
//     // Normalize score
//     const maxS = Math.max(...score.map(Math.abs)) || 1;
//     const normScore = score.map((v) => (v / maxS) * 3); // Fit in +/- 3 range

//     this.drawGrid(
//       'Sample Index',
//       'Correlation',
//       [0, 100, 200, 300, 400, 500],
//       [-1, 0, 1],
//       h2,
//       this.height
//     );
//     this.drawSignal(
//       this.linspace(0, N, N),
//       normScore,
//       '#ff00ff', // Magenta Hot
//       2,
//       false,
//       h2,
//       this.height
//     );
//     this.ctx.fillStyle = '#ff00ff';
//     this.ctx.font = 'bold 12px Helvetica';
//     this.ctx.fillText('MATCHED FILTER OUTPUT', 50, h2 + 20);

//     // Crosshair
//     const xPos = (peakIdx / N) * this.width;
//     this.ctx.strokeStyle = 'white';
//     this.ctx.setLineDash([5, 5]);
//     this.ctx.beginPath();
//     this.ctx.moveTo(xPos, h2);
//     this.ctx.lineTo(xPos, this.height);
//     this.ctx.stroke();

//     if (this.hunterResult.success) {
//       this.ctx.fillStyle = 'white';
//       this.ctx.fillText('TARGET LOCK', xPos + 5, h2 + 40);
//     }
//     this.ctx.restore();
//   }

//   hunterScramble() {
//     this.hunterParams.targetLoc = Math.floor(Math.random() * 400) + 50;
//     this.runMission();
//   }

//   // ==========================================
//   // MISSION 3: ORACLE
//   // ==========================================
//   runLPC() {
//     const dataLen = 300;
//     const horizon = this.oracleParams.horizon;
//     const totalN = dataLen + horizon;

//     const x = new Array(totalN).fill(0);
//     const w = this.randnArray(totalN, 1);
//     for (let n = 2; n < totalN; n++)
//       x[n] = 0.75 * x[n - 1] - 0.5 * x[n - 2] + w[n];
//     const maxVal = Math.max(...x.map(Math.abs));
//     const fullSig = x.map((v) => v / maxVal);

//     const trainSig = fullSig.slice(0, dataLen);
//     const truthFuture = fullSig.slice(dataLen);

//     const p = this.oracleParams.order;
//     const corr = this.correlate(trainSig, trainSig);
//     const mid = Math.floor(corr.length / 2);
//     const r = corr.slice(mid, mid + p + 1);
//     const R = this.toeplitz(r.slice(0, p));
//     const b = r.slice(1);
//     const a = this.solveLinear(R, b);

//     let buffer = trainSig.slice(-p);
//     const predictions = [];
//     for (let i = 0; i < horizon; i++) {
//       let val = 0;
//       for (let k = 0; k < p; k++) val += a[k] * buffer[p - 1 - k];
//       predictions.push(val);
//       buffer.shift();
//       buffer.push(val);
//     }

//     const dispHist = 50;
//     const histData = trainSig.slice(-dispHist);
//     const totalPts = dispHist + horizon;

//     this.drawGrid('Time (n)', 'Amplitude', null, [-1, 0, 1]); // Auto-ticks

//     const xScale = this.width / totalPts;
//     const yScale = this.height / 3.5;
//     const yC = this.height / 2;

//     const plot = (
//       data: number[],
//       offset: number,
//       col: string,
//       lw: number,
//       dash: boolean
//     ) => {
//       this.ctx.beginPath();
//       this.ctx.strokeStyle = col;
//       this.ctx.lineWidth = lw;
//       if (dash) this.ctx.setLineDash([4, 4]);
//       else this.ctx.setLineDash([]);
//       for (let i = 0; i < data.length; i++) {
//         this.ctx.lineTo((i + offset) * xScale, yC - data[i] * yScale);
//       }
//       this.ctx.stroke();
//     };

//     plot(histData, 0, 'white', 2, false);
//     plot(truthFuture, dispHist, 'gray', 1, true);
//     plot(predictions, dispHist, '#ffcc00', 3, false); // Amber

//     // Dots
//     this.ctx.fillStyle = '#ffcc00';
//     for (let i = 0; i < predictions.length; i += 3) {
//       this.ctx.beginPath();
//       this.ctx.arc(
//         (i + dispHist) * xScale,
//         yC - predictions[i] * yScale,
//         3,
//         0,
//         6.28
//       );
//       this.ctx.fill();
//     }

//     // Error Calc
//     let e = 0;
//     for (let i = 0; i < horizon; i++)
//       e += Math.pow(truthFuture[i] - predictions[i], 2);
//     this.oracleError = e / horizon;

//     this.drawLegend(
//       ['Observed History', 'Actual Future', 'LPC Prediction'],
//       ['white', 'gray', '#ffcc00']
//     );
//   }

//   // --- Helpers ---
//   linspace(s: number, e: number, n: number) {
//     return Array.from({ length: n }, (_, i) => s + ((e - s) * i) / (n - 1));
//   }
//   randnArray(n: number, s: number) {
//     return Array.from({ length: n }, () => {
//       let u = 0,
//         v = 0;
//       while (u === 0) u = Math.random();
//       while (v === 0) v = Math.random();
//       return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * s;
//     });
//   }
//   meanSquareError(a: number[], b: number[]) {
//     return a.reduce((s, v, i) => s + Math.pow(v - b[i], 2), 0) / a.length;
//   }

//   convolve(u: number[], v: number[]) {
//     const n = u.length,
//       m = v.length,
//       res = new Array(n + m - 1).fill(0);
//     for (let i = 0; i < res.length; i++) {
//       const s = Math.max(0, i - m + 1),
//         e = Math.min(i + 1, n);
//       for (let j = s; j < e; j++) res[i] += u[j] * v[i - j];
//     }
//     return res;
//   }
//   correlate(u: number[], v: number[]) {
//     return this.convolve(u, [...v].reverse());
//   }
//   toeplitz(c: number[]) {
//     return c.map((_, i) => c.map((_, j) => c[Math.abs(i - j)]));
//   }

//   solveLinear(A: number[][], b: number[]) {
//     // Basic Gaussian elimination
//     const n = b.length;
//     const M = A.map((r) => [...r]);
//     const x = [...b];
//     for (let i = 0; i < n; i++) {
//       let maxR = i;
//       for (let k = i + 1; k < n; k++)
//         if (Math.abs(M[k][i]) > Math.abs(M[maxR][i])) maxR = k;
//       [M[i], M[maxR]] = [M[maxR], M[i]];
//       [x[i], x[maxR]] = [x[maxR], x[i]];
//       for (let k = i + 1; k < n; k++) {
//         const c = -M[k][i] / M[i][i];
//         for (let j = i; j < n; j++) M[k][j] += c * M[i][j];
//         x[k] += c * x[i];
//       }
//     }
//     const res = new Array(n).fill(0);
//     for (let i = n - 1; i >= 0; i--) {
//       let sum = 0;
//       for (let j = i + 1; j < n; j++) sum += M[i][j] * res[j];
//       res[i] = (x[i] - sum) / M[i][i];
//     }
//     return res;
//   }

//   // Improved Grid with Labels (Dark Theme)
//   drawGrid(
//     xLabel: string,
//     yLabel: string,
//     xTicks?: number[] | null,
//     yTicks?: number[],
//     top = 0,
//     bottom = 0
//   ) {
//     if (bottom === 0) bottom = this.height;
//     const h = bottom - top;

//     this.ctx.strokeStyle = '#333';
//     this.ctx.fillStyle = '#666';
//     this.ctx.font = '10px Helvetica';
//     this.ctx.lineWidth = 1;
//     this.ctx.beginPath();

//     // Default Ticks if null
//     if (!xTicks) xTicks = [0, 0.2, 0.4, 0.6, 0.8, 1.0]; // normalized defaults
//     if (!yTicks) yTicks = [-1, -0.5, 0, 0.5, 1];

//     // X Lines
//     xTicks.forEach((val, i) => {
//       const x = (i / (xTicks!.length - 1)) * (this.width - 60) + 40; 
//       this.ctx.moveTo(x, top);
//       this.ctx.lineTo(x, bottom);
//       this.ctx.fillText(val.toString(), x - 5, bottom - 5);
//     });

//     // Y Lines
//     yTicks.forEach((val, i) => {
//       const y = bottom - (i / (yTicks!.length - 1)) * h;
//       this.ctx.moveTo(0, y);
//       this.ctx.lineTo(this.width, y);
//       this.ctx.fillText(val.toString(), 5, y - 5);
//     });
//     this.ctx.stroke();

//     // Axis Labels
//     this.ctx.fillStyle = '#aaa';
//     this.ctx.font = '12px Helvetica';
//     this.ctx.fillText(xLabel, this.width / 2, bottom - 20);
//     this.ctx.save();
//     this.ctx.translate(15, top + h / 2);
//     this.ctx.rotate(-Math.PI / 2);
//     this.ctx.fillText(yLabel, 0, 0);
//     this.ctx.restore();
//   }

//   drawSignal(
//     x: number[],
//     y: number[],
//     color: string,
//     lw: number,
//     dashed: boolean,
//     top = 0,
//     bottom = 0
//   ) {
//     if (!bottom) bottom = this.height;
//     const h = bottom - top;

//     // Auto Range
//     let min = Math.min(...y),
//       max = Math.max(...y);
//     if (max === min) {
//       max += 1;
//       min -= 1;
//     }
//     const range = max - min;
//     const scaleY = (h - 40) / range; // 20px padding
//     const scaleX = this.width / (x.length - 1);
//     const offsetY = top + h / 2 + (min + range / 2) * scaleY; // center it

//     this.ctx.beginPath();
//     this.ctx.strokeStyle = color;
//     this.ctx.lineWidth = lw;
//     if (dashed) this.ctx.setLineDash([5, 5]);
//     else this.ctx.setLineDash([]);

//     for (let i = 0; i < x.length; i++) {
//       const px = i * scaleX;
//       const py = top + h - ((y[i] - min) / range) * (h - 40) - 20;
//       if (i === 0) this.ctx.moveTo(px, py);
//       else this.ctx.lineTo(px, py);
//     }
//     this.ctx.stroke();
//     this.ctx.setLineDash([]);
//   }

//   drawLegend(lbls: string[], cols: string[]) {
//     const x = this.width - 140,
//       y = 20;
//     this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
//     this.ctx.fillRect(x - 10, y - 10, 140, lbls.length * 20 + 10);
//     lbls.forEach((l, i) => {
//       this.ctx.fillStyle = cols[i];
//       this.ctx.fillRect(x, y + i * 20, 10, 10);
//       this.ctx.fillStyle = '#ccc';
//       this.ctx.fillText(l, x + 15, y + i * 20 + 9);
//     });
//   }
// }

import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-id12',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule],
  templateUrl: './id12.html',
  styleUrls: ['./id12.css'],
})
export class Id12 implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('mainCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  // --- State ---
  activeMission: 'HUNTER' | 'CLARITY' | 'ORACLE' = 'HUNTER';

  // Mission 1: CLARITY (Wiener)
  wienerParams = { taps: 15, noiseLevel: 'Medium', seed: 42 };
  wienerMetrics = { mseRaw: 0, mseFilt: 0, improvement: 0 };

  // Mission 2: HUNTER (Matched Filter)
  hunterParams = { shape: 'Rect', noisePwr: 1.0, targetLoc: 150 };
  hunterResult = { detectedLoc: 0, success: false };

  // Mission 3: ORACLE (LPC)
  oracleParams = { order: 5, horizon: 50 };
  oracleError = 0;

  private ctx!: CanvasRenderingContext2D;
  private width = 0;
  private height = 0;
  private resizeObserver!: ResizeObserver;

  ngOnInit() {
    this.runMission();
  }

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(() => {
      this.resizeCanvas();
    });
    if (this.canvasRef) {
      this.resizeObserver.observe(this.canvasRef.nativeElement.parentElement!);
    }
  }

  ngOnDestroy() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }

  resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement;
    if (parent) {
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      this.width = rect.width;
      this.height = rect.height;

      this.ctx = canvas.getContext('2d')!;
      this.ctx.scale(dpr, dpr);
      this.runMission();
    }
  }

  setMission(m: 'HUNTER' | 'CLARITY' | 'ORACLE') {
    this.activeMission = m;
    setTimeout(() => this.runMission(), 0);
  }

  runMission() {
    if (!this.ctx) return;
    // Clear Canvas with Dark Theme
    this.ctx.fillStyle = '#0e1117';
    this.ctx.fillRect(0, 0, this.width, this.height);

    if (this.activeMission === 'CLARITY') this.runWiener();
    else if (this.activeMission === 'HUNTER') this.runMatched();
    else if (this.activeMission === 'ORACLE') this.runLPC();
  }

  // ==========================================
  // MISSION 1: WIENER FILTER
  // ==========================================
  runWiener() {
    const N = 500;
    const t = this.linspace(0, 1, N);

    // Clean Signal
    const clean = t.map(
      (v) =>
        Math.sin(2 * Math.PI * 5 * v) * Math.exp(-2 * v) +
        0.5 * Math.sin(2 * Math.PI * 20 * v)
    );

    // Noise
    const noiseMap: any = { Low: 0.1, Medium: 0.4, High: 0.8, Critical: 1.5 };
    const std = noiseMap[this.wienerParams.noiseLevel];
    const noise = this.randnArray(N, std);
    const received = clean.map((v, i) => v + noise[i]);

    // Wiener Design
    const L = this.wienerParams.taps;
    const mid = 249; // approx center
    const corrFull = this.correlate(clean, received); 
    // Simplified correlation picking for demo speed
    const r_yx = corrFull.slice(499, 499 + L);

    const autoFull = this.correlate(received, received);
    const r_yy = autoFull.slice(499, 499 + L);

    const Ryy = this.toeplitz(r_yy);
    for (let i = 0; i < L; i++) Ryy[i][i] += 1e-6; // Regularize

    const h_opt = this.solveLinear(Ryy, r_yx);
    const restored = this.convolve(received, h_opt).slice(0, N);

    // Metrics
    const mseRaw = this.meanSquareError(clean, received);
    const mseFilt = this.meanSquareError(clean, restored);
    this.wienerMetrics = {
      mseRaw,
      mseFilt,
      improvement: 10 * Math.log10(mseRaw / mseFilt),
    };

    // Draw
    this.drawGrid('Time (s)', 'Amplitude', [0, 0.2, 0.4, 0.6, 0.8, 1.0], [-2, -1, 0, 1, 2]);
    this.drawSignal(t, received, '#444444', 1, false);
    this.drawSignal(t, clean, '#00ff00', 2, false);
    this.drawSignal(t, restored, '#00ccff', 2, true);
    this.drawLegend(['Corrupted Input', 'True Intel', 'Wiener Est.'], ['#444', '#0f0', '#0cf']);
  }

  wienerNewTx() {
    this.wienerParams.seed = Math.random();
    this.runMission();
  }

  // ==========================================
  // MISSION 2: MATCHED FILTER
  // ==========================================
  runMatched() {
    const N = 500;
    const L_sig = 60;

    // 1. Define Signal
    let sig = new Array(L_sig).fill(0);
    if (this.hunterParams.shape === 'Rect') sig.fill(1);
    else if (this.hunterParams.shape === 'Gaussian') {
      const center = (L_sig - 1) / 2;
      for (let i = 0; i < L_sig; i++)
        sig[i] = Math.exp(-0.5 * Math.pow((i - center) / 10, 2));
    } else if (this.hunterParams.shape === 'Chirp') {
      for (let i = 0; i < L_sig; i++) {
        const t = i / L_sig;
        sig[i] = Math.sin(2 * Math.PI * (1 * t + 4.5 * t * t));
      }
    }

    // 2. Noisy Environment
    const noise = this.randnArray(N, this.hunterParams.noisePwr);
    const received = [...noise];

    // 3. Plant Target
    const loc = this.hunterParams.targetLoc;
    if (loc + L_sig < N) {
      for (let i = 0; i < L_sig; i++) received[loc + i] += sig[i];
    }

    // 4. Matched Filter
    const h_matched = [...sig].reverse();
    const full_conv = this.convolve(received, h_matched);
    const start = Math.floor(h_matched.length / 2);
    const score = full_conv.slice(start, start + N);

    // 5. Detect
    let peakVal = -Infinity;
    let peakIdx = 0;
    for (let i = 0; i < score.length; i++) {
      if (Math.abs(score[i]) > peakVal) {
        peakVal = Math.abs(score[i]);
        peakIdx = i;
      }
    }

    const detectedLoc = peakIdx - Math.floor(L_sig / 2);
    this.hunterResult = {
      detectedLoc: detectedLoc,
      success: Math.abs(detectedLoc - loc) < 10,
    };

    // 6. Draw Split Screen
    const h2 = this.height / 2;

    // TOP: Raw
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.width, h2);
    this.ctx.clip();
    this.drawGrid('Sample Index', 'Amplitude', [0, 100, 200, 300, 400, 500], [-3, 0, 3], 0, h2);
    this.drawSignal(this.linspace(0, N, N), received, '#00ff00', 1, false, 0, h2);
    this.ctx.fillStyle = '#00ff00';
    this.ctx.font = 'bold 12px Helvetica';
    this.ctx.fillText('RAW SENSOR DATA', 50, 20);
    this.ctx.restore();

    // BOTTOM: Correlation
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(0, h2, this.width, h2);
    this.ctx.clip();
    const maxS = Math.max(...score.map(Math.abs)) || 1;
    const normScore = score.map((v) => (v / maxS) * 3);

    this.drawGrid('Sample Index', 'Correlation', [0, 100, 200, 300, 400, 500], [-1, 0, 1], h2, this.height);
    this.drawSignal(this.linspace(0, N, N), normScore, '#ff00ff', 2, false, h2, this.height);
    this.ctx.fillStyle = '#ff00ff';
    this.ctx.font = 'bold 12px Helvetica';
    this.ctx.fillText('MATCHED FILTER OUTPUT', 50, h2 + 20);

    // Crosshair
    const xPos = (peakIdx / N) * this.width;
    this.ctx.strokeStyle = 'white';
    this.ctx.setLineDash([5, 5]);
    this.ctx.beginPath();
    this.ctx.moveTo(xPos, h2);
    this.ctx.lineTo(xPos, this.height);
    this.ctx.stroke();

    if (this.hunterResult.success) {
      this.ctx.fillStyle = 'white';
      this.ctx.fillText('TARGET LOCK', xPos + 5, h2 + 40);
    }
    this.ctx.restore();
  }

  hunterScramble() {
    this.hunterParams.targetLoc = Math.floor(Math.random() * 400) + 50;
    this.runMission();
  }

  // ==========================================
  // MISSION 3: ORACLE (LPC)
  // ==========================================
  runLPC() {
    const dataLen = 300;
    const horizon = this.oracleParams.horizon;
    const totalN = dataLen + horizon;

    const x = new Array(totalN).fill(0);
    const w = this.randnArray(totalN, 1);
    for (let n = 2; n < totalN; n++) x[n] = 0.75 * x[n - 1] - 0.5 * x[n - 2] + w[n];
    const maxVal = Math.max(...x.map(Math.abs));
    const fullSig = x.map((v) => v / maxVal);

    const trainSig = fullSig.slice(0, dataLen);
    const truthFuture = fullSig.slice(dataLen);

    const p = this.oracleParams.order;
    const corr = this.correlate(trainSig, trainSig);
    const mid = Math.floor(corr.length / 2);
    const r = corr.slice(mid, mid + p + 1);
    const R = this.toeplitz(r.slice(0, p));
    const b = r.slice(1);
    const a = this.solveLinear(R, b);

    let buffer = trainSig.slice(-p);
    const predictions = [];
    for (let i = 0; i < horizon; i++) {
      let val = 0;
      for (let k = 0; k < p; k++) val += a[k] * buffer[p - 1 - k];
      predictions.push(val);
      buffer.shift();
      buffer.push(val);
    }

    const dispHist = 50;
    const histData = trainSig.slice(-dispHist);
    const totalPts = dispHist + horizon;

    this.drawGrid('Time (n)', 'Amplitude', null, [-1, 0, 1]);

    const xScale = this.width / totalPts;
    const yScale = this.height / 3.5;
    const yC = this.height / 2;

    const plot = (data: number[], offset: number, col: string, lw: number, dash: boolean) => {
      this.ctx.beginPath();
      this.ctx.strokeStyle = col;
      this.ctx.lineWidth = lw;
      if (dash) this.ctx.setLineDash([4, 4]); else this.ctx.setLineDash([]);
      for (let i = 0; i < data.length; i++) {
        this.ctx.lineTo((i + offset) * xScale, yC - data[i] * yScale);
      }
      this.ctx.stroke();
    };

    plot(histData, 0, 'white', 2, false);
    plot(truthFuture, dispHist, 'gray', 1, true);
    plot(predictions, dispHist, '#ffcc00', 3, false);

    // Dots
    this.ctx.fillStyle = '#ffcc00';
    for (let i = 0; i < predictions.length; i += 3) {
      this.ctx.beginPath();
      this.ctx.arc((i + dispHist) * xScale, yC - predictions[i] * yScale, 3, 0, 6.28);
      this.ctx.fill();
    }

    let e = 0;
    for (let i = 0; i < horizon; i++) e += Math.pow(truthFuture[i] - predictions[i], 2);
    this.oracleError = e / horizon;

    this.drawLegend(['Observed History', 'Actual Future', 'LPC Prediction'], ['white', 'gray', '#ffcc00']);
  }

  // --- Helpers ---
  linspace(s: number, e: number, n: number) { return Array.from({ length: n }, (_, i) => s + ((e - s) * i) / (n - 1)); }
  randnArray(n: number, s: number) { return Array.from({ length: n }, () => { let u = 0, v = 0; while (u === 0) u = Math.random(); while (v === 0) v = Math.random(); return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * s; }); }
  meanSquareError(a: number[], b: number[]) { return a.reduce((s, v, i) => s + Math.pow(v - b[i], 2), 0) / a.length; }
  convolve(u: number[], v: number[]) { const n = u.length, m = v.length, res = new Array(n + m - 1).fill(0); for (let i = 0; i < res.length; i++) { const s = Math.max(0, i - m + 1), e = Math.min(i + 1, n); for (let j = s; j < e; j++) res[i] += u[j] * v[i - j]; } return res; }
  correlate(u: number[], v: number[]) { return this.convolve(u, [...v].reverse()); }
  toeplitz(c: number[]) { return c.map((_, i) => c.map((_, j) => c[Math.abs(i - j)])); }
  solveLinear(A: number[][], b: number[]) { const n = b.length; const M = A.map((r) => [...r]); const x = [...b]; for (let i = 0; i < n; i++) { let maxR = i; for (let k = i + 1; k < n; k++) if (Math.abs(M[k][i]) > Math.abs(M[maxR][i])) maxR = k; [M[i], M[maxR]] = [M[maxR], M[i]]; [x[i], x[maxR]] = [x[maxR], x[i]]; for (let k = i + 1; k < n; k++) { const c = -M[k][i] / M[i][i]; for (let j = i; j < n; j++) M[k][j] += c * M[i][j]; x[k] += c * x[i]; } } const res = new Array(n).fill(0); for (let i = n - 1; i >= 0; i--) { let sum = 0; for (let j = i + 1; j < n; j++) sum += M[i][j] * res[j]; res[i] = (x[i] - sum) / M[i][i]; } return res; }

  // Canvas Drawing
  drawGrid(xLabel: string, yLabel: string, xTicks?: number[] | null, yTicks?: number[], top = 0, bottom = 0) {
    if (bottom === 0) bottom = this.height;
    const h = bottom - top;
    this.ctx.strokeStyle = '#333'; this.ctx.fillStyle = '#666'; this.ctx.font = '10px Helvetica'; this.ctx.lineWidth = 1; this.ctx.beginPath();
    if (!xTicks) xTicks = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
    if (!yTicks) yTicks = [-1, -0.5, 0, 0.5, 1];
    xTicks.forEach((val, i) => { const x = (i / (xTicks!.length - 1)) * (this.width - 60) + 40; this.ctx.moveTo(x, top); this.ctx.lineTo(x, bottom); this.ctx.fillText(val.toString(), x - 5, bottom - 5); });
    yTicks.forEach((val, i) => { const y = bottom - (i / (yTicks!.length - 1)) * h; this.ctx.moveTo(0, y); this.ctx.lineTo(this.width, y); this.ctx.fillText(val.toString(), 5, y - 5); });
    this.ctx.stroke();
    this.ctx.fillStyle = '#aaa'; this.ctx.font = '12px Helvetica'; this.ctx.fillText(xLabel, this.width / 2, bottom - 20);
    this.ctx.save(); this.ctx.translate(15, top + h / 2); this.ctx.rotate(-Math.PI / 2); this.ctx.fillText(yLabel, 0, 0); this.ctx.restore();
  }

  drawSignal(x: number[], y: number[], color: string, lw: number, dashed: boolean, top = 0, bottom = 0) {
    if (!bottom) bottom = this.height;
    const h = bottom - top;
    let min = Math.min(...y), max = Math.max(...y); if (max === min) { max += 1; min -= 1; }
    const range = max - min; const scaleY = (h - 40) / range; const scaleX = this.width / (x.length - 1);
    this.ctx.beginPath(); this.ctx.strokeStyle = color; this.ctx.lineWidth = lw;
    if (dashed) this.ctx.setLineDash([5, 5]); else this.ctx.setLineDash([]);
    for (let i = 0; i < x.length; i++) { const px = i * scaleX; const py = top + h - ((y[i] - min) / range) * (h - 40) - 20; if (i === 0) this.ctx.moveTo(px, py); else this.ctx.lineTo(px, py); }
    this.ctx.stroke(); this.ctx.setLineDash([]);
  }

  drawLegend(lbls: string[], cols: string[]) {
    const x = this.width - 140, y = 20;
    this.ctx.fillStyle = 'rgba(0,0,0,0.7)'; this.ctx.fillRect(x - 10, y - 10, 140, lbls.length * 20 + 10);
    lbls.forEach((l, i) => { this.ctx.fillStyle = cols[i]; this.ctx.fillRect(x, y + i * 20, 10, 10); this.ctx.fillStyle = '#ccc'; this.ctx.fillText(l, x + 15, y + i * 20 + 9); });
  }
}