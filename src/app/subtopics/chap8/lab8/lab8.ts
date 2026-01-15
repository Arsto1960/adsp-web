import {  Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MatButtonModule } from '@angular/material/button';
import { MathJaxDirective } from '../../../components/mathjax.directive';
import { Pycodechap1 } from '../../../components/python-code/pycodechap1/pycodechap1';


@Component({
  selector: 'app-lab8',
 imports: [MatCardModule, MathJaxDirective, MatButtonModule, Pycodechap1],
  templateUrl: './lab8.html',
  styleUrl: './lab8.css',
})
export class Lab8 {

chapter8example1 = `
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from scipy.signal import remez, freqz
import io, base64

# -------------------------------
# Half-band low-pass FIR design
# -------------------------------
N = 32
F = [0.0, 0.4, 0.5, 1.0]   # Normalized to Nyquist = 1.0
A = [1.0, 0.0]
W = [1, 100]

# ✅ FIX: explicitly define fs so Nyquist = 1.0
h = remez(N, F, A, weight=W, fs=2.0)

# -------------------------------
# Frequency response
# -------------------------------
w, H = freqz(h, worN=2048)
w_n = w / np.pi

stop_start = int(0.5 * len(H))
stop_max = np.max(np.abs(H[stop_start:]))
atten_db = -20 * np.log10(stop_max + 1e-12)

print(f"Estimated stopband attenuation: {atten_db:.1f} dB")

# -------------------------------
# Plots
# -------------------------------
fig, ax = plt.subplots(3, 1, figsize=(10, 8))

ax[0].stem(h, basefmt=" ")
ax[0].set_title("Impulse Response")
ax[0].set_xlabel("Sample")
ax[0].set_ylabel("Amplitude")
ax[0].grid(True)

ax[1].plot(w_n, 20 * np.log10(np.abs(H) + 1e-12))
ax[1].axvline(0.4, linestyle="--", label="Passband edge")
ax[1].axvline(0.5, linestyle="--", label="Stopband edge")
ax[1].set_ylim([-80, 5])
ax[1].set_title("Frequency Response (Magnitude)")
ax[1].set_ylabel("Magnitude (dB)")
ax[1].grid(True)
ax[1].legend()

ax[2].plot(w_n, np.angle(H))
ax[2].set_title("Frequency Response (Phase)")
ax[2].set_xlabel("Normalized Frequency (×π rad/sample)")
ax[2].set_ylabel("Phase (radians)")
ax[2].grid(True)

plt.tight_layout()

# -------------------------------
# Capture plot for Pyodide
# -------------------------------
buf = io.BytesIO()
plt.savefig(buf, format="png", bbox_inches="tight")
plt.close()
buf.seek(0)

img_base64 = base64.b64encode(buf.read()).decode("utf-8")
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")




`;

chapter8example2 = `
import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import lfilter

# FIR filter and downsampling factor
h = np.array([1, 2, 3, 4, 5], dtype=float)
N = 3

# Test input
x = np.arange(1, 21, dtype=float)

print("Original filter h:", h)
print("Input signal x:", x)
print()

# Left side: downsample then filter
x_down = x[::N]
y_left = lfilter(h, 1, x_down)

print("Downsampled x:", x_down)
print("Left side (downsample → filter):", y_left)
print()

# Right side: filter with upsampled h then downsample
h_up = np.zeros((len(h) - 1) * N + 1)
h_up[::N] = h
y_right = lfilter(h_up, 1, x)[::N]

print("Upsampled filter h:", h_up)
print("Right side (filter with H(z^N) → downsample):", y_right)
print()

print("Are they equal?", np.allclose(y_left, y_right))
print("Maximum difference:", np.max(np.abs(y_left - y_right)))

# Visualize
fig, axes = plt.subplots(3, 1, figsize=(12, 8))

axes[0].stem(x, basefmt=" ")
axes[0].set_title("Original Signal x")
axes[0].set_ylabel("Value")
axes[0].grid(True)

axes[1].stem(y_left, basefmt=" ")
axes[1].set_title("Left Side: Downsample → Filter")
axes[1].set_ylabel("Value")
axes[1].grid(True)

axes[2].stem(y_right, basefmt=" ")
axes[2].set_title(f"Right Side: Filter with H(z^{N}) → Downsample")
axes[2].set_xlabel("Sample")
axes[2].set_ylabel("Value")
axes[2].grid(True)

plt.tight_layout()
plt.show()


import io, base64

buf = io.BytesIO()
plt.savefig(buf, format="png", bbox_inches="tight")
plt.close()
buf.seek(0)

img_base64 = base64.b64encode(buf.read()).decode("utf-8")
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")




`;

chapter8example3 = `
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from scipy.signal import remez, lfilter
import io, base64

# Anti-aliasing FIR for downsampling
N = 4

h = remez(
    32,
    [0.0, 0.20, 0.25, 1.0],
    [1.0, 0.0],
    weight=[1, 100],
    fs=2.0
)

print("Filter length:", len(h))

# Polyphase decomposition
E = [h[i::N] for i in range(N)]
for i, ei in enumerate(E):
    print("Polyphase component H_" + str(i) + ":", ei)

# Test signal
fs = 1000
t = np.linspace(0, 1, fs, endpoint=False)

x = (
    np.sin(2 * np.pi * 50 * t)
    + 0.5 * np.sin(2 * np.pi * 120 * t)
    + 0.3 * np.sin(2 * np.pi * 400 * t)
)

# Direct method
y_direct = lfilter(h, 1, x)[::N]

# Polyphase method
x_phases = [x[i::N] for i in range(N)]
y_poly = np.zeros_like(y_direct)

for i in range(N):
    y_poly += lfilter(E[i], 1, x_phases[i])

print("Output comparison")
print("Direct output length:", len(y_direct))
print("Polyphase output length:", len(y_poly))
print("Are they equal:", np.allclose(y_direct, y_poly))
print("Maximum difference:", np.max(np.abs(y_direct - y_poly)))

# Visualization
t_down = np.arange(len(y_direct)) / (fs / N)

fig, axes = plt.subplots(3, 1, figsize=(12, 8))

axes[0].plot(t[:200], x[:200])
axes[0].set_title("Original Signal")
axes[0].grid(True)

axes[1].plot(t_down[:50], y_direct[:50], "o-")
axes[1].set_title("Direct Method")
axes[1].grid(True)

axes[2].plot(t_down[:50], y_poly[:50], "^-")
axes[2].set_title("Polyphase Method")
axes[2].grid(True)

plt.tight_layout()

# Computational cost
direct_ops = len(x) * len(h)
poly_ops = sum(len(x_phases[i]) * len(E[i]) for i in range(N))

print("Computational cost")
print("Direct ops:", direct_ops)
print("Polyphase ops:", poly_ops)
print("Speedup:", direct_ops / poly_ops)

# Capture plot for Pyodide
buf = io.BytesIO()
plt.savefig(buf, format="png", bbox_inches="tight")
plt.close()

buf.seek(0)
img_base64 = base64.b64encode(buf.read()).decode("utf-8")
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")



`;

chapter8example4 = `
import numpy as np
import matplotlib
matplotlib.use("Agg")  # Pyodide-safe backend
import matplotlib.pyplot as plt
from scipy.signal import remez, lfilter
import io, base64

# -------------------------------
# Interpolation (Upsampling) Filter
# -------------------------------
N = 3
h = remez(30, [0.0, 0.30, 0.35, 1.0], [1.0, 0.0], weight=[1, 100], fs=2.0)
E = [h[i::N] for i in range(N)]

print("Upsampling factor:", N)
print("Filter length:", len(h))
for i, ei in enumerate(E):
    print(f"Polyphase H_{i} length:", len(ei))

# -------------------------------
# Low-rate test signal
# -------------------------------
fs_low = 100
t_low = np.linspace(0, 1, fs_low, endpoint=False)
x_low = np.sin(2 * np.pi * 10 * t_low)

# -------------------------------
# Method 1: Upsample then filter
# -------------------------------
x_up = np.zeros(len(x_low) * N)
x_up[::N] = x_low
y_direct = lfilter(h, 1, x_up)

# -------------------------------
# Method 2: Polyphase
# -------------------------------
y_poly = np.zeros_like(x_up)
for i in range(N):
    y_phase = lfilter(E[i], 1, x_low)
    y_poly[i::N] = y_phase[:len(y_poly[i::N])]

# -------------------------------
# Compare outputs
# -------------------------------
L = min(len(y_direct), len(y_poly))
print("\nDirect output length:", len(y_direct))
print("Polyphase output length:", len(y_poly))
print("Are they equal?", np.allclose(y_direct[:L], y_poly[:L]))
print("Maximum difference:", np.max(np.abs(y_direct[:L] - y_poly[:L])))

# -------------------------------
# Visualization (Pyodide-safe)
# -------------------------------
fig, axes = plt.subplots(4, 1, figsize=(12, 10))

axes[0].stem(x_low[:30], basefmt=" ")
axes[0].set_title(f"Original Signal (fs = {fs_low} Hz)")
axes[0].set_ylabel("Amplitude")
axes[0].grid(True)

axes[1].stem(x_up[:90], basefmt=" ")
axes[1].set_title(f"After Upsampling by {N} (zeros inserted)")
axes[1].set_ylabel("Amplitude")
axes[1].grid(True)

axes[2].plot(y_direct[:90], "o-", markersize=3)
axes[2].set_title("Direct Method: Upsample → Filter")
axes[2].set_ylabel("Amplitude")
axes[2].grid(True)

axes[3].plot(y_poly[:90], "^-", markersize=3)
axes[3].set_title(f"Polyphase Method (filters operate at {fs_low} Hz)")
axes[3].set_xlabel("Sample")
axes[3].set_ylabel("Amplitude")
axes[3].grid(True)

plt.tight_layout()

# -------------------------------
# Capture plot for Pyodide (base64)
# -------------------------------
buf = io.BytesIO()
plt.savefig(buf, format="png", bbox_inches="tight")
plt.close()
buf.seek(0)
img_base64 = base64.b64encode(buf.read()).decode("utf-8")
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")

# -------------------------------
# Computational cost
# -------------------------------
direct_ops = len(x_up) * len(h)
poly_ops = sum(len(x_low) * len(ei) for ei in E)

print("\n--- Computational Cost ---")
print(f"Direct method: {direct_ops} operations (approx)")
print(f"Polyphase method: {poly_ops} operations (approx)")
print(f"Speedup factor: {direct_ops / poly_ops:.2f}x")




`;
}


