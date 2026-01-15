import { Component } from '@angular/core';
import { Pycodechap1 } from '../../../components/python-code/pycodechap1/pycodechap1';
import { MatCardModule } from '@angular/material/card';


import { MatButtonModule } from '@angular/material/button';




@Component({
  selector: 'app-lab10',
  imports: [Pycodechap1, MatCardModule, MatButtonModule],
  templateUrl: './lab10.html',
  styleUrl: './lab10.css',
})
export class Lab10 {

chapter10example1 = `
import numpy as np
import matplotlib
matplotlib.use("Agg")  # safe backend for Pyodide
import matplotlib.pyplot as plt

# -----------------------------
# Linear-phase FIR
# -----------------------------
hsinc = np.sinc(np.linspace(-1.8, 1.8, 11))

# Symmetry check
center = len(hsinc) // 2

# Zeros
zeros = np.roots(hsinc)

# -----------------------------
# Frequency response (manual)
# -----------------------------
Nfft = 2048
H = np.fft.fft(hsinc, Nfft)
w = 2 * np.pi * np.arange(Nfft) / Nfft
H = H[:Nfft//2]
w = w[:Nfft//2]

# Group delay for symmetric FIR
gd = (len(hsinc)-1)/2 * np.ones_like(w)

# -----------------------------
# Plots
# -----------------------------
fig, axes = plt.subplots(3, 2, figsize=(14, 10))

# Impulse response
axes[0,0].stem(hsinc, basefmt=" ")
axes[0,0].set_title("Impulse Response (Linear Phase Filter)")
axes[0,0].set_xlabel("Sample n")
axes[0,0].set_ylabel("Value")
axes[0,0].grid(True)

# Zero plot
angles = np.linspace(0, 2*np.pi, 400)
axes[0,1].plot(np.cos(angles), np.sin(angles), "--", linewidth=2, label="Unit circle")
axes[0,1].plot(zeros.real, zeros.imag, "o", markersize=8, label="Zeros")
axes[0,1].axhline(0, linewidth=0.5)
axes[0,1].axvline(0, linewidth=0.5)
axes[0,1].set_title("Zero Plot")
axes[0,1].set_xlabel("Real")
axes[0,1].set_ylabel("Imag")
axes[0,1].set_xlim([-2, 2])
axes[0,1].set_ylim([-1.5, 1.5])
axes[0,1].axis("equal")
axes[0,1].grid(True, alpha=0.3)
axes[0,1].legend()

# Magnitude response
axes[1,0].plot(w/np.pi, 20*np.log10(np.abs(H)+1e-12))
axes[1,0].set_title("Magnitude Response")
axes[1,0].set_ylabel("Magnitude (dB)")
axes[1,0].set_ylim([-80,5])
axes[1,0].grid(True)

# Phase response
phase = np.angle(H)
axes[1,1].plot(w/np.pi, phase)
axes[1,1].set_title("Phase Response")
axes[1,1].set_ylabel("Phase (radians)")
axes[1,1].grid(True)

# Unwrapped phase
phase_u = np.unwrap(phase)
axes[2,0].plot(w/np.pi, phase_u)
axes[2,0].set_title("Unwrapped Phase Response")
axes[2,0].set_xlabel("Normalized Frequency (×π)")
axes[2,0].set_ylabel("Unwrapped Phase (rad)")
axes[2,0].grid(True)

# Group delay
axes[2,1].plot(w/np.pi, gd)
axes[2,1].axhline((len(hsinc)-1)/2, linestyle="--", alpha=0.7, label=f"Expected delay = {int((len(hsinc)-1)/2)}")
axes[2,1].set_title("Group Delay")
axes[2,1].set_xlabel("Normalized Frequency (×π)")
axes[2,1].set_ylabel("Group Delay (samples)")
axes[2,1].grid(True)
axes[2,1].legend()

plt.tight_layout()

# -----------------------------
# Render interactive plot in browser
# -----------------------------
import io, base64

buf = io.BytesIO()
plt.savefig(buf, format="png", bbox_inches="tight")
plt.close()
buf.seek(0)

img_base64 = base64.b64encode(buf.read()).decode("utf-8")
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")



`;

chapter10example2 = `
import numpy as np
import matplotlib.pyplot as plt
from scipy import signal
from scipy.signal import freqz

# Original linear-phase FIR
hsinc = np.sinc(np.linspace(-1.8, 1.8, 11))

# Method 1: Manual minimum-phase (reflect zeros outside unit circle)
h_manual = hsinc.astype(float).copy()
for z in np.roots(h_manual):
    if np.abs(z) > 1.01:
        q, r = np.polydiv(h_manual, [1, -z])
        z_in = 1.0 / np.conj(z)
        h_manual = np.convolve(q, [1, -z_in])
h_manual = np.real_if_close(h_manual)

# Method 2: SciPy minimum_phase
hsq = np.convolve(hsinc, hsinc)
h_scipy = signal.minimum_phase(hsq)

# Frequency responses
w, Hm = freqz(h_manual, 1, worN=2048)
_, Hs = freqz(h_scipy, 1, worN=2048)

# Group delays
w_gd, gd_lin = signal.group_delay((hsinc, 1), w=2048)
_, gd_man = signal.group_delay((h_manual, 1), w=2048)
_, gd_sci = signal.group_delay((h_scipy, 1), w=2048)

# Zero magnitudes
z_man = np.abs(np.roots(h_manual))
z_sci = np.abs(np.roots(h_scipy))

# Plots
fig, axes = plt.subplots(3, 2, figsize=(14, 10))

axes[0, 0].stem(h_manual, basefmt=" ")
axes[0, 0].set_title("Manual Method - Impulse Response")
axes[0, 0].set_ylabel("Value")
axes[0, 0].grid(True)

axes[0, 1].stem(h_scipy, basefmt=" ")
axes[0, 1].set_title("SciPy Method - Impulse Response")
axes[0, 1].grid(True)

axes[1, 0].plot(w / np.pi, 20 * np.log10(np.abs(Hm) + 1e-12), label="Manual")
axes[1, 0].plot(w / np.pi, 20 * np.log10(np.abs(Hs) + 1e-12), "--", alpha=0.7, label="SciPy")
axes[1, 0].set_title("Magnitude Response")
axes[1, 0].set_ylabel("Magnitude (dB)")
axes[1, 0].set_ylim([-80, 5])
axes[1, 0].grid(True)
axes[1, 0].legend()

axes[1, 1].plot(w / np.pi, np.angle(Hm), label="Manual")
axes[1, 1].plot(w / np.pi, np.angle(Hs), "--", alpha=0.7, label="SciPy")
axes[1, 1].set_title("Phase Response")
axes[1, 1].set_ylabel("Phase (rad)")
axes[1, 1].grid(True)
axes[1, 1].legend()

axes[2, 0].plot(w_gd / np.pi, gd_lin, linewidth=2, label="Linear Phase")
axes[2, 0].plot(w_gd / np.pi, gd_man, "--", label="Min Phase (Manual)")
axes[2, 0].plot(w_gd / np.pi, gd_sci, ":", label="Min Phase (SciPy)")
axes[2, 0].set_title("Group Delay Comparison")
axes[2, 0].set_xlabel("Normalized Frequency (×π)")
axes[2, 0].set_ylabel("Group Delay (samples)")
axes[2, 0].grid(True)
axes[2, 0].legend()

axes[2, 1].plot(z_man, "o", markersize=8, label="Manual")
axes[2, 1].plot(z_sci, "^", markersize=8, alpha=0.7, label="SciPy")
axes[2, 1].axhline(1.0, linestyle="--", label="Unit circle")
axes[2, 1].set_title("Zero Magnitudes")
axes[2, 1].set_xlabel("Zero Index")
axes[2, 1].set_ylabel("Zero Magnitude")
axes[2, 1].grid(True)
axes[2, 1].legend()

plt.tight_layout()

# Replace plt.show() with mpld3.display()


# --------------------------------------------------
# Export image for Pyodide
# --------------------------------------------------
import io, base64

buf = io.BytesIO()
plt.savefig(buf, format="png", bbox_inches="tight")
plt.close()
buf.seek(0)

img_base64 = base64.b64encode(buf.read()).decode("utf-8")
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")



`;

chapter10example4 = `

import numpy as np
import matplotlib
matplotlib.use("Agg")  # Pyodide-safe backend
import matplotlib.pyplot as plt

# -----------------------------
# Helper: Manual minimum-phase FIR
# -----------------------------
def manual_minphase(h):
    h_min = h.copy()
    for z in np.roots(h):
        if np.abs(z) > 1.0:
            q, _ = np.polydiv(h_min, [1, -z])
            z_ref = 1.0 / np.conj(z)
            h_min = np.convolve(q, [1, -z_ref])
    return np.real_if_close(h_min)

# -----------------------------
# Signal
# -----------------------------
fs = 8000
duration = 2.0
t = np.linspace(0, duration, int(fs*duration), endpoint=False)

f0 = 120
test_signal = np.zeros_like(t)
for k in range(1, 20):
    test_signal += (1.0/k) * np.sin(2*np.pi*f0*k*t)
test_signal /= np.max(np.abs(test_signal))

# -----------------------------
# Channel: low-pass FIR
# -----------------------------
N_ch = 31
cutoff = 0.3
h_channel = np.sinc(2*cutoff*(np.arange(N_ch)-N_ch//2))
h_channel *= np.hamming(N_ch)
h_channel /= np.sum(h_channel)
distorted_signal = np.convolve(test_signal, h_channel, mode='same')

# -----------------------------
# Equalizer: high-pass linear-phase -> min-phase
# -----------------------------
h_eq_lin = np.sinc(2*(0.5-cutoff)*(np.arange(N_ch)-N_ch//2))
h_eq_lin *= np.hamming(N_ch)
h_eq_lin /= np.sum(h_eq_lin)
h_eq_lin = h_eq_lin[::-1]  # simple high-pass approx
h_equalizer = manual_minphase(h_eq_lin)
equalized_signal = np.convolve(distorted_signal, h_equalizer, mode='same')
equalized_signal /= np.max(np.abs(equalized_signal))

# -----------------------------
# Spectra
# -----------------------------
Nfft = len(test_signal)
freqs = np.fft.fftfreq(Nfft, 1/fs)
mask = (freqs>0) & (freqs<fs/2)

S_orig = np.abs(np.fft.fft(test_signal))
S_dist = np.abs(np.fft.fft(distorted_signal))
S_eq = np.abs(np.fft.fft(equalized_signal))

# Frequency responses
w = np.linspace(0, np.pi, 2048)
H_ch = np.exp(-1j*np.outer(w, np.arange(len(h_channel)))) @ h_channel
H_eq = np.exp(-1j*np.outer(w, np.arange(len(h_equalizer)))) @ h_equalizer
H_comb = H_ch * H_eq
f_resp = w * fs / (2*np.pi)

# -----------------------------
# Plots
# -----------------------------
fig, axes = plt.subplots(3, 2, figsize=(14,12))

axes[0,0].plot(t[:500], test_signal[:500])
axes[0,0].set_title("Original Signal")
axes[0,0].set_ylabel("Amplitude"); axes[0,0].grid(True)

axes[0,1].plot(t[:500], distorted_signal[:500])
axes[0,1].set_title("After Channel Distortion (High-freq attenuation)")
axes[0,1].set_ylabel("Amplitude"); axes[0,1].grid(True)

axes[1,0].semilogy(freqs[mask], S_orig[mask], label="Original")
axes[1,0].semilogy(freqs[mask], S_dist[mask], label="Distorted")
axes[1,0].set_title("Spectrum Comparison")
axes[1,0].set_ylabel("Magnitude"); axes[1,0].set_xlim([0, fs/2]); axes[1,0].grid(True); axes[1,0].legend()

axes[1,1].semilogy(freqs[mask], S_dist[mask], label="Distorted")
axes[1,1].semilogy(freqs[mask], S_eq[mask], label="Equalized")
axes[1,1].set_title("After Equalization")
axes[1,1].set_ylabel("Magnitude"); axes[1,1].set_xlim([0, fs/2]); axes[1,1].grid(True); axes[1,1].legend()

axes[2,0].plot(f_resp, 20*np.log10(np.abs(H_ch)+1e-12), label="Channel")
axes[2,0].plot(f_resp, 20*np.log10(np.abs(H_eq)+1e-12), label="Equalizer")
axes[2,0].set_title("Channel and Equalizer Frequency Response")
axes[2,0].set_xlabel("Frequency (Hz)"); axes[2,0].set_ylabel("Magnitude (dB)")
axes[2,0].set_xlim([0, fs/2]); axes[2,0].grid(True); axes[2,0].legend()

axes[2,1].plot(f_resp, 20*np.log10(np.abs(H_comb)+1e-12))
axes[2,1].axhline(0, linestyle="--", alpha=0.6, label="Target (0 dB)")
axes[2,1].set_title("Combined Channel + Equalizer Response")
axes[2,1].set_xlabel("Frequency (Hz)"); axes[2,1].set_ylabel("Magnitude (dB)")
axes[2,1].set_xlim([0, fs/2]); axes[2,1].set_ylim([-20,5]); axes[2,1].grid(True); axes[2,1].legend()

plt.tight_layout()
plt.show()

# -----------------------------
# Summary
# -----------------------------
print("Audio Equalization Summary:")
print(f"Original signal energy:  {np.sum(test_signal**2):.2f}")
print(f"Distorted signal energy: {np.sum(distorted_signal**2):.2f}")
print(f"Equalized signal energy: {np.sum(equalized_signal**2):.2f}")

import io, base64
buf = io.BytesIO()
plt.savefig(buf, format="png", bbox_inches="tight")
plt.close()
buf.seek(0)

img_base64 = base64.b64encode(buf.read()).decode("utf-8")
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")


`;
}
