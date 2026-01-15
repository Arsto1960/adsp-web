import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MathJaxDirective } from '../mathjax.directive';

@Component({
  selector: 'app-chapter8',
  imports: [MatCardModule, FormsModule, MatCardModule, MatRadioModule, MatButtonModule, MathJaxDirective], templateUrl: './chapter8.html',
  styleUrl: './chapter8.css',
})
export class Chapter8 {

 questions = [
  {
    text: '1️⃣ The Noble Identity for downsampling is expressed as:',
    options: [
      'A) ↓N ∘ H(z) = H(z) ∘ ↓N',
      'B) ↓N ∘ H(z) = H(z^N) ∘ ↓N',
      'C) ↑N ∘ H(z) = H(z^N) ∘ ↑N',
      'D) H(z) = H(z^N)'
    ],
    correctAnswer: 'B) ↓N ∘ H(z) = H(z^N) ∘ ↓N',
    selectedAnswer: null,
    isSubmitted: false,
    tip: 'Noble identity for downsampling'
  },

  {
    text: '2️⃣ In Noble Identity notation, the symbol ↓N means:',
    options: [
      'A) Discard every N samples and keep the rest',
      'B) Keeping only every N-th sample',
      'C) Inserting N−1 zeros between samples',
      'D) Reducing signal amplitude by a factor of N'
    ],
    correctAnswer: 'B) Keeping only every N-th sample',
    selectedAnswer: null,
    isSubmitted: false,
    tip: 'Definition of downsampling'
  },

  {
    text: '3️⃣ The polyphase component Hi(z) corresponds to the z-transform of:',
    options: [
      'A) h(nN + i)',
      'B) h(n - iN)',
      'C) h(n + N)',
      'D) h(n / i + N)'
    ],
    correctAnswer: 'A) h(nN + i)',
    selectedAnswer: null,
    isSubmitted: false,
    tip: 'Definition of polyphase components'
  },

  {
    text: '4️⃣ In a 2-branch polyphase decomposition, the filter can be expressed as:',
    options: [
      'A) H(z) = H0(z) + H1(z)',
      'B) H(z) = H0(z^2) + z^{-1} H1(z^2)',
      'C) H(z) = z H0(z) + z H1(z)',
      'D) H(z) = z^2 H0(z) + H1(z)'
    ],
    correctAnswer: 'B) H(z) = H0(z^2) + z^{-1} H1(z^2)',
    selectedAnswer: null,
    isSubmitted: false,
    tip: 'Standard 2-branch polyphase form'
  },

  {
    text: '5️⃣ Polyphase processing is useful because filters can run at:',
    options: [
      'A) Higher sampling rate',
      'B) Lower sampling rate',
      'C) Variable random rate',
      'D) Complex domain only'
    ],
    correctAnswer: 'B) Lower sampling rate',
    selectedAnswer: null,
    isSubmitted: false,
    tip: 'Efficiency benefit of polyphase filtering'
  },

  {
    text: '6️⃣ The identity for upsampling is:',
    options: [
      'A) ↑N ∘ H(z) = H(z^N) ∘ ↑N',
      'B) ↑N ∘ H(z) = H(z) ∘ ↑N',
      'C) ↑N ∘ H(z) = H(z^{-N}) ∘ ↑N',
      'D) H(z) = H(z^{-N})'
    ],
    correctAnswer: 'A) ↑N ∘ H(z) = H(z^N) ∘ ↑N',
    selectedAnswer: null,
    isSubmitted: false,
    tip: 'Noble identity for upsampling'
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
