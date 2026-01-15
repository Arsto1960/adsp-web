import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MathJaxDirective } from '../mathjax.directive';

@Component({
  selector: 'app-chapter4',
  imports: [MatCardModule, FormsModule, MatCardModule, MatRadioModule, MatButtonModule, MathJaxDirective],
  templateUrl: './chapter4.html',
  styleUrl: './chapter4.css',
})
export class Chapter4 {
  questions = [
    {
      text: '1️⃣ The main goal of the Lloyd–Max quantizer is to:',
      options: [
        'A) Minimize the mean-squared quantization error for a given input PDF',
        'B) Maximize signal dynamic range',
        'C) Maintain uniform step size',
        'D) Minimize number of quantization levels'
      ],
      correctAnswer: 'A) Minimize the mean-squared quantization error for a given input PDF',
      selectedAnswer: null,
      isSubmitted: false,
      tip: 'Optimal non-uniform quantizer tuned to the input distribution'
    },

    {
      text: '2️⃣ The two optimality conditions in the Lloyd–Max algorithm are:',
      options: [
        'A) Nearest-neighbor (boundary midpoint) and centroid (mean within cell)',
        'B) Equal step and equal probability',
        'C) Logarithmic and exponential scaling',
        'D) Linear prediction and reconstruction'
      ],
      correctAnswer: 'A) Nearest-neighbor (boundary midpoint) and centroid (mean within cell)',
      selectedAnswer: null,
      isSubmitted: false,
      tip: 'Boundaries at midpoints; levels at centroids'
    },

    {
      text: '3️⃣ The nearest-neighbor rule defines each decision boundary as:',
      options: [
        'A) (y_i + y_{i+1}) / 2',
        'B) y_i - y_{i+1}',
        'C) sqrt(y_i * y_{i+1})',
        'D) y_i + y_{i+1}'
      ],
      correctAnswer: 'A) (y_i + y_{i+1}) / 2',
      selectedAnswer: null,
      isSubmitted: false,
      tip: 'Boundary is midpoint between adjacent levels'
    },

    {
      text: '4️⃣ The centroid condition determines reconstruction levels as:',
      options: [
        'A) Mean of x within the interval divided by total probability in the interval',
        'B) (b_i + b_{i+1}) / 2',
        'C) Value minimizing expected squared error',
        'D) Equal to the boundary'
      ],
      correctAnswer: 'A) Mean of x within the interval divided by total probability in the interval',
      selectedAnswer: null,
      isSubmitted: false,
      tip: 'Level equals the mean of samples in its decision region'
    },

    {
      text: '5️⃣ Compared to a uniform quantizer, a Lloyd–Max quantizer achieves:',
      options: [
        'A) Lower MSE and slightly higher SNR for the same number of bits',
        'B) Identical MSE',
        'C) Larger steps in high-density regions',
        'D) Lower resolution at the center'
      ],
      correctAnswer: 'A) Lower MSE and slightly higher SNR for the same number of bits',
      selectedAnswer: null,
      isSubmitted: false,
      tip: 'More precision where the signal occurs most frequently'
    },

    {
      text: '6️⃣ For a zero-mean Gaussian input, Lloyd–Max levels are:',
      options: [
        'A) Denser near zero and sparser toward large amplitudes',
        'B) Uniformly spaced',
        'C) Randomly distributed',
        'D) Densest near the largest amplitudes'
      ],
      correctAnswer: 'A) Denser near zero and sparser toward large amplitudes',
      selectedAnswer: null,
      isSubmitted: false,
      tip: 'Gaussian distribution peaks at zero'
    },

    {
      text: '7️⃣ The Lloyd–Max algorithm converges when:',
      options: [
        'A) Changes in boundaries and levels become negligible',
        'B) SNR stops increasing',
        'C) Histogram becomes flat',
        'D) Step sizes become equal'
      ],
      correctAnswer: 'A) Changes in boundaries and levels become negligible',
      selectedAnswer: null,
      isSubmitted: false,
      tip: 'Indicates a minimum-MSE stationary point'
    },

    {
      text: '8️⃣ The Lloyd–Max quantizer is a special case of:',
      options: [
        'A) The Generalized Lloyd Algorithm (GLA or LBG)',
        'B) Mu-law companding',
        'C) DPCM',
        'D) K-means clustering on bit-planes'
      ],
      correctAnswer: 'A) The Generalized Lloyd Algorithm (GLA or LBG)',
      selectedAnswer: null,
      isSubmitted: false,
      tip: 'It is the 1-D scalar case of LBG vector quantization'
    },

    {
      text: '9️⃣ If the source PDF is uniform, the Lloyd–Max solution becomes:',
      options: [
        'A) Identical to the uniform quantizer',
        'B) Non-uniform with exponential spacing',
        'C) A companding law',
        'D) Undefined'
      ],
      correctAnswer: 'A) Identical to the uniform quantizer',
      selectedAnswer: null,
      isSubmitted: false,
      tip: 'Uniform distribution leads to uniform optimal spacing'
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
