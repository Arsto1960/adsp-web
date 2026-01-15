import { Component } from '@angular/core';
import { Pycodechap1 } from '../../../components/python-code/pycodechap1/pycodechap1';
import { MatCardModule } from '@angular/material/card';


import { MatButtonModule } from '@angular/material/button';



@Component({
  selector: 'app-lab3',
  imports: [Pycodechap1, MatCardModule, MatButtonModule],
  templateUrl: './lab3.html',
  styleUrl: './lab3.css',
})
export class Lab3 {
chapter3example1 = `

import numpy as np
import matplotlib
matplotlib.use("Agg")  # Pyodide-safe backend
import matplotlib.pyplot as plt
import io, base64

# --- helpers ---
def uniform_quantizer_midtread(x, bits, xmax=1.0):
    L = 2**bits
    delta = 2 * xmax / L
    x_clip = np.clip(x, -xmax, xmax - delta)  # avoid hitting top edge
    xq = delta * np.round(x_clip / delta)
    return xq, delta

def compute_snr(x, xq):
    e = x - xq
    sp = np.mean(x**2)
    npow = np.mean(e**2)
    snr = 10 * np.log10(sp / (npow + 1e-15))
    return snr, sp, npow

def theoretical_snr_sine(bits):
    return 6.02 * bits + 1.76

# --- signal setup ---
fs = 48000
t = np.arange(0, 1.0, 1/fs) * 2*np.pi*1000  # 1 kHz sine phase argument

bits = 8
backoff_factors = [1, 2, 4, 8, 16]
theory_full = theoretical_snr_sine(bits)

results = []
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# --- measure SNR for different backoffs ---
for backoff in backoff_factors:
    amp = 1.0 / backoff
    x = amp * np.sin(t)
    xq, _ = uniform_quantizer_midtread(x, bits)
    snr_db, _, _ = compute_snr(x, xq)
    backoff_db = 20 * np.log10(backoff)
    theory = theory_full - backoff_db
    results.append((backoff, amp, backoff_db, snr_db, theory, theory_full - snr_db))

# --- print table ---
print("="*90)
print(f"{'Backoff':<10} {'Amplitude':<12} {'Backoff (dB)':<15} {'Measured SNR':<15} {'Theoretical':<15} {'SNR Loss':<12}")
print("="*90)
for b, amp, bdb, snr, th, loss in results:
    print(f"{b:<10} {amp:<12.4f} {bdb:<15.2f} {snr:<15.2f} {th:<15.2f} {loss:<12.2f}")
print("="*90)

# --- plots: SNR vs backoff + loss vs factor ---
bdb_list = [r[2] for r in results]
snr_list = [r[3] for r in results]
th_list  = [r[4] for r in results]
loss_list = [r[5] for r in results]
b_list = [r[0] for r in results]

axes[0, 0].plot(bdb_list, snr_list, "o-", label="Measured", linewidth=2, markersize=8)
axes[0, 0].plot(bdb_list, th_list, "s--", label="Theoretical", linewidth=2, markersize=8)
axes[0, 0].set_title("SNR vs. Signal Backoff")
axes[0, 0].set_xlabel("Backoff (dB)")
axes[0, 0].set_ylabel("SNR (dB)")
axes[0, 0].grid(True, alpha=0.3)
axes[0, 0].invert_xaxis()
axes[0, 0].legend()

axes[0, 1].plot(b_list, loss_list, "o-", linewidth=2, markersize=8)
axes[0, 1].set_title("SNR Loss vs. Backoff Factor")
axes[0, 1].set_xlabel("Backoff Factor")
axes[0, 1].set_ylabel("SNR Loss (dB)")
axes[0, 1].set_xscale("log", base=2)
axes[0, 1].grid(True, alpha=0.3, which="both")

# --- show waveforms for 1x, 4x, 16x backoff ---
for idx, backoff in enumerate([1, 4, 16]):
    amp = 1.0 / backoff
    x = amp * np.sin(t[:1000])
    xq, _ = uniform_quantizer_midtread(x, bits)
    ax = axes[1, 0] if idx < 2 else axes[1, 1]
    ax.plot(x, linewidth=1, alpha=0.8, label=f"Backoff {backoff}x")
    if idx == 0:
        ax.plot(xq, linewidth=1, alpha=0.8, label="Quantized")
    ax.set_ylim([-1.1, 1.1])
    ax.axhline(0, linewidth=0.5, alpha=0.3)
    ax.grid(True, alpha=0.3)
    ax.legend()

axes[1, 0].set_title("Full Scale vs. 4x Backoff")
axes[1, 0].set_xlabel("Sample")
axes[1, 0].set_ylabel("Amplitude")
axes[1, 1].set_title("16x Backoff (Severe)")
axes[1, 1].set_xlabel("Sample")

plt.tight_layout()

# --- Pyodide-safe: save plot to base64 ---
buf = io.BytesIO()
plt.savefig(buf, format="png", bbox_inches="tight")
plt.close()
buf.seek(0)
img_base64 = base64.b64encode(buf.read()).decode("utf-8")
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")




`;
chapter3example2 = `
import numpy as np
import matplotlib
matplotlib.use("Agg")  # Pyodide-friendly backend
import matplotlib.pyplot as plt
import io, base64

# --- helpers ---
def uniform_quantizer_midtread(x, bits, xmax=1.0):
    L = 2**bits
    delta = 2 * xmax / L
    x_clip = np.clip(x, -xmax, xmax - delta)
    xq = delta * np.round(x_clip / delta)
    return xq, delta

def mu_law_quantizer(x, bits, mu=255.0, xmax=1.0):
    x_n = np.clip(x / xmax, -1, 1)
    y = np.sign(x_n) * np.log1p(mu * np.abs(x_n)) / np.log1p(mu)
    yq, delta = uniform_quantizer_midtread(y, bits, xmax=1.0)
    xq = np.sign(yq) * (1.0 / mu) * ((1 + mu) ** np.abs(yq) - 1)
    return xq * xmax, delta, yq

def compute_snr(x, xq):
    e = x - xq
    sp = np.mean(x**2)
    npow = np.mean(e**2)
    snr = 10 * np.log10(sp / (npow + 1e-15))
    return snr, sp, npow

# --- test settings ---
amplitudes = np.logspace(-2, 0, 20)  # 0.01 .. 1.0
bits = 6
fs = 44100
f0 = 440
t = np.arange(fs) / fs
sine = np.sin(2 * np.pi * f0 * t)

snr_uniform = []
snr_mulaw = []

# --- run experiment ---
for amp in amplitudes:
    x = amp * sine
    xq_u, _ = uniform_quantizer_midtread(x, bits)
    snr_u, _, _ = compute_snr(x, xq_u)
    snr_uniform.append(snr_u)
    xq_m, _, _ = mu_law_quantizer(x, bits)
    snr_m, _, _ = compute_snr(x, xq_m)
    snr_mulaw.append(snr_m)

snr_uniform = np.array(snr_uniform)
snr_mulaw = np.array(snr_mulaw)
amp_db = 20 * np.log10(amplitudes)
improve = snr_mulaw - snr_uniform

# --- plots ---
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

axes[0].plot(amp_db, snr_uniform, "o-", label="Uniform", linewidth=2, markersize=6)
axes[0].plot(amp_db, snr_mulaw, "s-", label="μ-law", linewidth=2, markersize=6)
axes[0].set_title("SNR vs. Signal Amplitude")
axes[0].set_xlabel("Signal Amplitude (dB re: full scale)")
axes[0].set_ylabel("SNR (dB)")
axes[0].grid(True, alpha=0.3)
axes[0].legend()

axes[1].plot(amp_db, improve, "o-", linewidth=2, markersize=6)
axes[1].axhline(0, linestyle="--", linewidth=1, alpha=0.6)
axes[1].set_title("μ-law Advantage Over Uniform")
axes[1].set_xlabel("Signal Amplitude (dB re: full scale)")
axes[1].set_ylabel("SNR Improvement (dB)")
axes[1].grid(True, alpha=0.3)

plt.tight_layout()

# --- Pyodide-friendly: save figure to base64 ---
buf = io.BytesIO()
plt.savefig(buf, format="png", bbox_inches="tight")
plt.close()
buf.seek(0)
img_base64 = base64.b64encode(buf.read()).decode("utf-8")
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")

# --- report best improvement ---
best_i = np.argmax(improve)
print(f"Maximum μ-law advantage: {improve[best_i]:.2f} dB")
print(f"Occurs at amplitude: {amplitudes[best_i]:.4f} ({amp_db[best_i]:.2f} dB)")
print(f"Key Observation: At full scale: μ-law improvement ≈ {improve[-1]:.2f} dB")
print(f"At low levels: μ-law improvement ≈ {improve[0]:.2f} dB")






`;
chapter3example3 = `

import numpy as np
import matplotlib
matplotlib.use("Agg")  # Pyodide-friendly backend
import matplotlib.pyplot as plt
import io, base64

# --- helpers ---
def uniform_quantizer_midtread(x, bits, xmax=1.0):
    L = 2**bits
    delta = 2 * xmax / L
    x_clip = np.clip(x, -xmax, xmax - delta)
    xq = delta * np.round(x_clip / delta)
    return xq, delta

def compute_snr(x, xq):
    e = x - xq
    sp = np.mean(x**2)
    npow = np.mean(e**2)
    return 10*np.log10(sp / (npow + 1e-15)), sp, npow

def theoretical_snr_uniform(bits):
    return 6.02 * bits  # common rule-of-thumb for uniform full-scale signals

def linregress_np(x, y):
    x = np.asarray(x)
    y = np.asarray(y)
    xm = x.mean()
    ym = y.mean()
    sxx = np.sum((x - xm)**2)
    sxy = np.sum((x - xm) * (y - ym))
    slope = sxy / sxx
    intercept = ym - slope * xm
    yhat = slope * x + intercept
    r2 = 1 - np.sum((y - yhat)**2) / np.sum((y - ym)**2)
    return slope, intercept, r2

# --- Monte Carlo setup ---
num_trials = 100
bit_range = range(2, 11)
Nsig = 10000

mean_snr, std_snr, theory = [], [], []

for bits in bit_range:
    snrs = []
    for _ in range(num_trials):
        x = np.random.uniform(-1, 1, Nsig)
        xq, _ = uniform_quantizer_midtread(x, bits)
        snr_db, _, _ = compute_snr(x, xq)
        snrs.append(snr_db)
    mean_snr.append(np.mean(snrs))
    std_snr.append(np.std(snrs))
    theory.append(theoretical_snr_uniform(bits))

mean_snr = np.array(mean_snr)
std_snr = np.array(std_snr)
theory = np.array(theory)
bits_list = np.array(list(bit_range))
err = mean_snr - theory

# --- plots ---
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

axes[0].errorbar(bits_list, mean_snr, yerr=std_snr, fmt="o", capsize=5, label="Monte Carlo (mean ± std)")
axes[0].plot(bits_list, theory, "s-", label="Theoretical (6.02N)")
axes[0].set_title("SNR vs Bits (Monte Carlo Verification)")
axes[0].set_xlabel("Number of Bits (N)")
axes[0].set_ylabel("SNR (dB)")
axes[0].grid(True, alpha=0.3)
axes[0].legend()

axes[1].plot(bits_list, err, "o-", linewidth=2)
axes[1].axhline(0, linestyle="--", alpha=0.6)
axes[1].set_title("Error from Theoretical")
axes[1].set_xlabel("Number of Bits (N)")
axes[1].set_ylabel("Error (dB)")
axes[1].grid(True, alpha=0.3)

plt.tight_layout()

# --- Pyodide-friendly: save figure to base64 ---
buf = io.BytesIO()
plt.savefig(buf, format="png", bbox_inches="tight")
plt.close()
buf.seek(0)
img_base64 = base64.b64encode(buf.read()).decode("utf-8")
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")

# --- table ---
print("=" * 70)
print(f"{'Bits':<6} {'Mean SNR (dB)':<15} {'Theoretical':<15} {'Std Dev':<12} {'Error':<10}")
print("=" * 70)
for i, b in enumerate(bits_list):
    print(f"{b:<6} {mean_snr[i]:<15.2f} {theory[i]:<15.2f} {std_snr[i]:<12.3f} {err[i]:<10.3f}")
print("=" * 70)

# --- regression ---
slope, intercept, r2 = linregress_np(bits_list, mean_snr)
print("Linear Regression:")
print(f"Measured slope: {slope:.3f} dB/bit")
print(f"Expected slope: 6.020 dB/bit")
print(f"Error: {abs(slope - 6.02):.3f} dB/bit")
print(f"R² value: {r2:.6f}")






`;

}
