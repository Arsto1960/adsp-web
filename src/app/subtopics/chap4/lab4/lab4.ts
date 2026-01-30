import { Component } from '@angular/core';
import { Pycodechap1 } from '../../../components/python-code/pycodechap1/pycodechap1';
import { MatCardModule } from '@angular/material/card';


import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-lab4',
  imports: [Pycodechap1, MatCardModule, MatButtonModule],
  templateUrl: './lab4.html',
  styleUrl: './lab4.css',
})
export class Lab4 {
  
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

# Uniform signal in [0, 1)
np.random.seed(42)
N = 10000
x = np.random.rand(N)

def uniform_quantizer(x, M, x_min=0.0, x_max=1.0):
    """Uniform mid-rise quantizer with M levels in [x_min, x_max)."""
    delta = (x_max - x_min) / M
    idx = np.clip(((x - x_min) / delta).astype(int), 0, M - 1)
    levels = x_min + (idx + 0.5) * delta   # quantized output per sample
    y = x_min + (np.arange(M) + 0.5) * delta  # quantization levels
    boundaries = x_min + np.arange(M + 1) * delta
    return levels, y, boundaries

M_values = [2, 4, 8, 16]
mse_by_M = {}

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
axes = axes.ravel()

for ax, M in zip(axes, M_values):
    x_q, y, _ = uniform_quantizer(x, M)
    mse = float(np.mean((x - x_q) ** 2))
    mse_by_M[M] = mse

    ax.hist(x, bins=50, alpha=0.5, density=True, label="Original")
    ax.hist(x_q, bins=M, alpha=0.7, density=True, label="Quantized")

    for level in y:
        ax.axvline(level, linestyle="--", alpha=0.5)

    ax.set_title(f"M={M} levels, MSE={mse:.6f}")
    ax.set_xlabel("Value")
    ax.set_ylabel("Density")
    ax.grid(True, alpha=0.3)
    ax.legend()

plt.tight_layout()




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

def lloyd_max_uniform(M, x_min=0.0, x_max=1.0, max_iter=50, tol=1e-8):
    """
    Lloyd–Max for a UNIFORM pdf on [x_min, x_max].
    Pyodide-friendly: no quad/integration, centroid has closed form.
    Returns: levels y, boundaries b, history
    """
    rng = np.random.default_rng(42)
    y = np.linspace(x_min, x_max, M + 2)[1:-1] + rng.normal(0, (x_max-x_min)/(20*M), M)

    b = np.empty(M + 1)
    b[0], b[-1] = x_min, x_max
    hist = []

    for _ in range(max_iter):
        y_old = y.copy()

        # update boundaries (midpoints)
        b[1:-1] = 0.5 * (y[:-1] + y[1:])

        # centroid update for uniform pdf: mean of interval = midpoint
        y[:] = 0.5 * (b[:-1] + b[1:])

        change = np.max(np.abs(y - y_old))
        hist.append(change)
        if change < tol:
            break

