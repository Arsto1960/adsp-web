// import {
//   Component,
//   ElementRef,
//   ViewChild,
//   AfterViewInit,
//   OnDestroy,
// } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { MatCardModule } from '@angular/material/card';

// @Component({
//   selector: 'app-id6',
//   standalone: true,
//   imports: [CommonModule, FormsModule, MatCardModule],
//   templateUrl: './id6.html',
//   styleUrls: ['./id6.css'],
// })
// export class Id6 implements AfterViewInit, OnDestroy {
//   @ViewChild('timeCanvas') timeCanvasRef!: ElementRef<HTMLCanvasElement>;
//   @ViewChild('freqCanvas') freqCanvasRef!: ElementRef<HTMLCanvasElement>;

//   activeMode: 'DOWN' | 'UP' = 'DOWN';

//   // Params
//   fs = 8000;
//   f0 = 150;
//   duty = 60;
//   duration = 0.5; // seconds
//   factor = 2; // Decimation/Interp factor
//   useFilter = true;

//   // Audio State
//   private audioCtx: AudioContext | null = null;
//   private sigOriginal: Float32Array | null = null;
//   private sigProcessed: Float32Array | null = null;
//   private fsProcessed = 8000;
  
//   isPlayingOriginal = false;
//   isPlayingProcessed = false;

//   // State text
//   infoText = '';

//   private ctxTime!: CanvasRenderingContext2D;
//   private ctxFreq!: CanvasRenderingContext2D;
//   private resizeObserver!: ResizeObserver;

//   ngAfterViewInit() {
//     this.resizeObserver = new ResizeObserver(() => {
//       this.initCanvases();
//       this.runSimulation();
//     });

//     [this.timeCanvasRef, this.freqCanvasRef].forEach((ref) => {
//       if (ref) this.resizeObserver.observe(ref.nativeElement.parentElement!);
//     });
//   }

//   ngOnDestroy() {
//     if (this.resizeObserver) this.resizeObserver.disconnect();
//     if (this.audioCtx) this.audioCtx.close();
//   }

//   setMode(m: 'DOWN' | 'UP') {
//     this.activeMode = m;
//     this.runSimulation();
//   }

//   // ==========================================================
//   // MAIN SIMULATION LOOP
//   // ==========================================================
//   runSimulation() {
//     if (!this.ctxTime || !this.ctxFreq) return;

//     // 1. Generate Source (Square Wave)
//     const N = Math.floor(this.duration * this.fs);
//     const t = new Float32Array(N);
//     const sig = new Float32Array(N);

//     // Create Square Wave
//     const period = this.fs / this.f0;
//     const highSamps = period * (this.duty / 100);

//     for (let i = 0; i < N; i++) {
//       t[i] = i / this.fs;
//       const phase = i % period;
//       sig[i] = phase < highSamps ? 0.9 : -0.9;
//     }

//     let processedSig: Float32Array;
//     let procFs: number;
//     let tProc: Float32Array;

//     // --- DOWNSAMPLING LOGIC ---
//     if (this.activeMode === 'DOWN') {
//       const targetFs = this.fs / this.factor;
//       procFs = targetFs;

//       // Step A: Filter (Anti-Aliasing)
//       let preSig = sig;
//       if (this.useFilter && this.factor > 1) {
//         const cutoff = (0.5 / this.factor) * 0.9;
//         const h = this.firDesign(63, cutoff);
//         const filt = this.convolve(sig, h);
//         const delay = Math.floor(h.length / 2);
//         preSig = filt.slice(delay, delay + N);
//       }

//       // Step B: Decimate
//       const newLen = Math.floor(N / this.factor);
//       processedSig = new Float32Array(newLen);
//       tProc = new Float32Array(newLen);
//       for (let i = 0; i < newLen; i++) {
//         processedSig[i] = preSig[i * this.factor];
//         tProc[i] = i / procFs;
//       }

