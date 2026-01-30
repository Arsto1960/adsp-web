import { Component } from '@angular/core';
import { Pycodechap1 } from '../../../components/python-code/pycodechap1/pycodechap1';
import { MatCardModule } from '@angular/material/card';


import { MatButtonModule } from '@angular/material/button';
import { MathJaxDirective } from '../../../components/mathjax.directive';




@Component({
  selector: 'app-lab11',
  imports: [Pycodechap1, MatCardModule, MatButtonModule, MathJaxDirective],
  templateUrl: './lab11.html',
  styleUrl: './lab11.css',
})
export class Lab11 {

 chapter11example1 = `

import numpy as np
import matplotlib.pyplot as plt
import io
import base64

def fig_to_base64(fig):
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight")
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")

def show_base64_image(b64, title):
    html = f"""
    <h3>{title}</h3>
    <img src="data:image/png;base64,{b64}" />
    <hr>
    """
    print(html)

# ------------------------------------------------------------
# Hilbert transformer (ideal truncated impulse response)
# ------------------------------------------------------------
N = 41
M = (N - 1) // 2
n = np.arange(-M, M + 1)

h_hilbert = np.zeros_like(n, dtype=float)
odd = (n != 0) & (n % 2 != 0)
h_hilbert[odd] = 2.0 / (np.pi * n[odd])

# ------------------------------------------------------------
# Impulse response
# ------------------------------------------------------------
fig1 = plt.figure(figsize=(12, 4))
plt.stem(n, h_hilbert, basefmt=" ")
plt.title("Impulse Response of Hilbert Transform")
plt.xlabel("Sample Index n")
plt.ylabel("h_H(n)")
plt.grid(True)
plt.axhline(0, linewidth=0.5)
plt.tight_layout()

impulse_base64 = fig_to_base64(fig1)

# ------------------------------------------------------------
# Frequency response (manual DTFT — no SciPy)
# ------------------------------------------------------------
worN = 2048
w = np.linspace(0, np.pi, worN, endpoint=False)

E = np.exp(-1j * np.outer(w, n))
H = E @ h_hilbert

fig2, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))

ax1.plot(w / np.pi, 20 * np.log10(np.abs(H) + 1e-12))
ax1.set_title("Frequency Response of Hilbert Transform")
ax1.set_ylabel("Magnitude (dB)")
ax1.set_ylim([-50, 10])
ax1.grid(True)

ax2.plot(w / np.pi, np.angle(H))
ax2.axhline(np.pi / 2, linestyle="--", label="±90°")
ax2.axhline(-np.pi / 2, linestyle="--")
ax2.set_xlabel("Normalized Frequency (×π rad/sample)")
ax2.set_ylabel("Phase (rad)")
ax2.grid(True)
ax2.legend()

plt.tight_layout()

freq_base64 = fig_to_base64(fig2)

# ------------------------------------------------------------
# DISPLAY OUTPUT (PURE PYODIDE)
# ------------------------------------------------------------
show_base64_image(impulse_base64, "Hilbert Transform – Impulse Response")
show_base64_image(freq_base64, "Hilbert Transform – Frequency Response")




`;

           
chapter11example2 = `
import numpy as np
import matplotlib.pyplot as plt
import io
import base64

# -------------------------------------------------
# Base64 helpers (Pyodide-safe)
# -------------------------------------------------
def fig_to_base64(fig):
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight")
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")

def show_base64_image(b64, title):
    html = f"""
    <h3>{title}</h3>
    <img src="data:image/png;base64,{b64}" />
    <hr>
    """
    print(html)

# -------------------------------------------------
# Hilbert helpers (NO SciPy)
# -------------------------------------------------
def hilbert_analytic_signal(x):
    x = np.asarray(x)
    N = x.size
    X = np.fft.fft(x)

    H = np.zeros(N)
    H[0] = 1.0
    if N % 2 == 0:
        H[N // 2] = 1.0
        H[1:N // 2] = 2.0
    else:
        H[1:(N + 1) // 2] = 2.0

    return np.fft.ifft(X * H)

def fir_hilbert_transformer_odd(N_filt):
    if N_filt % 2 == 0:
        raise ValueError("N_filt must be odd")
    M = (N_filt - 1) // 2
    n = np.arange(-M, M + 1)

    h = np.zeros_like(n, dtype=float)
    odd = (n != 0) & (n % 2 != 0)
    h[odd] = 2.0 / (np.pi * n[odd])
    return h

# -------------------------------------------------
# Test signal
# -------------------------------------------------
fs = 1000
f0 = 50
t = np.linspace(0, 1.0, fs, endpoint=False)
x = np.cos(2 * np.pi * f0 * t)

# Manual FIR Hilbert
N_filt = 51
h_hilb = fir_hilbert_transformer_odd(N_filt)
x_h = np.convolve(x, h_hilb, mode="same")
xa_manual = x + 1j * x_h

# FFT-based Hilbert
xa_fft = hilbert_analytic_signal(x)

# Spectra
freqs = np.fft.fftfreq(len(x), 1 / fs)
half = freqs >= 0

X = np.fft.fft(x)
X_man = np.fft.fft(xa_manual)
X_fft = np.fft.fft(xa_fft)

# -------------------------------------------------
# Plot
# -------------------------------------------------
fig, axes = plt.subplots(3, 2, figsize=(14, 10))

axes[0, 0].plot(t[:200], x[:200])
axes[0, 0].set_title("Original Signal x(t)")
axes[0, 0].grid(True)

axes[1, 0].plot(t[:200], x[:200], label="Real")
axes[1, 0].plot(t[:200], x_h[:200], label="Imag (FIR)")
axes[1, 0].set_title("Manual Analytic Signal (FIR)")
axes[1, 0].grid(True)
axes[1, 0].legend()

axes[2, 0].plot(t[:200], xa_fft.real[:200], label="Real")
axes[2, 0].plot(t[:200], xa_fft.imag[:200], label="Imag (FFT)")
axes[2, 0].set_title("FFT-Based Analytic Signal")
axes[2, 0].grid(True)
axes[2, 0].legend()

axes[0, 1].stem(freqs[half], np.abs(X)[half], basefmt=" ")
axes[0, 1].set_title("Original Spectrum")
axes[0, 1].set_xlim(0, 500)
axes[0, 1].grid(True)

axes[1, 1].stem(freqs[half], np.abs(X_man)[half], basefmt=" ")
axes[1, 1].set_title("Manual Analytic Spectrum")
axes[1, 1].set_xlim(0, 500)
axes[1, 1].grid(True)

axes[2, 1].stem(freqs[half], np.abs(X_fft)[half], basefmt=" ")
axes[2, 1].set_title("FFT Analytic Spectrum")
axes[2, 1].set_xlim(0, 500)
axes[2, 1].grid(True)

plt.tight_layout()

# -------------------------------------------------
# Convert + Display
# -------------------------------------------------
plot_base64 = fig_to_base64(fig)
show_base64_image(plot_base64, "Hilbert Transform – Analytic Signal Comparison")



`;

           
chapter11example3 = `
import numpy as np
import matplotlib.pyplot as plt
import io
import base64

# -------------------------------------------------
# Base64 helpers (Pyodide-safe)
# -------------------------------------------------
def fig_to_base64(fig):
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight")
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")

def show_base64_image(b64, title):
    html = f"""
    <h3>{title}</h3>
    <img src="data:image/png;base64,{b64}" />
    <hr>
    """
    print(html)

# -------------------------------------------------
# FFT-based Hilbert transform (SciPy replacement)
# -------------------------------------------------
def hilbert_analytic_signal(x):
    x = np.asarray(x)
    N = x.size
    X = np.fft.fft(x)

    H = np.zeros(N)
    H[0] = 1.0
    if N % 2 == 0:
        H[N // 2] = 1.0
        H[1:N // 2] = 2.0
    else:
        H[1:(N + 1) // 2] = 2.0

    return np.fft.ifft(X * H)

# -------------------------------------------------
# AM signal
# -------------------------------------------------
fs = 8000
t = np.linspace(0, 1.0, fs, endpoint=False)

f_carrier = 1000
f_mod = 5
m = 0.8

A_t = 1 + m * np.cos(2 * np.pi * f_mod * t)
x = A_t * np.cos(2 * np.pi * f_carrier * t)

# Analytic signal
xa = hilbert_analytic_signal(x)
amp = np.abs(xa)
phase = np.unwrap(np.angle(xa))
inst_freq = np.diff(phase) * fs / (2 * np.pi)

# -------------------------------------------------
# Plots
# -------------------------------------------------
fig, axes = plt.subplots(4, 1, figsize=(14, 12))

axes[0].plot(t[:2000], x[:2000], alpha=0.7, label="AM signal")
axes[0].plot(t[:2000], amp[:2000], linewidth=2, label="Extracted envelope")
axes[0].plot(t[:2000], A_t[:2000], "--", linewidth=2, label="True envelope")
axes[0].set_title("AM Signal and Instantaneous Amplitude")
axes[0].set_ylabel("Amplitude")
axes[0].grid(True)
axes[0].legend()

axes[1].plot(t[:400], x[:400], alpha=0.7, label="AM signal")
axes[1].plot(t[:400], amp[:400], linewidth=2, label="Extracted envelope")
axes[1].plot(t[:400], A_t[:400], "--", linewidth=2, label="True envelope")
axes[1].set_title("Zoomed View")
axes[1].set_ylabel("Amplitude")
axes[1].grid(True)
axes[1].legend()

axes[2].plot(t[:2000], phase[:2000])
axes[2].set_title("Instantaneous Phase")
axes[2].set_ylabel("Phase (rad)")
axes[2].grid(True)

axes[3].plot(t[1:2000], inst_freq[:1999])
axes[3].axhline(f_carrier, linestyle="--", label=f"Carrier = {f_carrier} Hz")
axes[3].set_title("Instantaneous Frequency")
axes[3].set_xlabel("Time (s)")
axes[3].set_ylabel("Frequency (Hz)")
axes[3].set_ylim([f_carrier - 50, f_carrier + 50])
axes[3].grid(True)
axes[3].legend()

plt.tight_layout()

# -------------------------------------------------
# Convert + display
# -------------------------------------------------
plot_base64 = fig_to_base64(fig)
show_base64_image(plot_base64, "AM Envelope Detection using Hilbert Transform")

# -------------------------------------------------
# Numeric output
# -------------------------------------------------
envelope_error = float(np.mean(np.abs(amp - A_t)))
print(f"<b>Mean envelope error:</b> {envelope_error:.6f}")


`;

           
chapter11example4 = `
import numpy as np
import matplotlib.pyplot as plt
import io
import base64

# -------------------------------------------------
# Base64 helpers (Pyodide-safe)
# -------------------------------------------------
def fig_to_base64(fig):
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight")
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")

def show_image(b64, title):
    html = f"""
    <h3>{title}</h3>
    <img src="data:image/png;base64,{b64}">
    <hr>
    """
    print(html)

# -------------------------------------------------
# Pyodide-safe replacements (no SciPy)
# -------------------------------------------------
def fir_hilbert_transformer_odd(N):
    if N % 2 == 0:
        raise ValueError("N must be odd.")
    M = (N - 1) // 2
    n = np.arange(-M, M + 1)
    h = np.zeros_like(n, dtype=float)
    odd = (n != 0) & (n % 2 != 0)
    h[odd] = 2.0 / (np.pi * n[odd])
    return h

def freqz_numpy(b, worN=2048, whole=False):
    b = np.asarray(b)
    N = b.size
    if whole:
        w = np.linspace(0, 2*np.pi, worN, endpoint=False)
    else:
        w = np.linspace(0, np.pi, worN, endpoint=False)
    n = np.arange(N)
    H = np.exp(-1j * np.outer(w, n)) @ b
    return w, H

# -------------------------------------------------
# Complex analytic-signal FIR: δ + j·Hilbert
# -------------------------------------------------
N = 41
h_hilb = fir_hilbert_transformer_odd(N)

delay = N // 2
delta = np.zeros(N)
delta[delay] = 1.0

h_complex = delta + 1j * h_hilb

print("Filter length:", len(h_complex))
print("First 10 coefficients:")
print(h_complex[:10])

# -------------------------------------------------
# Coefficient plots
# -------------------------------------------------
fig1, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 7))

ax1.stem(h_complex.real, basefmt=" ")
ax1.set_title("Real Part (Delay)")
ax1.grid(True)

ax2.stem(h_complex.imag, basefmt=" ")
ax2.set_title("Imaginary Part (Hilbert)")
ax2.grid(True)

plt.tight_layout()
coeffs_b64 = fig_to_base64(fig1)

# -------------------------------------------------
# Frequency response (0 … 2π)
# -------------------------------------------------
w, H = freqz_numpy(h_complex, whole=True)
mag_db = 20 * np.log10(np.abs(H) + 1e-12)

fig2, (bx1, bx2) = plt.subplots(2, 1, figsize=(12, 7))

bx1.plot(w, mag_db)
bx1.axvline(np.pi, linestyle="--", label="π")
bx1.axvspan(0, np.pi, alpha=0.2, label="Positive freqs")
bx1.axvspan(np.pi, 2*np.pi, alpha=0.2, label="Negative freqs")
bx1.set_title("Magnitude Response")
bx1.set_ylabel("dB")
bx1.set_ylim([-50, 10])
bx1.legend()
bx1.grid(True)

bx2.plot(w, np.angle(H))
bx2.axvline(np.pi, linestyle="--")
bx2.set_title("Phase Response")
bx2.set_ylabel("rad")
bx2.set_xlabel("rad/sample")
bx2.grid(True)

plt.tight_layout()
freq_b64 = fig_to_base64(fig2)

# -------------------------------------------------
# Pass / stop summaries
# -------------------------------------------------
pos = (w <= np.pi)
neg = (w > np.pi)

pass_summary = {
    "mean_gain_db": float(np.mean(mag_db[pos])),
    "min_gain_db": float(np.min(mag_db[pos])),
    "max_gain_db": float(np.max(mag_db[pos])),
}

stop_summary = {
    "mean_gain_db": float(np.mean(mag_db[neg])),
    "max_gain_db": float(np.max(mag_db[neg])),
}

# -------------------------------------------------
# DISPLAY (THIS IS THE KEY PART)
# -------------------------------------------------
show_image(coeffs_b64, "Complex Analytic FIR Coefficients")
show_image(freq_b64, "Analytic Signal Frequency Response")

print("<b>Passband (0 → π)</b>")
print(pass_summary)

print("<b>Stopband (π → 2π)</b>")
print(stop_summary)




`;

}
