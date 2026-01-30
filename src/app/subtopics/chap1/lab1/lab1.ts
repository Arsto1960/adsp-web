import { Component } from '@angular/core';
import { Pycodechap1 } from '../../../components/python-code/pycodechap1/pycodechap1';
import { MatCardModule } from '@angular/material/card';


import { MatButtonModule } from '@angular/material/button';



@Component({
  selector: 'app-lab1',
  imports: [Pycodechap1, MatCardModule, MatButtonModule],
  templateUrl: './lab1.html',
  styleUrl: './lab1.css',
})
export class Lab1 {

chapter1example1 = `
import numpy as np
import matplotlib.pyplot as plt

def mid_tread(x, q):
    return np.round(x / q) * q

def mid_rise(x, q):
    return (np.floor(x / q) * q) + q / 2

x = np.linspace(-1, 1, 1000)
q_values = [0.5, 0.2, 0.1]

plt.figure(figsize=(8, 6))
for q in q_values:
    plt.plot(x, mid_tread(x, q), label=f"Mid-Tread, q={q}")
plt.title("Mid-Tread Quantizer for Different Step Sizes")
plt.xlabel("x")
plt.ylabel("q(x)")
plt.legend()
plt.grid(True)

import io, base64

buf = io.BytesIO()
plt.savefig(buf, format="png", bbox_inches="tight")
plt.close()
buf.seek(0)

img_base64 = base64.b64encode(buf.read()).decode("utf-8")
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")


`;

chapter1example2 = `
import numpy as np
import matplotlib.pyplot as plt

def mid_tread(x, q):
    """Mid-tread quantizer."""
    return np.round(x / q) * q

fs   = 8000                 # sampling frequency (Hz)
T    = 1.0                  # signal duration (s)
t    = np.linspace(0, T, int(fs*T), endpoint=False)
freq = 440.0                # 440 Hz sine (A4)
A    = 0.8                  # amplitude (try changing this later!)
x    = A * np.sin(2 * np.pi * freq * t)

q_values = np.array([0.4, 0.2, 0.1, 0.05, 0.025, 0.0125])

snr_db_list = []
for q in q_values:
    xq = mid_tread(x, q)
    e  = x - xq

    if np.mean(e**2) == 0:
        snr_db = np.inf
    else:
        snr_db = 10 * np.log10(np.mean(x**2) / np.mean(e**2))
    snr_db_list.append(snr_db)

snr_db_list = np.array(snr_db_list)

plt.figure(figsize=(7, 5))
plt.plot(q_values, snr_db_list, marker='o')
plt.gca().invert_xaxis()  # smaller q on the right side (visually: right = "better")
plt.xlabel("Quantization step size q (smaller is better)")
plt.ylabel("SNR [dB]")
plt.title("SNR vs Quantization Step Size q (Mid-Tread, sine wave)")
plt.grid(True, linestyle=":")


import io, base64

buf = io.BytesIO()
plt.savefig(buf, format="png", bbox_inches="tight")
plt.close()
buf.seek(0)

img_base64 = base64.b64encode(buf.read()).decode("utf-8")
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")


`;


}