//       this.infoText = `Original: ${this.fs}Hz | New: ${procFs}Hz. Anti-Aliasing: ${this.useFilter ? 'ON' : 'OFF'}`;
//     }

//     // --- UPSAMPLING LOGIC ---
//     else {
//       const lowFs = this.fs / this.factor;
//       const targetFs = this.fs;

//       // 1. Decimate first (Perfectly) to get a clean low-res source
//       const h_aa = this.firDesign(63, (0.5 / this.factor) * 0.9);
//       const filt = this.convolve(sig, h_aa);
//       const delay = Math.floor(h_aa.length / 2);
//       const sigClean = filt.slice(delay, delay + N);
//       const lowRes = new Float32Array(Math.floor(N / this.factor));
//       for (let i = 0; i < lowRes.length; i++)
//         lowRes[i] = sigClean[i * this.factor];

//       // 2. Insert Zeros (Upsampling)
//       const upLen = lowRes.length * this.factor;
//       const zeroStuffed = new Float32Array(upLen);
//       for (let i = 0; i < lowRes.length; i++) {
//         zeroStuffed[i * this.factor] = lowRes[i];
//       }

//       // 3. Interpolation Filter (Reconstruction)
//       if (this.useFilter) {
//         const h_interp = this.firDesign(63, (0.5 / this.factor) * 0.9);
//         // Gain correction
//         for (let k = 0; k < h_interp.length; k++) h_interp[k] *= this.factor;

//         const rec = this.convolve(zeroStuffed, h_interp);
//         const d2 = Math.floor(h_interp.length / 2);
//         processedSig = rec.slice(d2, d2 + upLen);
//       } else {
//         processedSig = zeroStuffed;
//       }

//       procFs = this.fs;
//       tProc = t; 

//       this.infoText = `Input: ${lowFs}Hz | Upsampled: ${targetFs}Hz. Interpolation Filter: ${
//         this.useFilter ? 'ON' : 'OFF'
//       }`;
//     }

//     // Store for Audio Playback
//     this.sigOriginal = sig;
//     this.sigProcessed = processedSig;
//     this.fsProcessed = procFs;

//     // --- VISUALIZATION ---
//     this.drawTime(t, sig, tProc, processedSig);
//     this.drawFreq(sig, this.fs, processedSig, procFs);
//   }

//   // ==========================================================
//   // DIRECT AUDIO PLAYBACK
//   // ==========================================================
//   playSignal(type: 'ORIGINAL' | 'PROCESSED') {
//     const data = type === 'ORIGINAL' ? this.sigOriginal : this.sigProcessed;
//     const rate = type === 'ORIGINAL' ? this.fs : this.fsProcessed;

//     if (!data) return;

//     if (!this.audioCtx) this.audioCtx = new AudioContext();
//     if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

//     const buffer = this.audioCtx.createBuffer(1, data.length, rate);
//     const channel = buffer.getChannelData(0);
//     for (let i = 0; i < data.length; i++) channel[i] = data[i];

//     const source = this.audioCtx.createBufferSource();
//     source.buffer = buffer;
//     source.connect(this.audioCtx.destination);
//     source.start();

//     if (type === 'ORIGINAL') {
//       this.isPlayingOriginal = true;
//       source.onended = () => (this.isPlayingOriginal = false);
//     } else {
//       this.isPlayingProcessed = true;
//       source.onended = () => (this.isPlayingProcessed = false);
//     }
//   }

//   // ==========================================================
//   // CANVAS DRAWING
//   // ==========================================================

//   drawTime(
//     t1: Float32Array,
//     y1: Float32Array,
//     t2: Float32Array,
//     y2: Float32Array
//   ) {
//     const w = this.ctxTime.canvas.width / (window.devicePixelRatio || 1);
//     const h = this.ctxTime.canvas.height / (window.devicePixelRatio || 1);
//     this.clearCtx(this.ctxTime, w, h);

