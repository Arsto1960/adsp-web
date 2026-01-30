
import { ChangeDetectionStrategy, Component , signal} from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';  
import { MathJaxDirective } from '../mathjax.directive';




@Component({
  selector: 'app-chapter6',
  imports: [MatCardModule, FormsModule, MatCardModule, MatRadioModule, MatButtonModule, MathJaxDirective],
  templateUrl: './chapter6.html',
  styleUrl: './chapter6.css',
})
export class Chapter6 {

 questions = [
  {
    text: '1️⃣ Downsampling by M without prefiltering causes…',
    options: [
      'Spectral compression',
      'Aliasing (spectral overlap)',
      'Imaging (spectral replication at multiples of 2π/L)',
      'Time shift only'
    ],
    correctAnswer: 'Aliasing (spectral overlap)',
    selectedAnswer: null,
    isSubmitted: false,
    tip: 'Decimation folds spectra unless content is confined to [0, π/M].'
  },

  {
    text: '2️⃣ For decimate-by-M, a safe low-pass cutoff (normalized) is approximately:',
    options: [
      'π',
      'π/2',
      'π/M (often ×0.9 margin)',
      'π M'
    ],
    correctAnswer: 'π/M (often ×0.9 margin)',
    selectedAnswer: null,
    isSubmitted: false,
    tip: 'Keep only baseband that won’t fold after the M-to-1 mapping.'
  },

  {
    text: '3️⃣ Upsampling by L (zero-insertion) primarily introduces…',
    options: [
      'Spectral images repeated every 2π/L',
      'Aliasing',
      'Time dilation without spectral change',
      'Phase unwrapping'
    ],
    correctAnswer: 'Spectral images repeated every 2π/L',
    selectedAnswer: null,
    isSubmitted: false,
    tip: 'Spectrum replicates; images must be low-passed to remove them.'
  },

  {
    text: '4️⃣ In a rational resampler L/M, the conceptual order is:',
    options: [
      'Filter → upsample → downsample',
      'Upsample → downsample (no filter)',
      'Upsample by L → low-pass → downsample by M',
      'Downsample → low-pass → upsample'
    ],
    correctAnswer: 'Upsample by L → low-pass → downsample by M',
    selectedAnswer: null,
    isSubmitted: false,
    tip: 'Anti-imaging then anti-aliasing in a single LPF (polyphase).'
  },

  {
    text: '5️⃣ The best single function for high-quality L/M resampling in SciPy is:',
    options: [
      'decimate',
      'resample (FFT)',
      'resample_poly',
      'interp1d'
    ],
    correctAnswer: 'resample_poly',
    selectedAnswer: null,
    isSubmitted: false,
    tip: 'Polyphase FIR with proper filtering; efficient and artifact-resistant.'
  }
];

  submitAnswer(question: any) {
    question.isSubmitted = true;
  }

  
 tryAgain(question: any) {
    question.isSubmitted = false;
    question.selectedAnswer = null;
  }



}
