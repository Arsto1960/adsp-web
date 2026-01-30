import { Component } from '@angular/core';
import { Pycodechap1 } from '../../../components/python-code/pycodechap1/pycodechap1';
import { MatCardModule } from '@angular/material/card';


import { MatButtonModule } from '@angular/material/button';



@Component({
  selector: 'app-lab7',
  imports: [Pycodechap1, MatCardModule, MatButtonModule],
  templateUrl: './lab7.html',
  styleUrl: './lab7.css',
})
export class Lab7 {
chapter7example1 = `
import numpy as np
import matplotlib.pyplot as plt
import io, base64

# -------------------------------
# Define original signal
# -------------------------------
x = np.array([1, 2, 3, 4], dtype=float)

# One-sample delayed version (x_delayed[n] = x[n-1], zero-padding)
x_delayed = np.array([0, 1, 2, 3, 4], dtype=float)

# -------------------------------
# Z-transform computation
# -------------------------------
def z_transform(seq, z):
    """
    Compute X(z) = sum_{n=0}^{N-1} x[n] * z^{-n}
    """
    return sum(seq[n] * (z ** (-n)) for n in range(len(seq)))

# Evaluate at a specific complex z
z_val = 0.8 + 0.6j

X_z = z_transform(x, z_val)
X_delayed_z = z_transform(x_delayed, z_val)

# -------------------------------
# Print numerical verification
# -------------------------------
print("z =", z_val)
print("X(z) =", X_z)
print("X_delayed(z) =", X_delayed_z)
print("X(z) * z^(-1) =", X_z * (z_val ** (-1)))
print("Difference (should be near zero) =",
      abs(X_delayed_z - X_z * (z_val ** (-1))))

# -------------------------------
# Plot time-domain signals
# -------------------------------
plt.figure(figsize=(6, 4))
plt.stem(range(len(x)), x, linefmt='b-', markerfmt='bo',
         basefmt='k-', label='x[n]')
plt.stem(range(len(x_delayed)), x_delayed, linefmt='r--',
         markerfmt='ro', basefmt='k-', label='x_delayed[n]')
plt.xlabel("n")
plt.ylabel("Amplitude")
plt.title("Original Signal and One-Sample Delayed Signal")
plt.legend()
plt.grid(True)

# -------------------------------
# Capture plot for Pyodide output
# -------------------------------
buf = io.BytesIO()
plt.savefig(buf, format="png", bbox_inches="tight")
plt.close()
buf.seek(0)

img_base64 = base64.b64encode(buf.read()).decode("utf-8")
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")



`;

chapter7example2 = `
import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import freqz, lfilter
from scipy import signal


# Moving average filter
M = 5
b = np.ones(M) / M

# Frequency response
w, H = freqz(b, 1, 512)

# Test signal
t = np.arange(0, 1, 0.01)
signal_clean = np.sin(2 * np.pi * 5 * t)
signal_noisy = signal_clean + 0.5 * np.random.randn(len(t))
signal_filtered = lfilter(b, 1, signal_noisy)

# Plots
fig, ax = plt.subplots(3, 1, figsize=(10, 7))
ax[0].plot(w / np.pi, 20 * np.log10(np.abs(H) + 1e-12))
ax[0].set_ylabel("Magnitude (dB)")

ax[1].plot(w / np.pi, np.angle(H))
ax[1].set_ylabel("Phase (rad)")

ax[2].plot(t, signal_noisy, alpha=0.4, label="Noisy")
ax[2].plot(t, signal_filtered, linewidth=2, label="Filtered")
ax[2].plot(t, signal_clean, "--", label="Original")
ax[2].set_xlabel("Time (s)")
ax[2].legend()

for a in ax:
    a.grid(True)

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

chapter7example3 = `
import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import lfilter, freqz

# Pole values to test
pole_values = [0.5, 0.9, 0.99, 1.01, 1.5]

# Common impulse input
N = 50
impulse = np.zeros(N)
impulse[0] = 1

fig, axes = plt.subplots(len(pole_values), 2, figsize=(12, 10))
fig.suptitle("IIR Filter Stability Analysis")

for i, p in enumerate(pole_values):
    b = [1]
    a = [1, -p]

