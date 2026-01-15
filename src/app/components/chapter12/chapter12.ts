import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Pycodechap1 } from "../python-code/pycodechap1/pycodechap1";
import { MathJaxDirective } from '../mathjax.directive';


@Component({
  selector: 'app-chapter12',
  imports: [MatCardModule, MathJaxDirective, FormsModule, MatCardModule, MatRadioModule, MatButtonModule],
  templateUrl: './chapter12.html',
  styleUrl: './chapter12.css',
})
export class Chapter12 {

  questions = [
    {
      text: '1️⃣ Which of the following best describes the primary goal of a Wiener Filter?',
      options: [
        'A) To maximize the signal-to-noise ratio (SNR)',
        'B) To approximate the original signal by minimizing mean squared error',
        'C) To estimate the noise power spectrum',
        'D) To detect deterministic signals in noise'
      ],
      correctAnswer: 'B) To approximate the original signal by minimizing mean squared error',
      selectedAnswer: null,
      isSubmitted: false,
      tip: 'Wiener filtering concept'
    },

    {
      text: '2️⃣ In the matrix formulation of the Wiener filter, which expression gives the optimal coefficients?',
      options: [
        'A) h = A^{-1} x',
        'B) h = A^T A x',
        'C) h = (A^T A)^{-1} A^T x',
        'D) h = (A A^T)^{-1} A x'
      ],
      correctAnswer: 'C) h = (A^T A)^{-1} A^T x',
      selectedAnswer: null,
      isSubmitted: false,
      tip: 'Least-squares / pseudo-inverse'
    },

    {
      text: '3️⃣ What is the impulse response of a matched filter relative to the signal it detects?',
      options: [
        'A) A delayed version of the signal',
        'B) The complex conjugate of the signal',
        'C) A time-reversed version of the signal',
        'D) A low-pass filtered version of the signal'
      ],
      correctAnswer: 'C) A time-reversed version of the signal',
      selectedAnswer: null,
      isSubmitted: false,
      tip: 'Matched filter property'
    },

    {
      text: '4️⃣ In prediction, the Wiener filter is used to estimate the next signal sample based on:',
      options: [
        'A) Present and future samples',
        'B) Only the most recent sample',
        'C) Past samples of the signal',
        'D) The noise model'
      ],
      correctAnswer: 'C) Past samples of the signal',
      selectedAnswer: null,
      isSubmitted: false,
      tip: 'Wiener prediction'
    },

    {
      text: '5️⃣ In LPC speech compression, the signal s(n) is approximated as:',
      options: [
        'A) s(n) = sum of a_k * s(n - k) + e(n)',
        'B) s(n) = e(n) + a0 * s(n)',
        'C) s(n) = sum of b_k * n(k)',
        'D) s(n) = a1 * s(n - 1)'
      ],
      correctAnswer: 'A) s(n) = sum of a_k * s(n - k) + e(n)',
      selectedAnswer: null,
      isSubmitted: false,
      tip: 'LPC model'
    },

    {
      text: '6️⃣ Why does a matched filter maximize the output SNR?',
      options: [
        'A) It minimizes noise power across all frequencies',
        'B) It aligns the filter response with the signal’s energy distribution',
        'C) It whitens the noise spectrum',
        'D) It averages over multiple signal periods'
      ],
      correctAnswer: 'B) It aligns the filter response with the signal’s energy distribution',
      selectedAnswer: null,
      isSubmitted: false,
      tip: 'Matched filter SNR'
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
