import { Component } from '@angular/core';
import { Pycodechap1 } from '../../../components/python-code/pycodechap1/pycodechap1';
import { MatCardModule } from '@angular/material/card';


import { MatButtonModule } from '@angular/material/button';




@Component({
  selector: 'app-lab5',
  imports: [Pycodechap1, MatCardModule, MatButtonModule],
  templateUrl: './lab5.html',
  styleUrl: './lab5.css',
})
export class Lab5 {

chapter7example1 = `
import numpy as np
import matplotlib.pyplot as plt
import io
import base64
from matplotlib.colors import ListedColormap

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
# Data + VQ
# -----------------------------
def make_data(n=1500, seed=0):
    rng = np.random.default_rng(seed)
    means = np.array([[0, 0], [3, 3], [0, 4]], float)
    covs  = [0.2*np.eye(2), 0.4*np.eye(2), 0.3*np.eye(2)]
    m = n // 3
    return np.vstack([
        rng.multivariate_normal(mu, C, m)
        for mu, C in zip(means, covs)
    ])

def vq_encode(X, C):
    d2 = ((X[:, None, :] - C[None, :, :])**2).sum(axis=2)
    return d2.argmin(axis=1)

def plot_vq_base64(X, C, idx, res=250):
    xmin, xmax = X[:,0].min()-1, X[:,0].max()+1
    ymin, ymax = X[:,1].min()-1, X[:,1].max()+1

    xx, yy = np.meshgrid(
        np.linspace(xmin, xmax, res),
        np.linspace(ymin, ymax, res)
    )
    grid = np.c_[xx.ravel(), yy.ravel()]
    gidx = vq_encode(grid, C).reshape(xx.shape)

    cmap = ListedColormap(plt.cm.tab10.colors[:len(C)])

    fig = plt.figure(figsize=(8, 8))
    plt.contourf(xx, yy, gidx, alpha=0.2, cmap=cmap)
    plt.scatter(X[:,0], X[:,1], c=idx, s=10, cmap=cmap, alpha=0.6)
    plt.scatter(C[:,0], C[:,1], c=np.arange(len(C)),
                cmap=cmap, marker="x", s=200, linewidths=3)

    plt.title("Fixed 2D Vector Quantizer")
    plt.xlabel("x₁")
    plt.ylabel("x₂")
    plt.grid(True, alpha=0.3)
    plt.tight_layout()

    return fig_to_base64(fig)

# -----------------------------
# Main
# -----------------------------
CODEBOOK = np.array([
    [-0.5, 0.0],
    [2.5, 2.5],
    [0.0, 3.5]
], float)

X = make_data()
idx = vq_encode(X, CODEBOOK)
X_hat = CODEBOOK[idx]

D = float(np.mean((X - X_hat)**2))
bits_per_vector = float(np.log2(len(CODEBOOK)))

print("Codebook size:", len(CODEBOOK))
print("Average distortion (MSE):", round(D, 4))
print("Bits per vector:", round(bits_per_vector, 2))

# ---- generate base64 image ----
img_base64 = plot_vq_base64(X, CODEBOOK, idx)

# ---- IMPORTANT: print for browser ----
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")



`;

chapter7example2 = `
import numpy as np
import matplotlib.pyplot as plt
import io
import base64
from matplotlib.colors import ListedColormap

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
# Data
# -----------------------------
def make_data(n=1500, seed=42):
    rng = np.random.default_rng(seed)
    means = np.array([[0, 0], [3, 3], [0, 4]], float)
    covs  = [0.2*np.eye(2), 0.4*np.eye(2), 0.3*np.eye(2)]
    m = n // 3
    return np.vstack([
        rng.multivariate_normal(mu, C, m)
        for mu, C in zip(means, covs)
    ])

# -----------------------------
# LBG algorithm
# -----------------------------
def lbg(X, K, max_iter=50, eps=1e-5, seed=0):
    rng = np.random.default_rng(seed)
    C = X[rng.choice(len(X), K, replace=False)].copy()
    hist = [C.copy()]
    D = []

    for _ in range(max_iter):
        d2 = ((X[:, None, :] - C[None, :, :])**2).sum(2)
        a = d2.argmin(1)
        dist = float(d2[np.arange(len(X)), a].mean())
        D.append(dist)

        if len(D) > 1 and abs(D[-2] - D[-1]) < eps:
            break

        for k in range(K):
            m = (a == k)
            C[k] = X[m].mean(0) if m.any() else X[rng.integers(len(X))]
        hist.append(C.copy())

    return C, np.array(D, float), hist

# -----------------------------
# Plot evolution
# -----------------------------
def plot_evolution_base64(X, Ds, codebooks):
    snaps = [0, len(codebooks)//4, len(codebooks)//2, -1]

    fig1, axes = plt.subplots(2, 2, figsize=(12, 12))
    axes = axes.ravel()

    for ax, s in zip(axes, snaps):
        C = codebooks[s]
        d2 = ((X[:, None, :] - C[None, :, :])**2).sum(2)
        a = d2.argmin(1)

        cmap = ListedColormap(plt.cm.tab10.colors[:len(C)])
        ax.scatter(X[:,0], X[:,1], c=a, s=5, cmap=cmap, alpha=0.4)
        ax.scatter(C[:,0], C[:,1], marker="x", s=200,
                   c=np.arange(len(C)), cmap=cmap, linewidths=3)

        it = s if s >= 0 else len(codebooks) - 1
        dval = Ds[it] if it < len(Ds) else Ds[-1]
        ax.set_title(f"Iteration {it}, D={dval:.4f}")
        ax.grid(True, alpha=0.3)

    plt.tight_layout()
    snap_img = fig_to_base64(fig1)

    fig2 = plt.figure(figsize=(10, 5))
    plt.plot(Ds, "o-", linewidth=2)
    plt.title("LBG Convergence")
    plt.xlabel("Iteration")
    plt.ylabel("Average Distortion (MSE)")
    plt.grid(True, alpha=0.3)
    plt.tight_layout()

    conv_img = fig_to_base64(fig2)

    return snap_img, conv_img

# -----------------------------
# Run
# -----------------------------
X = make_data()
K = 3

C_final, Ds, codebooks = lbg(X, K)
final_dist = float(Ds[-1])

print("Final distortion:", round(final_dist, 6))
print("Final codebook:\n", C_final)

snap_img, conv_img = plot_evolution_base64(X, Ds, codebooks)

print("__IMAGE_START__" + snap_img + "__IMAGE_END__")
print("__IMAGE_START__" + conv_img + "__IMAGE_END__")

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
# Data generation
# -----------------------------
def make_data(n=2000, seed=42):
    rng = np.random.default_rng(seed)
    means = np.array([[0, 0], [3, 3], [0, 4]], float)
    covs  = [0.2*np.eye(2), 0.4*np.eye(2), 0.3*np.eye(2)]
    m = n // 3
    return np.vstack([
        rng.multivariate_normal(mu, C, m)
        for mu, C in zip(means, covs)
    ])

# -----------------------------
# LBG distortion-only function
# -----------------------------
def lbg_rd(X, K, max_iter=50, eps=1e-4, seed=42):
    rng = np.random.default_rng(seed)
    C = X[rng.choice(len(X), K, replace=False)].copy()

    for _ in range(max_iter):
        d2 = ((X[:, None, :] - C[None, :, :])**2).sum(2)
        a = d2.argmin(1)
        C_new = C.copy()

        for k in range(K):
            m = (a == k)
            C_new[k] = X[m].mean(0) if m.any() else X[rng.integers(len(X))]

        if np.max(np.abs(C_new - C)) < eps:
            C = C_new
            break
        C = C_new

    d2 = ((X[:, None, :] - C[None, :, :])**2).sum(2)
    return float(d2.min(1).mean())

# -----------------------------
# Run experiment
# -----------------------------
X = make_data()
K_values = [2, 4, 8, 16, 32, 64]

dist = [lbg_rd(X, K) for K in K_values]
rate = np.log2(K_values).astype(float)

print("K  Bits/vec  Distortion")
print("-" * 26)
for K, r, d in zip(K_values, rate, dist):
    print(f"{K:<2} {r:>7.2f} {d:>11.6f}")

# -----------------------------
# Plot (base64)
# -----------------------------
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

ax1.plot(K_values, dist, "o-", linewidth=2, markersize=8)
ax1.set_xscale("log", base=2)
ax1.set_xticks(K_values)
ax1.set_xlabel("Codebook Size (K)")
ax1.set_ylabel("Average Distortion (MSE)")
ax1.set_title("Distortion vs. K")
ax1.grid(True, alpha=0.3)

ax2.plot(rate, dist, "s-", linewidth=2, markersize=8)
ax2.set_xlabel("Rate (bits per vector)")
ax2.set_ylabel("Distortion (MSE)")
ax2.set_title("Rate–Distortion Curve")
ax2.grid(True, alpha=0.3)
ax2.invert_yaxis()

plt.tight_layout()
img_base64 = fig_to_base64(fig)

# -----------------------------
# Print image for browser
# -----------------------------
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")


`;

chapter7example4 = `

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
# Speech-like signal
# -----------------------------
def speech_like(n=4000, fs=8000, seed=0):
    rng = np.random.default_rng(seed)
    t = np.arange(n) / fs
    pitch = np.sin(2*np.pi*120*t)
    form = (
        np.sin(2*np.pi*800*t)
        + 0.7*np.sin(2*np.pi*1200*t)
        + 0.4*np.sin(2*np.pi*2500*t)
    )
    return pitch * form + 0.1 * rng.standard_normal(n)

def to_vec(x, d):
    n = (len(x) // d) * d
    return x[:n].reshape(-1, d)

# -----------------------------
# LBG VQ
# -----------------------------
def lbg_codebook(X, K, it=50, eps=1e-5, seed=42):
    rng = np.random.default_rng(seed)
    C = X[rng.choice(len(X), K, replace=False)].copy()

    for _ in range(it):
        d2 = ((X[:, None, :] - C[None, :, :])**2).sum(2)
        a = d2.argmin(1)

        C_new = np.vstack([
            X[a == k].mean(0) if (a == k).any()
            else X[rng.integers(len(X))]
            for k in range(K)
        ])

        if np.max(np.abs(C_new - C)) < eps:
            C = C_new
            break
        C = C_new

    return C

def vq_reconstruct(X, C):
    idx = ((X[:, None, :] - C[None, :, :])**2).sum(2).argmin(1)
    return idx, C[idx]

def snr_db_val(x, xh):
    return float(10*np.log10(
        np.mean(x**2) / (np.mean((x - xh)**2) + 1e-12)
    ))

# -----------------------------
# Run experiment
# -----------------------------
x = speech_like()
D = 4
K = 32

X = to_vec(x, D)
C = lbg_codebook(X, K)
idx, Xh = vq_reconstruct(X, C)

x0 = X.ravel()
xh = Xh.ravel()
snr = snr_db_val(x0, xh)

bits_per_vector = float(np.log2(K))
bits_per_sample = float(bits_per_vector / D)

print("Signal length:", len(x))
print("Vectors:", X.shape[0], "Dim:", D)
print("SNR:", round(snr, 2), "dB")
print("Bits/vector:", round(bits_per_vector, 2))
print("Bits/sample:", round(bits_per_sample, 2))

# -----------------------------
# Plot 1: waveform comparison
# -----------------------------
fig1, ax = plt.subplots(3, 1, figsize=(14, 10))
ax[0].plot(x0[:800]); ax[0].set_title("Original"); ax[0].grid(True, alpha=0.3)
ax[1].plot(xh[:800]); ax[1].set_title(f"Reconstructed (K={K}, SNR={snr:.2f} dB)"); ax[1].grid(True, alpha=0.3)
ax[2].plot((x0 - xh)[:800]); ax[2].set_title("Error"); ax[2].grid(True, alpha=0.3)
plt.tight_layout()

img1 = fig_to_base64(fig1)
print("__IMAGE_START__" + img1 + "__IMAGE_END__")

# -----------------------------
# Plot 2: single vector comparison
# -----------------------------
i = int(np.clip(100, 0, X.shape[0] - 1))

fig2 = plt.figure(figsize=(10, 5))
plt.plot(X[i], "o-", label="Original", linewidth=2)
plt.plot(Xh[i], "s--", label="Reconstructed", linewidth=2)
plt.title(f"Vector {i}: Original vs Reconstructed")
plt.xlabel("Dimension")
plt.ylabel("Value")
plt.grid(True, alpha=0.3)
plt.legend()
plt.tight_layout()

img2 = fig_to_base64(fig2)
print("__IMAGE_START__" + img2 + "__IMAGE_END__")


`;
  
}