//     // Show only first 20ms
//     const zoomT = 0.02;

//     // Draw Original (Gray line)
//     this.drawSignal(this.ctxTime, w, h, t1, y1, zoomT, '#444', 1, false);

//     // Draw Processed (Blue Dots/Line)
//     const col =
//       this.activeMode === 'UP' && !this.useFilter ? '#ef4444' : '#00e5ff';
    
//     this.drawSignal(this.ctxTime, w, h, t2, y2, zoomT, col, 2, true);
//   }

//   drawFreq(y1: Float32Array, fs1: number, y2: Float32Array, fs2: number) {
//     const w = this.ctxFreq.canvas.width / (window.devicePixelRatio || 1);
//     const h = this.ctxFreq.canvas.height / (window.devicePixelRatio || 1);
//     this.clearCtx(this.ctxFreq, w, h);

//     // FFT
//     const fft1 = this.fftMagDb(y1);
//     const fft2 = this.fftMagDb(y2);

//     const maxF = Math.max(fs1 / 2, fs2 / 2);

//     this.drawSpectrum(this.ctxFreq, w, h, fft1, fs1, maxF, '#444', 'Original');

//     const col =
//       this.activeMode === 'DOWN' && !this.useFilter ? '#ef4444' : '#00e5ff';
//     const label =
//       this.activeMode === 'DOWN' ? 'Decimated' : 'Upsampled';
//     this.drawSpectrum(this.ctxFreq, w, h, fft2, fs2, maxF, col, label);
//   }

//   drawSignal(
//     ctx: CanvasRenderingContext2D,
//     w: number,
//     h: number,
//     t: Float32Array,
//     y: Float32Array,
//     maxT: number,
//     col: string,
//     lw: number,
//     dots: boolean
//   ) {
//     let limit = 0;
//     for (let i = 0; i < t.length; i++) {
//       if (t[i] > maxT) {
//         limit = i;
//         break;
//       }
//     }
//     if (limit === 0) limit = t.length;

//     const scX = (w - 60) / maxT;
//     const scY = (h - 60) / 2.5; 
//     const midY = h / 2;
//     const offX = 40;

//     ctx.strokeStyle = col;
//     ctx.lineWidth = lw;
//     ctx.fillStyle = col;
//     ctx.beginPath();
//     let started = false;
//     for (let i = 0; i < limit; i++) {
//       const px = offX + t[i] * scX;
//       const py = midY - y[i] * scY;
//       if (!started) {
//         ctx.moveTo(px, py);
//         started = true;
//       } else ctx.lineTo(px, py);
//     }
//     // Only stroke line if it's not the zero-stuffed sparse signal
//     if (!(this.activeMode === 'UP' && !this.useFilter && dots)) {
//       ctx.stroke();
//     }

//     if (dots) {
//       for (let i = 0; i < limit; i++) {
//         const px = offX + t[i] * scX;
//         const py = midY - y[i] * scY;
//         // For zero stuffing, emphasize non-zeros
//         if (Math.abs(y[i]) > 0.01 || this.activeMode === 'DOWN') {
//           ctx.beginPath();
//           ctx.arc(px, py, 2, 0, 2 * Math.PI);
//           ctx.fill();
//         }
//       }
//     }
//   }

//   drawSpectrum(
//     ctx: CanvasRenderingContext2D,
//     w: number,
//     h: number,
//     magDb: Float32Array,
//     fs: number,
//     maxDispF: number,
//     col: string,
//     lbl: string
//   ) {
//     const N = magDb.length;
//     const nyquist = fs / 2;

//     const scX = (w - 60) / maxDispF;
//     const scY = (h - 60) / 100; // 100dB range
//     const offX = 40;
//     const botY = h - 30;

//     ctx.strokeStyle = col;
//     ctx.lineWidth = 1.5;
//     ctx.beginPath();

