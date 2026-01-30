import { Component } from '@angular/core';
import { Pycodechap1 } from '../../../components/python-code/pycodechap1/pycodechap1';
import { MatCardModule } from '@angular/material/card';


import { MatButtonModule } from '@angular/material/button';



@Component({
  selector: 'app-lab9',
  imports: [Pycodechap1, MatCardModule, MatButtonModule],
  templateUrl: './lab9.html',
  styleUrl: './lab9.css',
})
export class Lab9 {

  chapter9example1 = `


import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import io, base64

# -------------------------------
# Fractional delay FIR (windowed-sinc)
# -------------------------------
L = 15
n0 = 7
d_frac = 0.7
d_total = n0 + d_frac

n = np.arange(L)

# Hann-like window (sine window)
win = np.sin(np.pi / L * (n + 0.5))

# Fractional-delay impulse response
h = win * np.sinc(n - d_total)

# -------------------------------
# Test signal (ramp then zeros)
# -------------------------------
x = np.hstack((np.arange(6), np.zeros(12)))

# FIR filtering using convolution (Pyodide-safe)
y = np.convolve(x, h, mode="full")[:len(x)]

# -------------------------------
# Frequency response (FFT-based)
# -------------------------------
Nfft = 512
H = np.fft.fft(h, Nfft)
w = np.linspace(0, 1, Nfft // 2, endpoint=False)

Hmag = 20 * np.log10(np.abs(H[:Nfft // 2]) + 1e-12)

# -------------------------------
# Plots
# -------------------------------
fig, ax = plt.subplots(3, 1, figsize=(12, 9))

ax[0].stem(h, basefmt=" ")
ax[0].set_title(f"FIR Fractional Delay Filter (delay = {d_total:.2f} samples)")
ax[0].set_ylabel("Amplitude")
ax[0].grid(True)

ax[1].plot(x, "o-", label="Original", markersize=7)
ax[1].plot(y, "^-", label=f"Delayed by {d_total:.2f} samples", markersize=6)
ax[1].axvline(d_total, linestyle="--", alpha=0.6, label="Expected delay")
ax[1].set_title("Test Signal: Ramp Function")
ax[1].set_ylabel("Amplitude")
ax[1].grid(True)
ax[1].legend()

ax[2].plot(w, Hmag)
ax[2].set_title("Frequency Response (FFT-based)")
ax[2].set_xlabel("Normalized Frequency (×π rad/sample)")
ax[2].set_ylabel("Magnitude (dB)")
ax[2].set_ylim([-40, 5])
ax[2].grid(True)

plt.tight_layout()

# -------------------------------
# Export figure for Pyodide
# -------------------------------
buf = io.BytesIO()
plt.savefig(buf, format="png", bbox_inches="tight")
plt.close()
buf.seek(0)

img_base64 = base64.b64encode(buf.read()).decode("utf-8")
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")

# -------------------------------
# Info output
# -------------------------------
print("Filter length:", L)
print("Integer delay:", n0)
print("Fractional delay:", d_frac)
print("Total delay:", d_total)





`;

           
chapter9example2 = `

import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import io, base64

# --------------------------------------------------
# Thiran all-pass fractional delay filter
# --------------------------------------------------
def allp_delayfilt(tau):
    L = int(np.floor(tau)) + 1
    n = np.arange(L)
    ratio = ((L - n) * (L - n - tau)) / ((n + 1) * (n + 1 + tau))
    a = np.concatenate(([1.0], np.cumprod(ratio)))
    b = a[::-1]
    return a, b

# --------------------------------------------------
# IIR filter (direct-form implementation)
# --------------------------------------------------
def iir_filter(b, a, x):
    y = np.zeros_like(x, dtype=float)
    na = len(a)
    nb = len(b)

    for n in range(len(x)):
        acc = 0.0
        for k in range(nb):
            if n - k >= 0:
                acc += b[k] * x[n - k]
        for k in range(1, na):
            if n - k >= 0:
                acc -= a[k] * y[n - k]
        y[n] = acc
    return y

# --------------------------------------------------
# Frequency response via FFT
# --------------------------------------------------
def freq_response_fft(b, a, N=512):
    impulse = np.zeros(N)
    impulse[0] = 1.0
    h = iir_filter(b, a, impulse)
    H = np.fft.fft(h, N)
    w = np.linspace(0, 1, N // 2, endpoint=False)
    return w, H[:N // 2]

# --------------------------------------------------
# Test setup
# --------------------------------------------------
delays = [3.5, 5.5, 7.3, 10.8]

x = np.concatenate((np.arange(5.0), np.zeros(40)))
impulse = np.concatenate(([1.0], np.zeros(49)))

fig, axes = plt.subplots(len(delays), 3, figsize=(15, 12))
fig.suptitle("IIR All-Pass Fractional Delay Filters (Thiran)")

# --------------------------------------------------
# Run tests
# --------------------------------------------------
for i, tau in enumerate(delays):
    a, b = allp_delayfilt(tau)

    y = iir_filter(b, a, x)
    h = iir_filter(b, a, impulse)
    w, H = freq_response_fft(b, a)

    axes[i, 0].stem(h[:31], basefmt=" ")
    axes[i, 0].set_ylabel(f"τ = {tau}")
    axes[i, 0].grid(True)
    if i == 0:
        axes[i, 0].set_title("Impulse Response")

    axes[i, 1].plot(x[:26], "o-", markersize=5, label="Original")
    axes[i, 1].plot(y[:26], "^-", markersize=5, label="Delayed")
    axes[i, 1].axvline(tau, linestyle="--", alpha=0.5)
    axes[i, 1].grid(True)
    axes[i, 1].legend(fontsize=8)
    if i == 0:
        axes[i, 1].set_title("Ramp Test")

    axes[i, 2].plot(w, 20 * np.log10(np.abs(H) + 1e-15))
    axes[i, 2].set_ylim([-0.5, 0.5])
    axes[i, 2].grid(True)
    if i == 0:
        axes[i, 2].set_title("Magnitude (dB)")

for j in range(3):
    axes[-1, j].set_xlabel("Sample n" if j < 2 else "Normalized Frequency (×π)")

plt.tight_layout()

# --------------------------------------------------
# Export plot for Pyodide
# --------------------------------------------------
buf = io.BytesIO()
plt.savefig(buf, format="png", bbox_inches="tight")
plt.close()
buf.seek(0)

img_base64 = base64.b64encode(buf.read()).decode("utf-8")
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")

# --------------------------------------------------
# Magnitude verification
# --------------------------------------------------
print("Magnitude verification for τ = 5.5")
a, b = allp_delayfilt(5.5)
w, H = freq_response_fft(b, a, N=256)

mag = np.abs(H)
dev = np.max(np.abs(mag - 1))
db_min = 20 * np.log10(np.min(mag) + 1e-15)
db_max = 20 * np.log10(np.max(mag) + 1e-15)

print("Max magnitude deviation from 1:", f"{dev:.2e}")
print("Magnitude range (dB):", f"[{db_min:.2e}, {db_max:.2e}]")





`;

           
chapter9example3 = `

import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import io, base64

# --------------------------------------------------
# Thiran all-pass fractional delay filter
# --------------------------------------------------
def allp_delayfilt(tau):
    L = int(np.floor(tau)) + 1
    n = np.arange(L)
    ratio = ((L - n) * (L - n - tau)) / ((n + 1) * (n + 1 + tau))
    a = np.concatenate(([1.0], np.cumprod(ratio)))
    b = a[::-1]
    return a, b

# --------------------------------------------------
# IIR filter (direct form)
# --------------------------------------------------
def iir_filter(b, a, x):
    y = np.zeros_like(x, dtype=float)
    na = len(a)
    nb = len(b)

    for n in range(len(x)):
        acc = 0.0
        for k in range(nb):
            if n - k >= 0:
                acc += b[k] * x[n - k]
        for k in range(1, na):
            if n - k >= 0:
                acc -= a[k] * y[n - k]
        y[n] = acc
    return y

# --------------------------------------------------
# Frequency response via FFT
# --------------------------------------------------
def freq_response(b, a, N=2048):
    impulse = np.zeros(N)
    impulse[0] = 1.0
    h = iir_filter(b, a, impulse)
    H = np.fft.fft(h)
    w = np.linspace(0, 1, N // 2, endpoint=False)
    return w, H[:N // 2]

# --------------------------------------------------
# Group delay from phase derivative
# --------------------------------------------------
def group_delay_from_phase(H, w):
    phase = np.unwrap(np.angle(H))
    dphi = np.gradient(phase)
    dw = np.gradient(w * np.pi)
    gd = -dphi / dw
    return gd

# --------------------------------------------------
# Test setup
# --------------------------------------------------
delays = [2.5, 5.0, 8.0]
colors = ["blue", "green", "red"]

fig, axes = plt.subplots(3, 1, figsize=(12, 10))

# --------------------------------------------------
# Analysis
# --------------------------------------------------
for tau, color in zip(delays, colors):
    a, b = allp_delayfilt(tau)

    w, H = freq_response(b, a)
    gd = group_delay_from_phase(H, w)

    # Magnitude
    axes[0].plot(
        w,
        20 * np.log10(np.abs(H) + 1e-15),
        label=f"τ = {tau}",
        color=color,
    )

    # Phase
    axes[1].plot(
        w,
        np.unwrap(np.angle(H)),
        label=f"τ = {tau}",
        color=color,
    )

    # Group delay
    axes[2].plot(w, gd, label=f"τ = {tau}", color=color)
    axes[2].axhline(tau, color=color, linestyle="--", alpha=0.3)

# --------------------------------------------------
# Plot formatting
# --------------------------------------------------
axes[0].set_title("Magnitude Response")
axes[0].set_ylabel("Magnitude (dB)")
axes[0].set_ylim([-0.1, 0.1])
axes[0].grid(True)
axes[0].legend()

axes[1].set_title("Phase Response (Unwrapped)")
axes[1].set_ylabel("Phase (radians)")
axes[1].grid(True)
axes[1].legend()

axes[2].set_title("Group Delay")
axes[2].set_xlabel("Normalized Frequency (×π rad/sample)")
axes[2].set_ylabel("Group Delay (samples)")
axes[2].set_xlim([0, 1])
axes[2].grid(True)
axes[2].legend()

plt.tight_layout()

# --------------------------------------------------
# Export figure for Pyodide
# --------------------------------------------------
buf = io.BytesIO()
plt.savefig(buf, format="png", bbox_inches="tight")
plt.close()
buf.seek(0)

img_base64 = base64.b64encode(buf.read()).decode("utf-8")
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")





`;

           
chapter9example4 = `

import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import io, base64

# --------------------------------------------------
# Allpass warping phase
# --------------------------------------------------
def warpingphase(w, a):
    a = complex(a)
    theta = np.angle(a)
    r = np.abs(a)
    return -w - 2 * np.arctan2(
        r * np.sin(w - theta),
        1 - r * np.cos(w - theta)
    )

# --------------------------------------------------
# Frequency range
# --------------------------------------------------
w = np.linspace(0, np.pi, 500)
a_values = [0.3, 0.5, 0.7, 0.85, 0.9]

fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# --------------------------------------------------
# 1) Allpass warping functions
# --------------------------------------------------
for a_val in a_values:
    warped = -warpingphase(w, a_val)
    axes[0, 0].plot(w / np.pi, warped / np.pi, label=f"a = {a_val}")

axes[0, 0].plot(w / np.pi, w / np.pi, "k--", linewidth=2, label="Linear")
axes[0, 0].set_title("Allpass Frequency Warping")
axes[0, 0].set_xlabel("Input Frequency (×π)")
axes[0, 0].set_ylabel("Warped Frequency (×π)")
axes[0, 0].grid(True)
axes[0, 0].legend()

# --------------------------------------------------
# 2) Bark scale
# --------------------------------------------------
f_hz = np.linspace(0, 20000, 1000)
bark = (
    13 * np.arctan(0.00076 * f_hz)
    + 3.5 * np.arctan((f_hz / 7500) ** 2)
)

axes[0, 1].plot(f_hz, bark)
axes[0, 1].set_title("Zwicker–Terhardt Bark Scale")
axes[0, 1].set_xlabel("Frequency (Hz)")
axes[0, 1].set_ylabel("Frequency (Bark)")
axes[0, 1].grid(True)

# --------------------------------------------------
# 3) Bark vs allpass warping
# --------------------------------------------------
fs = 32000
a_bark = 1.0674 * (2 / np.pi * np.arctan(0.6583 * fs / 1000)) ** 0.5 - 0.1916

f_norm = np.linspace(0, 1, 500)
w_rad = f_norm * np.pi
f_hz_norm = f_norm * (fs / 2)

warped_rad = -warpingphase(w_rad, a_bark)
warped_f_hz = (warped_rad / np.pi) * (fs / 2)

bark_match = (
    13 * np.arctan(0.00076 * f_hz_norm)
    + 3.5 * np.arctan((f_hz_norm / 7500) ** 2)
)

axes[1, 0].plot(
    f_hz_norm,
    bark_match / bark_match[-1],
    linewidth=2,
    label="Bark (normalized)"
)
axes[1, 0].plot(
    f_hz_norm,
    warped_f_hz / np.max(warped_f_hz),
    "--",
    linewidth=2,
    label="Allpass warping"
)
axes[1, 0].set_title(
    f"Bark vs Allpass Warping (fs={fs} Hz, a={a_bark:.3f})"
)
axes[1, 0].set_xlabel("Frequency (Hz)")
axes[1, 0].set_ylabel("Normalized Warped Frequency")
axes[1, 0].grid(True)
axes[1, 0].legend()

# --------------------------------------------------
# 4) Inverse property verification
# --------------------------------------------------
a_test = 0.7
w_test = np.linspace(0, np.pi, 200)
warped = warpingphase(w_test, a_test)
inverse = warpingphase(warped, -np.conj(a_test))

axes[1, 1].plot(
    w_test / np.pi,
    w_test / np.pi,
    "k--",
    linewidth=2,
    label="Identity"
)
axes[1, 1].plot(
    w_test / np.pi,
    inverse / np.pi,
    label="warp(a) then warp(-conj(a))"
)
axes[1, 1].set_title("Inverse Warping Property")
axes[1, 1].set_xlabel("Input Frequency (×π)")
axes[1, 1].set_ylabel("Output Frequency (×π)")
axes[1, 1].grid(True)
axes[1, 1].legend()

plt.tight_layout()

# --------------------------------------------------
# Export figure for Pyodide
# --------------------------------------------------
buf = io.BytesIO()
plt.savefig(buf, format="png", bbox_inches="tight")
plt.close()
buf.seek(0)

img_base64 = base64.b64encode(buf.read()).decode("utf-8")
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")

# --------------------------------------------------
# Console output (safe)
# --------------------------------------------------
print(f"Bark-scale allpass coefficient (fs={fs} Hz): a = {a_bark:.4f}")






`;

           

}