    return y, b, np.array(hist)

# Run Lloyd-Max (uniform)
M = 4
y_lm, b_lm, history = lloyd_max_uniform(M)

print("Reconstruction levels:", y_lm)
print("Decision boundaries:", b_lm)

# -----------------------------
# Convergence + quantizer curve (base64)
# -----------------------------
fig, axes = plt.subplots(1, 2, figsize=(12, 4))

axes[0].plot(history, "o-")
axes[0].set_title("Convergence History")
axes[0].set_xlabel("Iteration")
axes[0].set_ylabel("Max change in y")
axes[0].set_yscale("log")
axes[0].grid(True, alpha=0.3)

x_plot = np.linspace(0, 1, 1000)
k = np.clip(np.digitize(x_plot, b_lm) - 1, 0, M - 1)
q = y_lm[k]

axes[1].plot(x_plot, q, linewidth=2, label="Quantizer Q(x)")
axes[1].plot(x_plot, x_plot, "--", alpha=0.5, label="Identity")
for bd in b_lm[1:-1]:
    axes[1].axvline(bd, linestyle="--", alpha=0.5)
for lvl in y_lm:
    axes[1].axhline(lvl, linestyle=":", alpha=0.5)

axes[1].set_title("Lloyd–Max Quantizer (Uniform)")
axes[1].set_xlabel("Input x")
axes[1].set_ylabel("Output Q(x)")
axes[1].grid(True, alpha=0.3)
axes[1].legend()

plt.tight_layout()


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
import io, base64

# =====================================================
# Base64 helper (Pyodide-safe)
# =====================================================
def fig_to_base64(fig):
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight")
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")

# =====================================================
# Lloyd–Max (sample-based, Pyodide-safe)
# =====================================================
def lloyd_max_samples(x, M, xmin, xmax, iters=50):
    y = np.linspace(xmin, xmax, M + 2)[1:-1]
    for _ in range(iters):
        b = np.r_[xmin, 0.5 * (y[:-1] + y[1:]), xmax]
        idx = np.clip(np.digitize(x, b) - 1, 0, M - 1)
        for i in range(M):
            xi = x[idx == i]
            if xi.size:
                y[i] = xi.mean()
    return y, b

def uniform_levels(M, xmin, xmax):
    d = (xmax - xmin) / M
    b = xmin + np.arange(M + 1) * d
    y = xmin + (np.arange(M) + 0.5) * d
    return y, b

def quantize(x, y, b):
    idx = np.clip(np.digitize(x, b) - 1, 0, len(y) - 1)
    return y[idx]

# =====================================================
# Data
# =====================================================
np.random.seed(42)
N = 10000
sigma = 1.0
xmin, xmax = -4 * sigma, 4 * sigma

x = np.random.normal(0, sigma, N)
x = np.clip(x, xmin, xmax)

M_values = [2, 4, 8, 16]
sig_power = float(np.mean(x**2))

results = []

for M in M_values:
    y_u, b_u = uniform_levels(M, xmin, xmax)
    y_lm, b_lm = lloyd_max_samples(x, M, xmin, xmax)

    x_u = quantize(x, y_u, b_u)
    x_lm = quantize(x, y_lm, b_lm)

    mse_u = float(np.mean((x - x_u) ** 2))
    mse_lm = float(np.mean((x - x_lm) ** 2))

    snr_u = float(10 * np.log10(sig_power / mse_u))
    snr_lm = float(10 * np.log10(sig_power / mse_lm))

    imp = (mse_u - mse_lm) / mse_u * 100
    results.append((M, mse_u, mse_lm, snr_u, snr_lm, imp))

# =====================================================
# Plot
# =====================================================
M_plot = [r[0] for r in results]
mse_u_plot = [r[1] for r in results]
mse_lm_plot = [r[2] for r in results]
snr_u_plot = [r[3] for r in results]
snr_lm_plot = [r[4] for r in results]

fig, axes = plt.subplots(1, 2, figsize=(14, 5))

axes[0].semilogy(M_plot, mse_u_plot, "o-", label="Uniform")
axes[0].semilogy(M_plot, mse_lm_plot, "s-", label="Lloyd–Max")
axes[0].set_title("MSE vs Levels")
axes[0].set_xlabel("Levels (M)")
axes[0].set_ylabel("MSE")
axes[0].grid(True)
axes[0].legend()

axes[1].plot(M_plot, snr_u_plot, "o-", label="Uniform")
axes[1].plot(M_plot, snr_lm_plot, "s-", label="Lloyd–Max")
axes[1].set_title("SNR vs Levels")
axes[1].set_xlabel("Levels (M)")
axes[1].set_ylabel("SNR (dB)")
axes[1].grid(True)
axes[1].legend()

plt.tight_layout()

# =====================================================
# Export image
# =====================================================
img_base64 = fig_to_base64(fig)
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")

# =====================================================
# Print table
# =====================================================
print("\n" + "=" * 80)
print(f"{'M':<5} {'MSE-U':<12} {'MSE-LM':<12} {'SNR-U':<10} {'SNR-LM':<10} {'Gain %'}")
print("=" * 80)
for r in results:
    print(f"{r[0]:<5} {r[1]:<12.6f} {r[2]:<12.6f} {r[3]:<10.2f} {r[4]:<10.2f} {r[5]:.2f}")
print("=" * 80)

`;


}