//     for (let i = 0; i < N; i++) {
//       const freq = i * (nyquist / N);
//       if (freq > maxDispF) break;

//       const db = Math.max(-100, magDb[i]);
//       const px = offX + freq * scX;
//       const py = botY - (db + 100) * scY; 

//       if (i === 0) ctx.moveTo(px, py);
//       else ctx.lineTo(px, py);
//     }
//     ctx.stroke();

//     // Draw Nyquist Marker
//     const nx = offX + nyquist * scX;
//     ctx.strokeStyle = col;
//     ctx.setLineDash([4, 4]);
//     ctx.beginPath();
//     ctx.moveTo(nx, 20);
//     ctx.lineTo(nx, h - 30);
//     ctx.stroke();
//     ctx.setLineDash([]);
//     ctx.fillStyle = col;
//     ctx.font = '10px monospace';
//     ctx.fillText(`${lbl} Nyquist`, nx + 5, 30);
//   }

//   // ==========================================================
//   // DSP HELPERS
//   // ==========================================================

//   private firDesign(N: number, fc: number): Float32Array {
//     const h = new Float32Array(N);
//     const center = (N - 1) / 2;
//     for (let n = 0; n < N; n++) {
//       const k = n - center;
//       const val =
//         k === 0 ? 2 * fc : Math.sin(2 * Math.PI * fc * k) / (Math.PI * k);
//       const win = 0.54 - 0.46 * Math.cos((2 * Math.PI * n) / (N - 1));
//       h[n] = val * win;
//     }
//     return h;
//   }

//   private convolve(u: Float32Array, v: Float32Array): Float32Array {
//     const n = u.length,
//       m = v.length;
//     const res = new Float32Array(n + m - 1);
//     for (let i = 0; i < n; i++) {
//       for (let j = 0; j < m; j++) {
//         res[i + j] += u[i] * v[j];
//       }
//     }
//     return res;
//   }

//   private fftMagDb(sig: Float32Array): Float32Array {
//     const n = sig.length;
//     const p2 = Math.pow(2, Math.floor(Math.log2(n)));
//     const real = new Float64Array(p2);
//     const imag = new Float64Array(p2);
//     for (let i = 0; i < p2; i++) {
//       const win = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (p2 - 1)));
//       real[i] = sig[i] * win;
//     }

//     this.transform(real, imag);

//     const half = p2 / 2;
//     const db = new Float32Array(half);
//     for (let i = 0; i < half; i++) {
//       const mag = Math.sqrt(real[i] ** 2 + imag[i] ** 2);
//       db[i] = 20 * Math.log10(mag + 1e-9);
//     }
//     return db;
//   }

//   private transform(real: Float64Array, imag: Float64Array) {
//     const n = real.length;
//     if (n <= 1) return;
//     let j = 0;
//     for (let i = 0; i < n; i++) {
//       if (i < j) {
//         [real[i], real[j]] = [real[j], real[i]];
//         [imag[i], imag[j]] = [imag[j], imag[i]];
//       }
//       let m = n >> 1;
//       while (j >= m && m > 0) {
//         j -= m;
//         m >>= 1;
//       }
//       j += m;
//     }
//     for (let len = 2; len <= n; len <<= 1) {
//       const ang = (-2 * Math.PI) / len;
//       const wlen_r = Math.cos(ang),
//         wlen_i = Math.sin(ang);
//       for (let i = 0; i < n; i += len) {
//         let w_r = 1,
//           w_i = 0;
//         for (let k = 0; k < len / 2; k++) {
//           const u_r = real[i + k],
//             u_i = imag[i + k];
//           const v_r = real[i + k + len / 2] * w_r - imag[i + k + len / 2] * w_i;
//           const v_i = real[i + k + len / 2] * w_i + imag[i + k + len / 2] * w_r;
//           real[i + k] = u_r + v_r;
//           imag[i + k] = u_i + v_i;
//           real[i + k + len / 2] = u_r - v_r;
//           imag[i + k + len / 2] = u_i - v_i;
//           const temp_r = w_r;
//           w_r = w_r * wlen_r - w_i * wlen_i;
//           w_i = temp_r * wlen_i + w_i * wlen_r;
//         }
//       }
//     }
//   }

