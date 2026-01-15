import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MathJaxDirective } from '../mathjax.directive';


@Component({
  selector: 'app-chapter7',
  imports: [MatCardModule, FormsModule, MatCardModule, MatRadioModule, MatButtonModule, MathJaxDirective],
  templateUrl: './chapter7.html',
  styleUrl: './chapter7.css',
})
export class Chapter7 {
  
  questions = [
    {
      text: '1️⃣ The system H(z) = 1 / (1 - 0.8 z⁻¹) is:',
      options: [
        'Unstable because the pole is at z=1.25',
        'Stable because the pole z=0.8 is inside the unit circle ✅',
        'All-pass',
        'FIR'
      ],
      correctAnswer: 'Stable because the pole z=0.8 is inside the unit circle ✅',
      selectedAnswer: null,
      isSubmitted: false,
      tip: '💡 Stability if all poles lie inside the unit circle (ROC includes the unit circle).'
    },
    {
      text: '2️⃣ For the FIR y(n)=∑ₘ₌₀ᴹ b(m) x(n−m), the transfer function is:',
      options: [
        'H(z)=∑ₘ₌₀ᴹ b(m) z⁻ᵐ ✅',
        'H(z)=1 / ∑ b(m) z⁻ᵐ',
        'H(z)=∏ b(m) z⁻ᵐ',
        'H(z)=∑ a(m) z⁻ᵐ'
      ],
      correctAnswer: 'H(z)=∑ₘ₌₀ᴹ b(m) z⁻ᵐ ✅',
      selectedAnswer: null,
      isSubmitted: false,
      tip: '💡 z-transform of the FIR filter taps equals H(z).'
    },
    {
      text: '3️⃣ The DTFT of H(z) is obtained by:',
      options: [
        'Evaluate H(z) on the unit circle z=e^{jΩ} ✅',
        'Set z=0',
        'Differentiate H(z)',
        'Replace z⁻¹ by n'
      ],
      correctAnswer: 'Evaluate H(z) on the unit circle z=e^{jΩ} ✅',
      selectedAnswer: null,
      isSubmitted: false,
      tip: '💡 H(e^{jΩ}) = H(z) evaluated at z=e^{jΩ}.'
    },
    {
      text: '4️⃣ Which statement is true?',
      options: [
        'A delay of d samples multiplies X(z) by z⁻ᵈ ✅',
        'A delay adds d to the numerator coefficients.',
        'A delay shifts poles outward by d.',
        'A delay makes the system non-causal.'
      ],
      correctAnswer: 'A delay of d samples multiplies X(z) by z⁻ᵈ ✅',
      selectedAnswer: null,
      isSubmitted: false,
      tip: '💡 Shift property of the z-transform.'
    },
    {
      text: '5️⃣ IIR transfer function for y(n)=x(n)+p·y(n−1) is:',
      options: [
        'H(z)=1 / (1 - p z⁻¹) ✅',
        'H(z)=1 - p z',
        'H(z)=1 + p z⁻¹',
        'H(z)=1 / (1 + p z)'
      ],
      correctAnswer: 'H(z)=1 / (1 - p z⁻¹) ✅',
      selectedAnswer: null,
      isSubmitted: false,
      tip: '💡 Derived directly from the z-transform of the difference equation.'
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
