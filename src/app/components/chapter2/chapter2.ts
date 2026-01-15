import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MathJaxDirective } from '../mathjax.directive';


@Component({
  selector: 'app-chapter2',
  imports: [MatCardModule, FormsModule, MatCardModule, MatSidenavModule, MatRadioModule, MatButtonModule, MathJaxDirective],
  templateUrl: './chapter2.html',
  styleUrl: './chapter2.css',
})
export class Chapter2 {
showFiller = false;

  questions = [
    {
      text: '1️⃣ How many levels does an 8-bit quantizer have?',
      options: ['16', '128', '256', '512'],
      correctAnswer: '256',
      selectedAnswer: null,
      isSubmitted: false,
      tip: '💡 Tip: L = 2^N = 256 for N = 8.'
    },
    {
      text: '2️⃣ For Δ = 0.05 V, what is the mean-square quantization error σₑ²?',
      options: ['0.05 V', '0.0021 V²', '0.000208 V²', '0.25 V²'],
      correctAnswer: '0.000208 V²',
      selectedAnswer: null,
      isSubmitted: false,
      tip: '💡 Use σₑ² = Δ² / 12 = (0.05)² / 12.'
    },
    {
      text: '3️⃣ Why is a mid-tread quantizer preferred for signals centered around zero?',
      options: [
        'It gives more resolution near the maximum value.',
        'It avoids a discontinuity at zero.',
        'It requires fewer bits.',
        'It’s faster to compute.'
      ],
      correctAnswer: 'It avoids a discontinuity at zero.',
      selectedAnswer: null,
      isSubmitted: false,
      tip: '💡 Mid-tread includes zero as one reconstruction level, minimizing distortion around 0 V.'
    },
    {
      text: '4️⃣ Each extra bit increases the theoretical SNR by about…',
      options: ['3 dB', '6 dB', '9 dB', '12 dB'],
      correctAnswer: '6 dB',
      selectedAnswer: null,
      isSubmitted: false,
      tip: '💡 SNR₍dB₎ ≈ 6.02 N + 1.76'
    }
  ];


  submitAnswer(question: any) {
    question.isSubmitted = true;
  }


  tryAgain(question: any) {
    question.isSubmitted = false;
    question.selectedAnswer = null;
  }

  // python exercises

  chapter2example1 = `
# Assume A/D converter input range is -1 V to +1 V
# and we only have 4-bit accuracy.

stepsize = (1.0 - (-1.0)) / (2**4)   # Δ = full_range / number_of_levels
print("Quantization step size Δ =", stepsize)

# Let's say the input sample is x = 0.2 V:
x = 0.2

# Encoder side:
index = round(x / stepsize)
print("Quantization index =", index)

# Transmitter would send this index as 4 bits

# Decoder side:
reconstr = stepsize * index
print("Reconstructed value =", reconstr, "V")

# Quantization error:
error = reconstr - x
print("Quantization error =", error, "V")
`;


  chapter2example2 = `
import numpy as np

# Quantization step size (Δ)
q = 0.1

# Some test samples
x = np.array([0.012, -1.234, 2.456, -3.789])

# --- Mid-Tread Quantizer ---
# Encoder: round to nearest multiple of q
index_mt = np.round(x / q)

# Decoder: reconstruct by multiplying back
recon_mt = index_mt * q

print("Mid-Tread indices:       ", index_mt)
print("Mid-Tread reconstruction:", recon_mt)

# --- Mid-Rise Quantizer ---
# Encoder: floor to lower boundary of the interval
index_mr = np.floor(x / q)

# Decoder: shift by q/2 (because mid-rise levels sit between the steps)
recon_mr = index_mr * q + q/2

print("Mid-Rise indices:        ", index_mr)
print("Mid-Rise reconstruction: ", recon_mr)

`;


}
