import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Pycodechap1 } from "../python-code/pycodechap1/pycodechap1";
import { MathJaxDirective } from '../mathjax.directive';




@Component({
  selector: 'app-chapter11',
  imports: [MatCardModule, FormsModule, MatCardModule, MatRadioModule, MatButtonModule, MathJaxDirective],
  templateUrl: './chapter11.html',
  styleUrl: './chapter11.css',
})
export class Chapter11 {

   questions = [
  {
    text: '1️⃣ What is the main purpose of the Hilbert Transform?',
    options: [
      'A) To amplify low-frequency signals',
      'B) To remove positive-frequency components',
      'C) To create an analytic signal with a 90° phase shift',
      'D) To delay the signal in time'
    ],
    correctAnswer: 'C) To create an analytic signal with a 90° phase shift',
    selectedAnswer: null,
    isSubmitted: false,
    tip: 'ADSP book'
  },
  {
    text: '2️⃣ In the ideal Hilbert Transform filter, hH(n) is zero for which values of n?',
    options: ['A) Odd', 'B) Even', 'C) Prime', 'D) Negative'],
    correctAnswer: 'B) Even',
    selectedAnswer: null,
    isSubmitted: false,
    tip: 'ADSP book'
  },
  {
    text: '3️⃣ The frequency response of a Hilbert Transform introduces what phase shift for positive frequencies?',
    options: ['A) 180°', 'B) 45°', 'C) 90°', 'D) –90°'],
    correctAnswer: 'C) 90°',
    selectedAnswer: null,
    isSubmitted: false,
    tip: 'ADSP book'
  },
  {
    text: '4️⃣ Which of the following describes an analytic signal?',
    options: [
      'A) A signal with both positive and negative frequency components',
      'B) A signal composed only of real values',
      'C) A complex signal with only positive-frequency components',
      'D) A signal delayed by π radians'
    ],
    correctAnswer: 'C) A complex signal with only positive-frequency components',
    selectedAnswer: null,
    isSubmitted: false,
    tip: 'ADSP book'
  },
  {
    text: '5️⃣ In Python, which module is commonly used to design and analyze Hilbert Transform filters?',
    options: ['A) math', 'B) os', 'C) scipy.signal', 'D) time'],
    correctAnswer: 'C) scipy.signal',
    selectedAnswer: null,
    isSubmitted: false,
    tip: 'ADSP book'
  },
  {
    text: '6️⃣ Which of the following statements about Hilbert Transform filters is true?',
    options: [
      'A) They are linear-phase filters.',
      'B) They introduce a ±90° phase shift without changing magnitude.',
      'C) They eliminate all frequencies above π/2.',
      'D) They amplify the DC component.'
    ],
    correctAnswer: 'B) They introduce a ±90° phase shift without changing magnitude.',
    selectedAnswer: null,
    isSubmitted: false,
    tip: 'ADSP book'
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
