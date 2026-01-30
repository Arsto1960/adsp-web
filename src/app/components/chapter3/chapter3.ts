import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MathJaxDirective } from '../mathjax.directive';
import { Id3 } from '../../subtopics/chap3/id3/id3';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chapter3',
  imports: [MatCardModule, FormsModule, MatCardModule, MatRadioModule, MatButtonModule, MathJaxDirective , Id3 , CommonModule],
  templateUrl: './chapter3.html',
  styleUrl: './chapter3.css',
})
export class Chapter3 {

 questions = [
  {
    text: '1️⃣ Why do triangular and sawtooth waves have a uniform amplitude PDF?',
    options: [
      'Because their amplitudes follow a Gaussian distribution',
      'Because all amplitude values are visited for equal time within each period',
      'Because they have constant RMS power',
      'Because their frequency components are uniformly spaced'
    ],
    correctAnswer: 'Because all amplitude values are visited for equal time within each period',
    selectedAnswer: null,
    isSubmitted: false,
    tip: '💡 Their slopes are constant, so they pass through each amplitude for equal duration → uniform PDF.'
  },

  {
    text: '2️⃣ What is the theoretical variance (mean-square value) of a full-range uniform signal of amplitude A?',
    options: ['A²/8', 'A²/12', 'A²/4', 'A²/6'],
    correctAnswer: 'A²/12',
    selectedAnswer: null,
    isSubmitted: false,
    tip: '💡 For uniform distribution in [−A/2, A/2], E[x²] = A²/12.'
  },

  {
    text: '3️⃣ If a 4-bit uniform quantizer (16 levels) uses full range ±1 V, what is the step size Δ?',
    options: ['0.125 V', '0.25 V', '0.5 V', '1 V'],
    correctAnswer: '0.125 V',
    selectedAnswer: null,
    isSubmitted: false,
    tip: '💡 Δ = (Vmax − Vmin)/L = 2/16 = 0.125 V.'
  },

  {
    text: '4️⃣ What happens to the SNR if the signal uses only half the full-scale amplitude range?',
    options: ['It drops by 6.02 dB', 'It doubles', 'It increases by 3 dB', 'It stays constant'],
    correctAnswer: 'It drops by 6.02 dB',
    selectedAnswer: null,
    isSubmitted: false,
    tip: '💡 Backing off amplitude by factor 2 → SNR penalty = −20log10(2) ≈ −6.02 dB.'
  },

  {
    text: '5️⃣ Which waveform has a non-uniform amplitude PDF and why?',
    options: [
      'Triangular',
      'Sawtooth',
      'Sine wave – because it spends more time near ±A than 0',
      'Square wave – because it only takes two values'
    ],
    correctAnswer: 'Sine wave – because it spends more time near ±A than 0',
    selectedAnswer: null,
    isSubmitted: false,
    tip: '💡 Sine waves have slower slope near peaks → amplitude clustering near ±A.'
  },

  {
    text: '6️⃣ For a uniform quantizer, what is the expected quantization noise power?',
    options: ['Δ²/8', 'Δ²/12', 'Δ²/6', 'Δ²/2'],
    correctAnswer: 'Δ²/12',
    selectedAnswer: null,
    isSubmitted: false,
    tip: '💡 Quantization error uniformly distributed over [−Δ/2, Δ/2] → variance = Δ²/12.'
  },

  {
    text: '7️⃣ Each additional quantization bit improves SNR by roughly …',
    options: ['3 dB', '6 dB', '9 dB', '12 dB'],
    correctAnswer: '6 dB',
    selectedAnswer: null,
    isSubmitted: false,
    tip: '💡 SNR(dB) ≈ 6.02N + 1.76 → each bit ≈ +6 dB.'
  },

  {
    text: '8️⃣ In the histogram of quantization error, why is the distribution nearly uniform when N is large?',
    options: [
      'Because quantization error is correlated with signal',
      'Because of clipping at full-scale',
      'Because high resolution makes the error independent of x and equally likely between ±Δ/2',
      'Because of mid-tread quantizer bias'
    ],
    correctAnswer: 'Because high resolution makes the error independent of x and equally likely between ±Δ/2',
    selectedAnswer: null,
    isSubmitted: false,
    tip: '💡 As Δ gets small, error behaves like random uniform noise.'
  }
];

  submitAnswer(question: any) {
    question.isSubmitted = true;
  }


  tryAgain(question: any) {
    question.isSubmitted = false;
    question.selectedAnswer = null;
  }


  chapter3example1 = `
# Triangular and sawtooth → uniform PDF evidence
import numpy as np, matplotlib.pyplot as plt
from scipy.signal import sawtooth

n = 40000
t = np.linspace(0, 1, n, endpoint=False)
tri = sawtooth(2*np.pi*5*t, width=0.5)   # width=0.5 → triangle
saw = sawtooth(2*np.pi*5*t)              # sawtooth
fig, axs = plt.subplots(2,2, figsize=(9,6))
axs[0,0].plot(t[:1000], tri[:1000]); axs[0,0].set_title("Triangular (time)")
axs[0,1].hist(tri, bins=80, density=True, color='gray'); axs[0,1].set_title("Triangular histogram ≈ uniform")
axs[1,0].plot(t[:1000], saw[:1000]); axs[1,0].set_title("Sawtooth (time)")
axs[1,1].hist(saw, bins=80, density=True, color='gray'); axs[1,1].set_title("Sawtooth histogram ≈ uniform")
plt.tight_layout(); plt.show(); 

import io, base64
buf = io.BytesIO()
plt.savefig(buf, format='png')
buf.seek(0)
img_base64 = base64.b64encode(buf.read()).decode('utf-8')
buf.close()
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")

`;

  chapter3example2 = `
# Backoff penalty: SNR ≈ 6.02 N − 20 log10(c)
import numpy as np, matplotlib.pyplot as plt, io, base64

# Use non-GUI backend for Pyodide
import matplotlib
matplotlib.use("Agg")

Ns = np.arange(4, 17)
cs = [1, 2, 3.1623, 10]  # 0, 6, 10, 20 dB backoff
for c in cs:
    plt.plot(Ns, 6.02*Ns - 20*np.log10(c), 'o-', label=f"c={c}  (−{20*np.log10(c):.1f} dB)")
plt.xlabel("Bits N")
plt.ylabel("SNR (dB)")
plt.title("SNR penalty vs backoff c")
plt.grid(True)
plt.legend()

# --- Capture plot as Base64 image for Angular display ---
buf = io.BytesIO()
plt.savefig(buf, format='png', bbox_inches='tight')
buf.seek(0)
b64 = base64.b64encode(buf.read()).decode('utf-8')
print("__IMAGE_START__" + b64 + "__IMAGE_END__")

plt.close()


`;



}
