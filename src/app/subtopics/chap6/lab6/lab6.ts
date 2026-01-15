import { Component } from '@angular/core';
import { Pycodechap1 } from '../../../components/python-code/pycodechap1/pycodechap1';
import { MatCardModule } from '@angular/material/card';


import { MatButtonModule } from '@angular/material/button';



@Component({
  selector: 'app-lab6',
  imports: [Pycodechap1, MatCardModule, MatButtonModule],
  templateUrl: './lab6.html',
  styleUrl: './lab6.css',
})
export class Lab6 {


chapter7example1 = `

import numpy as np
import matplotlib.pyplot as plt
import io
import base64

# -----------------------------
# Base64 helper (Pyodide-safe)
# -----------------------------
def fig_to_base64(fig):
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight")
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")

# -----------------------------
# NumPy-only FIR filtering
# -----------------------------
def lfilter_fir(b, x):
    b = np.asarray(b, float)
    x = np.asarray(x, float)
    return np.convolve(x, b, mode="full")[:len(x)]

def firwin_lowpass(numtaps, cutoff_norm):
    M = (numtaps - 1) / 2
    n = np.arange(numtaps)
    h = 2 * cutoff_norm * np.sinc(2 * cutoff_norm * (n - M))
    w = 0.54 - 0.46 * np.cos(2 * np.pi * n / (numtaps - 1))
    h *= w
    h /= np.sum(h)
    return h

# -----------------------------
# Test signal
# -----------------------------
fs = 8000
N = 512
t = np.arange(N) / fs
x = np.sin(2*np.pi*500*t) + 0.5*np.sin(2*np.pi*1200*t)

# Upsampling
L = 4
xu = np.zeros(N * L)
xu[::L] = x

h = firwin_lowpass(101, 0.5 / L)
xi = L * lfilter_fir(h, xu)

# -----------------------------
# Spectrum plot
# -----------------------------
def plot_spec(ax, s, title):
    Nfft = 2048
    S = np.fft.fftshift(np.fft.fft(s, Nfft))
    w = np.linspace(-np.pi, np.pi, Nfft, endpoint=False)
    ax.plot(w, 20*np.log10(np.abs(S) + 1e-6))
    ax.axvline(np.pi/L, linestyle="--", alpha=0.5)
    ax.axvline(-np.pi/L, linestyle="--", alpha=0.5)
    ax.set_title(title)
    ax.set_xlabel("Ω [rad/sample]")
    ax.set_ylabel("Magnitude [dB]")
    ax.grid(True, alpha=0.3)

fig, ax = plt.subplots(3, 1, figsize=(12, 9))
plot_spec(ax[0], x,  "Original (low-rate)")
plot_spec(ax[1], xu, f"After zero insertion (L={L})")
plot_spec(ax[2], xi, "After interpolation LPF")
plt.tight_layout()

# -----------------------------
# Output for browser
# -----------------------------
img_base64 = fig_to_base64(fig)
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")


`;

chapter7example2 = `

import numpy as np
import matplotlib.pyplot as plt
import io
import base64

# -----------------------------
# Base64 helper (Pyodide-safe)
# -----------------------------
def fig_to_base64(fig):
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight")
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")

# -----------------------------
# NumPy-only FIR utilities
# -----------------------------
def lfilter_fir(b, x):
    b = np.asarray(b, float)
    x = np.asarray(x, float)
    return np.convolve(x, b, mode="full")[:len(x)]

def firwin_lowpass(numtaps, cutoff_norm):
    M = (numtaps - 1) / 2
    n = np.arange(numtaps)
    h = 2 * cutoff_norm * np.sinc(2 * cutoff_norm * (n - M))
    w = 0.54 - 0.46 * np.cos(2 * np.pi * n / (numtaps - 1))
    h *= w
    h /= np.sum(h)
    return h

def spectrum(ax, s, title):
    Nfft = 4096
    S = np.fft.fftshift(np.fft.fft(s, Nfft))
    f = np.fft.fftshift(np.fft.fftfreq(Nfft))
    ax.plot(f, 20*np.log10(np.abs(S) + 1e-6))
    ax.set_title(title)
    ax.set_xlabel("Normalized Frequency")
    ax.set_ylabel("Magnitude [dB]")
    ax.set_xlim([-0.5, 0.5])
    ax.grid(True, alpha=0.3)

# -----------------------------
# Original signal
# -----------------------------
fs = 8000
t = np.arange(0, 0.5, 1/fs)
x = np.sin(2*np.pi*440*t) + 0.3*np.sin(2*np.pi*1760*t)

# Resampling ratio
L, M = 9, 8
fs_new = fs * L / M

# Upsample → LPF → Downsample
xu = np.zeros(len(x) * L)
xu[::L] = x

cutoff = 0.5 / max(L, M)
h = firwin_lowpass(151, cutoff)
xf = L * lfilter_fir(h, xu)
y = xf[::M]

# -----------------------------
# Plot
# -----------------------------
fig, ax = plt.subplots(2, 2, figsize=(14, 8))

ax[0, 0].plot(t[:200], x[:200], "o-")
ax[0, 0].set_title("Original Signal")
ax[0, 0].grid(True, alpha=0.3)

t_y = np.arange(len(y)) / fs_new
n_show = int(200 * L / M)
ax[0, 1].plot(t_y[:n_show], y[:n_show], "o-")
ax[0, 1].set_title("Resampled Signal")
ax[0, 1].grid(True, alpha=0.3)

spectrum(ax[1, 0], x, "Original Spectrum")
spectrum(ax[1, 1], y, "Resampled Spectrum")

plt.tight_layout()

# -----------------------------
# Output to browser
# -----------------------------
img_base64 = fig_to_base64(fig)
print("fs_new:", float(fs_new))
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")




`;

chapter7example3 = `
import numpy as np
import matplotlib.pyplot as plt
import io
import base64

# -----------------------------
# Base64 helper (Pyodide-safe)
# -----------------------------
def fig_to_base64(fig):
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight")
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")

# -----------------------------
# Signal
# -----------------------------
fs = 16000
t = np.arange(0, 1.0, 1/fs)
freqs = [500, 1500, 3500, 5500]
amps  = [1.0, 0.8, 0.6, 0.4]
x = sum(a*np.sin(2*np.pi*f*t) for f, a in zip(freqs, amps))

N_values = [1, 2, 4, 8, 16]
Nfft = 4096
w = np.linspace(-np.pi, np.pi, Nfft, endpoint=False)
X = np.fft.fftshift(np.fft.fft(x, Nfft))

# -----------------------------
# Plot
# -----------------------------
fig, ax = plt.subplots(len(N_values), 2, figsize=(14, 10))

for i, N in enumerate(N_values):
    x_d = x[::N]
    t_d = t[::N]

    x_ds = np.zeros_like(x)
    x_ds[::N] = x_d
    X_ds = np.fft.fftshift(np.fft.fft(x_ds, Nfft))

    # ---- Time domain ----
    ax[i, 0].plot(t[:200], x[:200], alpha=0.25, label="Original")

    n_show = min(len(x_d), 200 // N)
    ax[i, 0].stem(
        t_d[:n_show],
        x_d[:n_show],
        basefmt=" ",
        label=f"N={N}"
    )

    ax[i, 0].set_title(f"Downsample by N={N} (fs_new={fs//N} Hz)")
    ax[i, 0].grid(True, alpha=0.3)
    if i == 0:
        ax[i, 0].legend()

    # ---- Frequency domain ----
    ax[i, 1].plot(
        w, 20*np.log10(np.abs(X) + 1e-6),
        alpha=0.25, label="Original"
    )
    ax[i, 1].plot(
        w, 20*np.log10(np.abs(X_ds) + 1e-6),
        linewidth=2, label="Aliased"
    )
    ax[i, 1].axvline(np.pi/N, linestyle="--", alpha=0.6)
    ax[i, 1].axvline(-np.pi/N, linestyle="--", alpha=0.6)
    ax[i, 1].set_ylim([-60, 80])
    ax[i, 1].set_title("Spectrum (Nyquist marked)")
    ax[i, 1].grid(True, alpha=0.3)
    if i == 0:
        ax[i, 1].legend()

ax[-1, 0].set_xlabel("Time [s]")
ax[-1, 1].set_xlabel("Ω [rad/sample]")

plt.tight_layout()

# -----------------------------
# Output to browser
# -----------------------------
img_base64 = fig_to_base64(fig)
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")

`;

}