    h = lfilter(b, a, impulse)
    w, H = freqz(b, a, worN=256)

    axes[i, 0].stem(h, basefmt=" ")
    axes[i, 0].set_ylabel(f"p={p}")
    axes[i, 0].grid(True)

    status = "Unstable!" if p > 1 else "Stable"
    color = "red" if p > 1 else "green"
    axes[i, 0].set_title(status, color=color)

    axes[i, 1].plot(w / np.pi, 20 * np.log10(np.abs(H) + 1e-12))
    axes[i, 1].set_ylim([-40, 40])
    axes[i, 1].grid(True)

axes[-1, 0].set_xlabel("Sample n")
axes[-1, 1].set_xlabel("Normalized Frequency (×π)")
axes[0, 0].set_title("Impulse Response")
axes[0, 1].set_title("Magnitude Response (dB)")

plt.tight_layout()





import io, base64

buf = io.BytesIO()
plt.savefig(buf, format="png", bbox_inches="tight")
plt.close()
buf.seek(0)

img_base64 = base64.b64encode(buf.read()).decode("utf-8")
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")


`;

chapter7example4 = `
import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import freqz, lfilter
from scipy.fft import fft, fftfreq

# Notch filter settings (normalized to π)
notch_freq = 0.25
r = 0.95

# Zeros and poles (same angle, poles slightly inside unit circle)
theta = notch_freq * np.pi
zeros = np.exp(1j * np.array([theta, -theta]))
poles = r * zeros

# Filter coefficients
b = np.poly(zeros).real
a = np.poly(poles).real

print("Numerator coefficients b:", b)
print("Denominator coefficients a:", a)

# Plot pole-zero diagram and frequency response
w, H = freqz(b, a, worN=512)
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4))

angles = np.linspace(0, 2 * np.pi, 400)
ax1.plot(np.cos(angles), np.sin(angles), linestyle="--")
ax1.plot(zeros.real, zeros.imag, "o", markersize=9, label="Zeros")
ax1.plot(poles.real, poles.imag, "x", markersize=9, label="Poles")
ax1.set_title("Pole-Zero Plot")
ax1.set_xlabel("Real")
ax1.set_ylabel("Imag")
ax1.set_xlim([-1.5, 1.5])
ax1.set_ylim([-1.5, 1.5])
ax1.axis("equal")
ax1.grid(True)
ax1.legend()

ax2.plot(w / np.pi, 20 * np.log10(np.abs(H) + 1e-12))
ax2.axvline(notch_freq, linestyle="--", label=f"Notch at {notch_freq}π")
ax2.set_title("Frequency Response")
ax2.set_xlabel("Normalized Frequency (×π)")
ax2.set_ylabel("Magnitude (dB)")
ax2.grid(True)
ax2.legend()

plt.tight_layout()


# Test signal and spectrum
fs = 1000
t = np.arange(0, 1, 1 / fs)
signal_test = (
    np.sin(2 * np.pi * 50 * t)
    + np.sin(2 * np.pi * 125 * t)
    + np.sin(2 * np.pi * 200 * t)
)

signal_filtered = lfilter(b, a, signal_test)

freqs = fftfreq(len(t), 1 / fs)
mask = freqs > 0
spectrum_orig = np.abs(fft(signal_test))
spectrum_filt = np.abs(fft(signal_filtered))

plt.figure(figsize=(11, 4))
plt.plot(freqs[mask], spectrum_orig[mask], label="Original")
plt.plot(freqs[mask], spectrum_filt[mask], label="Filtered")
plt.xlim([0, 300])
plt.xlabel("Frequency (Hz)")
plt.ylabel("Magnitude")
plt.title("Frequency Spectrum - Notch Filter Effect")
plt.grid(True)
plt.legend()
plt.show()






import io, base64

buf = io.BytesIO()
plt.savefig(buf, format="png", bbox_inches="tight")
plt.close()
buf.seek(0)

img_base64 = base64.b64encode(buf.read()).decode("utf-8")
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")



`;
}
