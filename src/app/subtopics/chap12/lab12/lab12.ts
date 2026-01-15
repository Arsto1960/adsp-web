import { Component } from '@angular/core';
import { Pycodechap1 } from '../../../components/python-code/pycodechap1/pycodechap1';
import { MatCardModule } from '@angular/material/card';


import { MatButtonModule } from '@angular/material/button';




@Component({
  selector: 'app-lab12',
  imports: [Pycodechap1, MatCardModule, MatButtonModule],
  templateUrl: './lab12.html',
  styleUrl: './lab12.css',
})
export class Lab12 {
 chapter12example1 = `
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
# NumPy-only replacements (no SciPy)
# -----------------------------
def lfilter_fir(b, x):
    """FIR-only lfilter replacement (a=1)"""
    b = np.asarray(b)
    x = np.asarray(x)
    return np.convolve(x, b, mode="full")[:len(x)]

def freqz_numpy(b, worN=512, whole=False):
    """NumPy-only frequency response"""
    b = np.asarray(b)
    N = b.size
    if whole:
        w = np.linspace(0.0, 2*np.pi, worN, endpoint=False)
    else:
        w = np.linspace(0.0, np.pi, worN, endpoint=False)
    n = np.arange(N)
    E = np.exp(-1j * np.outer(w, n))
    H = E @ b
    return w, H

# -----------------------------
# Synthetic signal
# -----------------------------
fs = 8000
t = np.arange(0, 2.0, 1/fs)
x = 0.6*np.sin(2*np.pi*200*t) + 0.3*np.sin(2*np.pi*400*t) + 0.1*np.sin(2*np.pi*800*t)
x = x / np.max(np.abs(x))

# Add white noise (SNR = 10 dB)
snr_db = 10
sig_pow = np.mean(x**2)
noise_pow = sig_pow / (10**(snr_db/10))
v = np.sqrt(noise_pow) * np.random.randn(len(x))
y = x + v

# -----------------------------
# Wiener filter (FIR length L)
# -----------------------------
L = 12
d = x[L-1:]
A = np.column_stack([y[L-1-k:len(y)-k] for k in range(L)])
h = np.linalg.lstsq(A, d, rcond=None)[0]

# Apply filter
x_hat = lfilter_fir(h, y)

# MSE metrics
mse_noisy = float(np.mean((y - x)**2))
mse_denoised = float(np.mean((x_hat - x)**2))
print(f"MSE (noisy):    {mse_noisy:.6f}")
print(f"MSE (denoised): {mse_denoised:.6f}")

# -----------------------------
# Plots
# -----------------------------
w, H = freqz_numpy(h, worN=512)

fig, ax = plt.subplots(3, 1, figsize=(12, 9))

ax[0].stem(h, basefmt=" ")
ax[0].set_title("Wiener Filter Impulse Response")
ax[0].grid(True)

ax[1].plot(w/np.pi, 20*np.log10(np.abs(H)+1e-12))
ax[1].set_title("Wiener Filter Magnitude Response")
ax[1].set_ylabel("Magnitude (dB)")
ax[1].grid(True)

ax[2].plot(x[:800], label="Original")
ax[2].plot(y[:800], alpha=0.6, label="Noisy")
ax[2].plot(x_hat[:800], label="Denoised")
ax[2].set_title("Signal Comparison (first 800 samples)")
ax[2].grid(True)
ax[2].legend()

plt.tight_layout()

# Convert figure to base64
plot_base64 = fig_to_base64(fig)

# -----------------------------
# Output
# -----------------------------
print("__IMAGE_START__" + plot_base64 + "__IMAGE_END__")
print("MSE (noisy):", mse_noisy)
print("MSE (denoised):", mse_denoised)
print("Filter coefficients:", h)



`;

           
chapter12example2 = `
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
# Pyodide-safe linear chirp
# -----------------------------
def chirp_linear(t, f0, f1, t1):
    k = (f1 - f0) / t1
    phase = 2 * np.pi * (f0 * t + 0.5 * k * t**2)
    return np.cos(phase)

# -----------------------------
# Generate signal + embed in noise
# -----------------------------
t = np.linspace(0, 1, 100, endpoint=False)
x = chirp_linear(t, f0=1, f1=10, t1=1)

noise_length = 10000
v = 0.2 * (np.random.random(noise_length) - 0.5)

true_pos = int(np.random.randint(100, noise_length - len(x) - 100))
v[true_pos:true_pos + len(x)] += x

# Matched filter (time-reversed signal)
h = x[::-1]
y = np.convolve(v, h, mode="full")

peak = int(np.argmax(np.abs(y)))
est_pos = peak - (len(x) - 1)
err_samples = int(est_pos - true_pos)

print("True position:", true_pos)
print("Estimated position:", est_pos)
print("Error (samples):", err_samples)

# -----------------------------
# Plotting
# -----------------------------
fig, axes = plt.subplots(3, 1, figsize=(12, 9))

axes[0].plot(v, linewidth=1)
axes[0].axvline(true_pos, linestyle="--", label="True start")
axes[0].set_title("Noisy signal with embedded chirp")
axes[0].grid(True)
axes[0].legend()

axes[1].plot(y, linewidth=1)
axes[1].axvline(peak, linestyle="--", label="Peak")
axes[1].set_title("Matched filter output")
axes[1].grid(True)
axes[1].legend()

zoom = 300
start = max(0, est_pos - zoom)
end = min(len(v), est_pos + len(x) + zoom)
axes[2].plot(np.arange(start, end), v[start:end], linewidth=1)
axes[2].axvline(true_pos, linestyle="--", label="True start")
axes[2].axvline(est_pos, linestyle="--", label="Estimated start")
axes[2].set_title("Zoom around detected region")
axes[2].grid(True)
axes[2].legend()

plt.tight_layout()

# Convert figure to base64
plot_base64 = fig_to_base64(fig)

# -----------------------------
# Print base64 + key values
# -----------------------------
print("__IMAGE_START__" + plot_base64 + "__IMAGE_END__")
print("True position:", true_pos)
print("Estimated position:", est_pos)
print("Error (samples):", err_samples)




`;

           
chapter12example3 = `
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
# Sinusoidal signal
# -----------------------------
Omega = 0.3 * np.pi
n = np.arange(1000)
x = np.sin(Omega * n + 0.5)

# Theoretical AR(2) predictor for a pure sinusoid:
a_theory = np.array([2 * np.cos(Omega), -1.0])
print("Theoretical coefficients:", a_theory)

# Least-squares estimate from data
p = 2
y = x[p:]  # x[n]
X = np.column_stack([x[p-1:-1], x[p-2:-2]])  # [x[n-1], x[n-2]]

a_hat = np.linalg.lstsq(X, y, rcond=None)[0]
print("Estimated coefficients:", a_hat)
print("Difference (est - theory):", a_hat - a_theory)

# Prediction and error
x_pred = np.zeros_like(x)
x_pred[p:] = X @ a_hat
err = x - x_pred
mse = float(np.mean(err[p:] ** 2))
print("MSE (prediction error):", mse)

# -----------------------------
# Plots (base64)
# -----------------------------
fig, axes = plt.subplots(2, 1, figsize=(12, 7))

axes[0].plot(x[:200], label="True x[n]")
axes[0].plot(x_pred[:200], "--", label="Predicted")
axes[0].set_title("AR(2) One-step Prediction")
axes[0].grid(True)
axes[0].legend()

axes[1].plot(err[:200])
axes[1].set_title("Prediction Error e[n] = x[n] - x̂[n]")
axes[1].set_xlabel("n")
axes[1].grid(True)

plt.tight_layout()
plot_base64 = fig_to_base64(fig)

# -----------------------------
# Print base64 + numeric outputs
# -----------------------------
print("__IMAGE_START__" + plot_base64 + "__IMAGE_END__")
print("Theoretical AR coefficients:", a_theory)
print("Estimated AR coefficients:", a_hat)
print("Coefficient difference:", a_hat - a_theory)
print("Prediction MSE:", mse)


`;

           
chapter12example4 = `
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
# FIR/IIR lfilter replacement
# -----------------------------
def lfilter_iir(b, a, x):
    b = np.asarray(b, dtype=float)
    a = np.asarray(a, dtype=float)
    x = np.asarray(x, dtype=float)
    b = b / a[0]
    a = a / a[0]

    y = np.zeros_like(x)
    nb = b.size
    na = a.size

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

# -----------------------------
# Toeplitz solver
# -----------------------------
def solve_toeplitz_numpy(c, b):
    c = np.asarray(c, dtype=float)
    b = np.asarray(b, dtype=float)
    p = c.size
    T = np.empty((p, p), dtype=float)
    for i in range(p):
        for j in range(p):
            T[i, j] = c[abs(i - j)]
    return np.linalg.solve(T, b)

# -----------------------------
# Demo signal (replace with real audio in Pyodide)
# -----------------------------
fs = 8000
t = np.arange(0, 2.0, 1/fs)
x = 0.6*np.sin(2*np.pi*200*t) + 0.25*np.sin(2*np.pi*400*t) + 0.1*np.random.randn(len(t))
x = x / np.max(np.abs(x))

# LPC parameters
p = 12
frame_len = 240
num_frames = len(x) // frame_len

A = np.zeros((num_frames, p + 1))
residual = np.zeros(num_frames * frame_len)

def autocorr_frame(s, p):
    r = np.correlate(s, s, mode="full")
    mid = len(r) // 2
    return r[mid:mid + p + 1]

# -----------------------------
# LPC analysis per frame
# -----------------------------
for k in range(num_frames):
    s = x[k*frame_len:(k+1)*frame_len]
    s = s - np.mean(s)
    r = autocorr_frame(s, p)
    c = r[:-1]
    rhs = -r[1:]
    a = solve_toeplitz_numpy(c, rhs)
    Ak = np.r_[1.0, a]
    A[k] = Ak
    residual[k*frame_len:(k+1)*frame_len] = lfilter_iir(Ak, [1.0], s)

# -----------------------------
# LPC synthesis
# -----------------------------
x_rec = np.zeros_like(residual)
for k in range(num_frames):
    e = residual[k*frame_len:(k+1)*frame_len]
    Ak = A[k]
    x_rec[k*frame_len:(k+1)*frame_len] = lfilter_iir([1.0], Ak, e)

# -----------------------------
# SNR
# -----------------------------
x_ref = x[:len(x_rec)]
err = x_ref - x_rec
snr_db = float(10 * np.log10(np.sum(x_ref**2) / (np.sum(err**2) + 1e-12)))
print(f"SNR (reconstruction): {snr_db:.2f} dB")

# -----------------------------
# Plot -> base64
# -----------------------------
Nshow = min(2000, len(x_rec))
fig = plt.figure(figsize=(12, 5))
plt.plot(x_ref[:Nshow], label="Original", alpha=0.7)
plt.plot(x_rec[:Nshow], label="Reconstructed", alpha=0.7)
plt.title("LPC Analysis/Synthesis: Original vs Reconstructed")
plt.grid(True)
plt.legend()
plt.tight_layout()

plot_base64 = fig_to_base64(fig)

# -----------------------------
# Print base64 + key outputs
# -----------------------------
print("__IMAGE_START__" + plot_base64 + "__IMAGE_END__")
print("SNR (dB):", snr_db)
print("LPC Coefficients shape:", A.shape)
print("Residual shape:", residual.shape)





`;
}