//   // Canvas helper
//   private initCanvases() {
//     this.initSingle(this.timeCanvasRef, (c) => (this.ctxTime = c));
//     this.initSingle(this.freqCanvasRef, (c) => (this.ctxFreq = c));
//   }

//   private initSingle(
//     ref: ElementRef,
//     cb: (c: CanvasRenderingContext2D) => void
//   ) {
//     if (!ref) return;
//     const cvs = ref.nativeElement;
//     const parent = cvs.parentElement;
    
//     // UPDATED: Use parent dimension for responsive resizing
//     if (!parent || parent.clientWidth === 0) return;
//     const dpr = window.devicePixelRatio || 1;
    
//     cvs.width = parent.clientWidth * dpr;
//     cvs.height = parent.clientHeight * dpr;
    
//     const ctx = cvs.getContext('2d')!;
//     ctx.scale(dpr, dpr);
//     cb(ctx);
//   }

//   private clearCtx(ctx: CanvasRenderingContext2D, w: number, h: number) {
//     ctx.fillStyle = '#000000'; // Pure black for CRT look
//     ctx.fillRect(0, 0, w, h);
//   }
// }

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
  selector: 'app-id6',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule],
  templateUrl: './id6.html',
  styleUrls: ['./id6.css'],
})
export class Id6 implements AfterViewInit, OnDestroy {
  @ViewChild('timeCanvas') timeCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('freqCanvas') freqCanvasRef!: ElementRef<HTMLCanvasElement>;

  activeMode: 'DOWN' | 'UP' = 'DOWN';

  // Params
  fs = 8000;
  f0 = 200; // Slightly higher to see waves better
  duty = 50;
  duration = 0.5;
  factor = 4; // Default to 4 to see effect immediately
  useFilter = false;

  // Audio State
  private audioCtx: AudioContext | null = null;
  public sigOriginal: Float32Array | null = null;
  public sigProcessed: Float32Array | null = null;
  public fsProcessed = 8000;
  
  isPlayingOriginal = false;
  isPlayingProcessed = false;

  infoText = '';

  private ctxTime!: CanvasRenderingContext2D;
  private ctxFreq!: CanvasRenderingContext2D;
  private resizeObserver!: ResizeObserver;

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(() => {
      this.initCanvases();
      this.runSimulation();
    });

