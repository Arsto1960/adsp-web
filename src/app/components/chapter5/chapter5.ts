import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MathJaxDirective } from '../mathjax.directive';



@Component({
  selector: 'app-chapter5',
  imports: [MatCardModule, FormsModule, MatCardModule, MatRadioModule, MatButtonModule, MathJaxDirective],
  templateUrl: './chapter5.html',
  styleUrl: './chapter5.css',
})
export class Chapter5 {
 questions = [
  {
    text: 'Vector quantization extends scalar quantization by:',
    options: [
      'A) Quantizing multi-dimensional vectors instead of single samples',
      'B) Quantizing frequency components',
      'C) Reducing bit depth of a single value',
      'D) Applying uniform quantization to each component independently'
    ],
    correctAnswer: 'A) Quantizing multi-dimensional vectors instead of single samples',
    selectedAnswer: null,
    isSubmitted: false,
    tip: 'VQ treats correlated samples jointly to exploit inter-component redundancy.'
  },

  {
    text: 'A codebook in VQ is:',
    options: [
      'A) A finite set of representative vectors (codewords) used for encoding',
      'B) The histogram of input vectors',
      'C) The covariance matrix of training data',
      'D) A lookup table of quantization errors'
    ],
    correctAnswer: 'A) A finite set of representative vectors (codewords) used for encoding',
    selectedAnswer: null,
    isSubmitted: false,
    tip: 'Each input vector is replaced by its nearest codeword.'
  },

  {
    text: 'The Voronoi region of a codeword consists of:',
    options: [
      'A) All vectors closer to that codeword than to any other',
      'B) The vectors with maximum amplitude',
      'C) Points lying on a straight line through the centroid',
      'D) All training vectors assigned to different codewords'
    ],
    correctAnswer: 'A) All vectors closer to that codeword than to any other',
    selectedAnswer: null,
    isSubmitted: false,
    tip: 'Space is partitioned into Voronoi cells representing decision regions.'
  },

  {
    text: 'The distortion criterion minimized by the LBG algorithm is:',
    options: [
      'A) Average squared Euclidean distance between input vectors and their assigned codewords',
      'B) Absolute difference between amplitudes',
      'C) Sum of variances across clusters',
      'D) Entropy of the codebook'
    ],
    correctAnswer: 'A) Average squared Euclidean distance between input vectors and their assigned codewords',
    selectedAnswer: null,
    isSubmitted: false,
    tip: 'LBG minimizes mean squared quantization error.'
  },

  {
    text: 'The two iterative steps of the LBG algorithm correspond to:',
    options: [
      'A) Nearest-neighbor assignment and centroid update',
      'B) Sorting and thresholding',
      'C) Interpolation and decimation',
      'D) Error weighting and normalization'
    ],
    correctAnswer: 'A) Nearest-neighbor assignment and centroid update',
    selectedAnswer: null,
    isSubmitted: false,
    tip: 'These steps match the k-means algorithm.'
  },

  {
    text: 'The LBG algorithm stops when:',
    options: [
      'A) The relative change in average distortion between iterations is below a small threshold',
      'B) Codewords stop moving',
      'C) The number of clusters doubles',
      'D) Training data is exhausted'
    ],
    correctAnswer: 'A) The relative change in average distortion between iterations is below a small threshold',
    selectedAnswer: null,
    isSubmitted: false,
    tip: 'Convergence is based on negligible improvement in distortion.'
  },

  {
    text: 'The splitting method in LBG initialization is used to:',
    options: [
      'A) Gradually grow the codebook size by duplicating and slightly perturbing existing codewords',
      'B) Reduce computation by pruning codewords',
      'C) Add random noise to training data',
      'D) Normalize vector lengths'
    ],
    correctAnswer: 'A) Gradually grow the codebook size by duplicating and slightly perturbing existing codewords',
    selectedAnswer: null,
    isSubmitted: false,
    tip: 'Splitting helps build larger codebooks smoothly.'
  },

  {
    text: 'The Lloyd–Max quantizer can be seen as:',
    options: [
      'A) A 1-D special case of the LBG vector quantizer',
      'B) A time-domain implementation of LBG',
      'C) An entropy-coded version of VQ',
      'D) A transform quantizer'
    ],
    correctAnswer: 'A) A 1-D special case of the LBG vector quantizer',
    selectedAnswer: null,
    isSubmitted: false,
    tip: 'Both algorithms use centroid and nearest-neighbor iterations.'
  },

  {
    text: 'Increasing the codebook size N generally:',
    options: [
      'A) Decreases distortion but increases bit rate and memory cost',
      'B) Increases distortion',
      'C) Keeps rate constant',
      'D) Randomizes cluster assignments'
    ],
    correctAnswer: 'A) Decreases distortion but increases bit rate and memory cost',
    selectedAnswer: null,
    isSubmitted: false,
    tip: 'Larger codebooks give lower MSE but require more storage and bits.'
  },

  {
    text: 'In image compression, vector quantization operates on:',
    options: [
      'A) Blocks of pixels treated as input vectors',
      'B) Individual pixel intensities',
      'C) Transform coefficients only',
      'D) Frequency magnitudes'
    ],
    correctAnswer: 'A) Blocks of pixels treated as input vectors',
    selectedAnswer: null,
    isSubmitted: false,
    tip: 'Grouping pixels captures spatial correlation.'
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
