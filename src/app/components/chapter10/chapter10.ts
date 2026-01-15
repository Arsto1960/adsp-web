import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Pycodechap1 } from "../python-code/pycodechap1/pycodechap1";
import { MathJaxDirective } from '../mathjax.directive';



@Component({
  selector: 'app-chapter10',
  imports: [MatCardModule, FormsModule, MatCardModule, MatRadioModule, MatButtonModule, MathJaxDirective],
  templateUrl: './chapter10.html',
  styleUrl: './chapter10.css',
})
export class Chapter10 {
  
  questions = [
    {
      text: '1️⃣ Which of the following statements about minimum-phase filters is TRUE?',
      options: [
        'Their poles and zeros lie outside the unit circle.',
        'They have the highest possible group delay.',
        'Their energy is concentrated toward the end of the impulse response.',
        'They are causal, stable, and have the minimum possible group delay for a given magnitude response.'
      ],
      correctAnswer: 'They are causal, stable, and have the minimum possible group delay for a given magnitude response.',
      selectedAnswer: null,
      isSubmitted: false,
      tip: '💡 Minimum-phase filters achieve the lowest group delay among all filters with the same magnitude response.'
    },

    {
      text: '2️⃣ What happens to zeros outside the unit circle when converting a non-minimum phase filter to a minimum-phase filter?',
      options: [
        'They are discarded.',
        'They are reflected inside the unit circle.',
        'They are reflected inside the unit circle.',
        'They are moved to the origin.'
      ],
      correctAnswer: 'They are reflected inside the unit circle.',
      selectedAnswer: null,
      isSubmitted: false,
      tip: '💡 Minimum-phase conversion reflects zeros outside the unit circle to their reciprocal locations inside.'
    },

    {
      text: '3️⃣ Minimum-phase filters are unique for:',
      options: [
        'A given phase response.',
        'A given magnitude response.',
        'A given frequency domain representation.',
        'None of the above.'
      ],
      correctAnswer: 'A given magnitude response.',
      selectedAnswer: null,
      isSubmitted: false,
      tip: '💡 For any fixed magnitude response, only one minimum-phase system exists.'
    },

    {
      text: '4️⃣ What is the purpose of the all-pass component in filter decomposition?',
      options: [
        'To change the magnitude response only.',
        'To alter the phase without affecting the magnitude.',
        'To reduce computation.',
        'To make the system non-causal.'
      ],
      correctAnswer: 'To alter the phase without affecting the magnitude.',
      selectedAnswer: null,
      isSubmitted: false,
      tip: '💡 All-pass filters modify phase while keeping the magnitude response flat.'
    },

    {
      text: '5️⃣ Which Python library provides a function to generate minimum-phase filters?',
      options: ['NumPy', 'Matplotlib', 'SciPy', 'TensorFlow'],
      correctAnswer: 'SciPy',
      selectedAnswer: null,
      isSubmitted: false,
      tip: '💡 SciPy’s `signal.minimum_phase()` performs minimum-phase reconstruction.'
    },

    {
      text: '6️⃣ Why are minimum-phase filters preferred in speech and audio applications?',
      options: [
        'They are easier to implement.',
        'They offer low group delay and maintain signal intelligibility.',
        'They have linear phase.',
        'They eliminate distortion completely.'
      ],
      correctAnswer: 'They offer low group delay and maintain signal intelligibility.',
      selectedAnswer: null,
      isSubmitted: false,
      tip: '💡 Minimum group delay prevents smeared transients and improves clarity in speech/audio.'
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