    [this.timeCanvasRef, this.freqCanvasRef].forEach((ref) => {
      if (ref) this.resizeObserver.observe(ref.nativeElement.parentElement!);
    });
  }

  ngOnDestroy() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.audioCtx) this.audioCtx.close();
  }

  setMode(m: 'DOWN' | 'UP') {
    this.activeMode = m;
    this.runSimulation();
  }

  runSimulation() {
    if (!this.ctxTime || !this.ctxFreq) return;

    // 1. Generate Source (High Res Square Wave)
    const N = Math.floor(this.duration * this.fs);
    const t = new Float32Array(N);
    const sig = new Float32Array(N);

    const period = this.fs / this.f0;
    const highSamps = period * (this.duty / 100);

    for (let i = 0; i < N; i++) {
      t[i] = i / this.fs;
      const phase = i % period;
      sig[i] = phase < highSamps ? 0.8 : -0.8;
    }

    let processedSig: Float32Array;
    let procFs: number;
    let tProc: Float32Array;
    let backgroundSig: Float32Array = sig; // For visualization context

    // --- DOWNSAMPLING ---
    if (this.activeMode === 'DOWN') {
      const targetFs = this.fs / this.factor;
      procFs = targetFs;

      // Filter?
      if (this.useFilter && this.factor > 1) {
        // Design Lowpass
        const cutoff = (0.5 / this.factor) * 0.9;
        const h = this.firDesign(63, cutoff);
        const filt = this.convolve(sig, h);
        const delay = Math.floor(h.length / 2);
        // The background signal becomes the Filtered signal (so dots align)
        backgroundSig = filt.slice(delay, delay + N); 
      }

      // Decimate (Pick every M-th sample)
      const newLen = Math.floor(N / this.factor);
      processedSig = new Float32Array(newLen);
      tProc = new Float32Array(newLen);
      
      for (let i = 0; i < newLen; i++) {
        processedSig[i] = backgroundSig[i * this.factor];
        tProc[i] = (i * this.factor) / this.fs; // Use original time scale
      }

      this.infoText = `Reducing Sample Rate by ${this.factor}. ${this.useFilter ? '(Anti-Aliasing Filter Applied)' : '(No Filter - Aliasing Visible!)'}`;
    } 
    
    // --- UPSAMPLING ---
    else {
      // 1. Create a "Perfect" Low Res Signal first (to simulate input)
      // We essentially do a proper downsample first to get our starting point
      const h_aa = this.firDesign(63, (0.5 / this.factor) * 0.9);
      const filt = this.convolve(sig, h_aa);
      const delay = Math.floor(h_aa.length / 2);
      const cleanSource = filt.slice(delay, delay + N);
      
      const lowResLen = Math.floor(N / this.factor);
      const lowResSig = new Float32Array(lowResLen);
      for(let i=0; i<lowResLen; i++) lowResSig[i] = cleanSource[i*this.factor];

      // 2. Zero Stuffing
      const upLen = lowResLen * this.factor;
      const zeroStuffed = new Float32Array(upLen);
      
      // We populate backgroundSig to show the "Zeros"
      backgroundSig = new Float32Array(upLen); 

      for (let i = 0; i < lowResLen; i++) {
        zeroStuffed[i * this.factor] = lowResSig[i];
        backgroundSig[i * this.factor] = lowResSig[i]; // Sparse array
      }

      // 3. Interpolation
      if (this.useFilter) {
        const h_interp = this.firDesign(63, (0.5 / this.factor) * 0.9);
        // Gain correction
        for (let k = 0; k < h_interp.length; k++) h_interp[k] *= this.factor;

        const rec = this.convolve(zeroStuffed, h_interp);
        const d2 = Math.floor(h_interp.length / 2);
        processedSig = rec.slice(d2, d2 + upLen);
      } else {
        processedSig = zeroStuffed;
      }

      procFs = this.fs;
      tProc = t; // Back to high res time
      this.infoText = `Inserting ${this.factor-1} Zeros. ${this.useFilter ? '(Reconstruction Filter Applied)' : '(Raw Zeros - Imaging Visible!)'}`;
    }

    // Audio State
    this.sigOriginal = sig;
    this.sigProcessed = processedSig;
    this.fsProcessed = procFs;

    // Visualization
    this.drawOscilloscope(t, backgroundSig, tProc, processedSig);
    this.drawSpectrumAnalyzer(sig, this.fs, processedSig, procFs);
  }

  // ==========================================================
  // AUDIO
  // ==========================================================
  playSignal(type: 'ORIGINAL' | 'PROCESSED') {
    let data = type === 'ORIGINAL' ? this.sigOriginal : this.sigProcessed;
    let rate = type === 'ORIGINAL' ? this.fs : this.fsProcessed;

    if (!data) return;

    if (!this.audioCtx) this.audioCtx = new AudioContext();
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    // Browser Safety: If sample rate is too low (< 3000Hz), upsample via Sample-and-Hold for playback
    if (rate < 3000) {
       const upFactor = Math.ceil(3000 / rate);
       const newData = new Float32Array(data.length * upFactor);
       for(let i=0; i<data.length; i++) {
         for(let k=0; k<upFactor; k++) newData[i*upFactor + k] = data[i];
       }
       data = newData;
       rate = rate * upFactor;
    }

    const buffer = this.audioCtx.createBuffer(1, data.length, rate);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) channel[i] = data[i];

    const source = this.audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioCtx.destination);
    source.start();

    if (type === 'ORIGINAL') {
      this.isPlayingOriginal = true;
      source.onended = () => (this.isPlayingOriginal = false);
    } else {
      this.isPlayingProcessed = true;
      source.onended = () => (this.isPlayingProcessed = false);
    }
  }

  // ==========================================================
  // VISUALIZATION (OSCILLOSCOPE STYLE)
  // ==========================================================

  drawOscilloscope(tBg: Float32Array, yBg: Float32Array, tFg: Float32Array, yFg: Float32Array) {
    const w = this.ctxTime.canvas.width;
    const h = this.ctxTime.canvas.height;
    const ctx = this.ctxTime;
    
    // 1. Screen BG & Grid
    ctx.fillStyle = '#001a1a'; // Dark green-black
    ctx.fillRect(0, 0, w, h);
    this.drawGrid(ctx, w, h);

    // Zoom window (25ms)
    const zoomT = 0.025;
    
    // Scale Logic
    const scX = w / zoomT;
    const scY = h / 2.5;
    const midY = h / 2;

    // 2. Draw Background Signal (The "Ghost" or "Source")
    // In Downsample: This is the continuous lines
    // In Upsample: This is the sparse samples (dots)
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(46, 204, 113, 0.2)'; // Faint CRT Green
    ctx.beginPath();
    for(let i=0; i<tBg.length; i++) {
        if(tBg[i] > zoomT) break;
        const x = tBg[i] * scX;
        const y = midY - yBg[i] * scY;
        if(i===0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 3. Draw Foreground (The Result)
    // In Downsample: Large Dots representing extracted samples
    // In Upsample: The interpolated line
    
    const isDown = this.activeMode === 'DOWN';
    
    ctx.strokeStyle = isDown ? '#ff9f43' : '#00d2d3'; // Orange for samples, Cyan for interp
    ctx.fillStyle = isDown ? '#ff9f43' : '#00d2d3';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10; // Glow effect
    ctx.shadowColor = ctx.strokeStyle;

    if (isDown) {
        // Draw Stem/Dots for samples
        for(let i=0; i<tFg.length; i++) {
            if(tFg[i] > zoomT) break;
            const x = tFg[i] * scX;
            const y = midY - yFg[i] * scY;
            
            // Stem
            ctx.beginPath();
            ctx.moveTo(x, midY);
            ctx.lineTo(x, y);
            ctx.stroke();

            // Dot
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI*2);
            ctx.fill();
        }
    } else {
        // Upsampling Mode
        // Draw the reconstructed line
        ctx.beginPath();
        for(let i=0; i<tFg.length; i++) {
            if(tFg[i] > zoomT) break;
            const x = tFg[i] * scX;
            const y = midY - yFg[i] * scY;
            if(i===0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Highlight the zeros if NO FILTER
        if(!this.useFilter) {
             ctx.fillStyle = '#ff6b6b';
             for(let i=0; i<tFg.length; i++) {
                if(tFg[i] > zoomT) break;
                // Highlight inserted zeros
                if (Math.abs(yFg[i]) < 0.001) {
                    const x = tFg[i] * scX;
                    ctx.beginPath();
                    ctx.arc(x, midY, 2, 0, Math.PI*2);
                    ctx.fill();
                }
             }
        }
    }
    
    ctx.shadowBlur = 0; // Reset
  }

  drawSpectrumAnalyzer(yIn: Float32Array, fsIn: number, yOut: Float32Array, fsOut: number) {
    const w = this.ctxFreq.canvas.width;
    const h = this.ctxFreq.canvas.height;
    const ctx = this.ctxFreq;

    ctx.fillStyle = '#001a1a';
    ctx.fillRect(0, 0, w, h);
    this.drawGrid(ctx, w, h, true);

    const fftIn = this.fftMagDb(yIn);
    const fftOut = this.fftMagDb(yOut);

    // Max frequency to display: always base it on the higher fs to show aliasing/imaging
    const dispFs = Math.max(fsIn, fsOut);
    const nyquist = dispFs / 2;

    // Draw Input Spectrum (Faint)
    this.plotFFT(ctx, fftIn, fsIn, nyquist, 'rgba(255, 255, 255, 0.15)', false);

    // Draw Output Spectrum (Bright)
    const col = this.activeMode === 'DOWN' ? '#ff9f43' : '#00d2d3';
    this.plotFFT(ctx, fftOut, fsOut, nyquist, col, true);
  }

  plotFFT(ctx: CanvasRenderingContext2D, fft: Float32Array, fs: number, maxF: number, col: string, glow: boolean) {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const N = fft.length;
    const binHz = (fs/2) / N;

    const scX = w / maxF;
    const scY = (h - 20) / 100; // 100dB range

    ctx.strokeStyle = col;
    ctx.lineWidth = 2;
    if(glow) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = col;
    }

    ctx.beginPath();
    for(let i=0; i<N; i++) {
        const f = i * binHz;
        if (f > maxF) break;
        
        const db = Math.max(-100, fft[i]);
        const x = f * scX;
        const y = h - 20 - (db + 100) * scY;
        
        if(i===0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number, isFreq=false) {
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Vertical Lines
    const numV = 10;
    for(let i=1; i<numV; i++) {
        const x = (w/numV)*i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
    }
    
    // Horizontal Lines
    const numH = 8;
    for(let i=1; i<numH; i++) {
        const y = (h/numH)*i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
    }
    
    // Labels
    ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
    ctx.font = '10px monospace';
    if(isFreq) {
        ctx.fillText('0 Hz', 5, h-5);
        ctx.fillText('Nyquist', w-40, h-5);
    } else {
        ctx.fillText('0 ms', 5, h-5);
        ctx.fillText('20 ms', w-40, h-5);
    }
  }


  private firDesign(N: number, fc: number): Float32Array {
    const h = new Float32Array(N);
    const center = (N - 1) / 2;
    for (let n = 0; n < N; n++) {
      const k = n - center;
      const val =
        k === 0 ? 2 * fc : Math.sin(2 * Math.PI * fc * k) / (Math.PI * k);
      const win = 0.54 - 0.46 * Math.cos((2 * Math.PI * n) / (N - 1));
      h[n] = val * win;
    }
    return h;
  }

  private convolve(u: Float32Array, v: Float32Array): Float32Array {
    const n = u.length,
      m = v.length;
    const res = new Float32Array(n + m - 1);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        res[i + j] += u[i] * v[j];
      }
    }
    return res;
  }

  private fftMagDb(sig: Float32Array): Float32Array {
    const n = sig.length;
    const p2 = Math.pow(2, Math.floor(Math.log2(n)));
    const real = new Float64Array(p2);
    const imag = new Float64Array(p2);
    for (let i = 0; i < p2; i++) {
      const win = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (p2 - 1)));
      real[i] = sig[i] * win;
    }

    this.transform(real, imag);

    const half = p2 / 2;
    const db = new Float32Array(half);
    for (let i = 0; i < half; i++) {
      const mag = Math.sqrt(real[i] ** 2 + imag[i] ** 2);
      db[i] = 20 * Math.log10(mag + 1e-9);
    }
    return db;
  }

  private transform(real: Float64Array, imag: Float64Array) {
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
      const ang = (-2 * Math.PI) / len;
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

  private initCanvases() {
    this.initSingle(this.timeCanvasRef, (c) => (this.ctxTime = c));
    this.initSingle(this.freqCanvasRef, (c) => (this.ctxFreq = c));
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
}