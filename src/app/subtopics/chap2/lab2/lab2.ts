import { Component } from '@angular/core';
import { Pycodechap1 } from '../../../components/python-code/pycodechap1/pycodechap1';
import { MatCardModule } from '@angular/material/card';


import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-lab2',
  imports: [Pycodechap1, MatCardModule, MatButtonModule],
  templateUrl: './lab2.html',
  styleUrl: './lab2.css',
})
export class Lab2 {
chapter2example1 = `
import numpy as np
import matplotlib.pyplot as plt

def mid_tread_quantizer(x, Delta):
    """Mid-tread: zero is a reconstruction level"""
    return Delta * np.floor(x / Delta + 0.5)

def mid_rise_quantizer(x, Delta):
    """Mid-rise: zero is a decision boundary"""
    return Delta * (np.floor(x / Delta) + 0.5)

# Test signal
x = np.linspace(-1, 1, 1000)
Delta = 0.2  # quantization step size

# Apply both quantizers
x_tread = mid_tread_quantizer(x, Delta)
x_rise = mid_rise_quantizer(x, Delta)

# Plot comparison
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

axes[0].plot(x, x_tread, 'b-', linewidth=2, label='Quantized')
axes[0].plot(x, x, 'r--', alpha=0.5, label='Original')
axes[0].axhline(0, color='k', linestyle=':', linewidth=1)
axes[0].axvline(0, color='k', linestyle=':', linewidth=1)
axes[0].set_xlabel('Input x')
axes[0].set_ylabel('Output')
axes[0].set_title('Mid-Tread Quantizer (zero is a level)')
axes[0].legend()
axes[0].grid(True, alpha=0.3)

axes[1].plot(x, x_rise, 'b-', linewidth=2, label='Quantized')
axes[1].plot(x, x, 'r--', alpha=0.5, label='Original')
axes[1].axhline(0, color='k', linestyle=':', linewidth=1)
axes[1].axvline(0, color='k', linestyle=':', linewidth=1)
axes[1].set_xlabel('Input x')
axes[1].set_ylabel('Output')
axes[1].set_title('Mid-Rise Quantizer (zero is a boundary)')
axes[1].legend()
axes[1].grid(True, alpha=0.3)

plt.tight_layout()


import io, base64

buf = io.BytesIO()
plt.savefig(buf, format="png", bbox_inches="tight")
plt.close()
buf.seek(0)

img_base64 = base64.b64encode(buf.read()).decode("utf-8")
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")


`;

chapter2example2 = `
import numpy as np
import matplotlib.pyplot as plt

def quantize(x, B):
    Delta = 2 / (2**B)
    return Delta * np.round(x / Delta)

# Parameters
N = 10000
B = 6

# 1. Uniform random signal
uniform_signal = np.random.rand(N) - 0.5

# 2. Triangular wave (NumPy-only)
t = np.linspace(0, 1, N)
triangular_signal = 0.5 * (2 * np.abs(2 * (t - np.floor(t + 0.5))) - 1)

# 3. Sinusoidal signal
sinusoidal_signal = 0.5 * np.sin(2 * np.pi * 5 * t)

# 4. Gaussian signal
gaussian_signal = 0.3 * np.random.randn(N)
gaussian_signal = np.clip(gaussian_signal, -0.5, 0.5)

signals = [
    uniform_signal,
    triangular_signal,
    sinusoidal_signal,
    gaussian_signal
]

titles = [
    "Uniform Random",
    "Triangular Wave",
    "Sinusoidal",
    "Gaussian"
]

# Plot
fig, axes = plt.subplots(2, 4, figsize=(16, 8))

for idx in range(4):
    sig = signals[idx]
    title = titles[idx]

    sig_q = quantize(sig, B)
    error = sig - sig_q
    Delta = 2 / (2**B)

    # Signal PDF
    axes[0, idx].hist(sig, bins=50, density=True, alpha=0.7, edgecolor="black")
    axes[0, idx].set_title(title + " Signal Distribution")
    axes[0, idx].set_xlabel("Amplitude")
    axes[0, idx].set_ylabel("Probability Density")
    axes[0, idx].grid(True, alpha=0.3)

    # Quantization error PDF
    axes[1, idx].hist(error, bins=50, density=True,
                      alpha=0.7, edgecolor="black", color="orange")
    axes[1, idx].axvline(-Delta / 2, color="red", linestyle="--")
    axes[1, idx].axvline(Delta / 2, color="red", linestyle="--")
    axes[1, idx].axhline(1 / Delta, color="green", linestyle=":", linewidth=2)

    axes[1, idx].set_title("Quantization Error")
    axes[1, idx].set_xlabel("Error")
    axes[1, idx].set_ylabel("Probability Density")
    axes[1, idx].grid(True, alpha=0.3)
    axes[1, idx].set_xlim([-Delta, Delta])

plt.tight_layout()


import io, base64

buf = io.BytesIO()
plt.savefig(buf, format="png", bbox_inches="tight")
plt.close()
buf.seek(0)

img_base64 = base64.b64encode(buf.read()).decode("utf-8")
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")




`;

chapter2example3 = `
import numpy as np
import matplotlib.pyplot as plt

def compute_snr(x, xq):
    signal_power = np.sum(x ** 2)
    noise_power = np.sum((x - xq) ** 2)
    return 10 * np.log10(signal_power / noise_power)

# Generate full-range uniformly distributed signal
N_samples = 50000
A = 1.0
x = A * (np.random.rand(N_samples) - 0.5)

# Bit depths
bit_depths = np.arange(2, 17)
snr_measured = []
snr_theoretical = []

for B in bit_depths:
    Delta = (2 * A) / (2 ** B)
    xq = Delta * np.round(x / Delta)

    snr = compute_snr(x, xq)
    snr_measured.append(snr)

    snr_theoretical.append(6.02 * B)

# Plot
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

axes[0].plot(bit_depths, snr_measured, 'o-', linewidth=2, markersize=8)
axes[0].plot(bit_depths, snr_theoretical, 's--', linewidth=2, markersize=6)
axes[0].set_xlabel("Bit Depth")
axes[0].set_ylabel("SNR (dB)")
axes[0].set_title("SNR vs Bit Depth")
axes[0].grid(True)

error = np.array(snr_measured) - np.array(snr_theoretical)

axes[1].plot(bit_depths, error, 'o-', linewidth=2, markersize=8)
axes[1].axhline(0, linestyle="--", linewidth=1)
axes[1].set_xlabel("Bit Depth")
axes[1].set_ylabel("Error (dB)")
axes[1].set_title("Measured minus Theoretical SNR")
axes[1].grid(True)

plt.tight_layout()

avg_error = np.mean(np.abs(error))
snr_step_measured = np.mean(np.diff(snr_measured))

print("Average error (dB): " + str(round(avg_error, 3)))
print("Measured SNR increase per bit (dB): " + str(round(snr_step_measured, 2)))
print("Theoretical SNR increase per bit (dB): 6.02")







import io, base64

buf = io.BytesIO()
plt.savefig(buf, format="png", bbox_inches="tight")
plt.close()
buf.seek(0)

img_base64 = base64.b64encode(buf.read()).decode("utf-8")
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")


`;

chapter2example4 = `
import numpy as np
import matplotlib.pyplot as plt

def compute_snr(x, xq):
    signal_power = np.sum(x ** 2)
    noise_power = np.sum((x - xq) ** 2)
    return 10 * np.log10(signal_power / noise_power)

# Parameters
N_samples = 50000
B = 12
A_full = 1.0

# Signal level reduction (dB below full scale)
reduction_factors_db = np.arange(0, 40, 2)
snr_results = []
theoretical_snr = []

for reduction_db in reduction_factors_db:
    c = 10 ** (reduction_db / 20.0)
    A = A_full / c

    x = A * (np.random.rand(N_samples) - 0.5)

    Delta = (2 * A_full) / (2 ** B)
    xq = Delta * np.round(x / Delta)

    snr = compute_snr(x, xq)
    snr_results.append(snr)

    theoretical_snr.append(6.02 * B - reduction_db)

# Plot
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

axes[0].plot(reduction_factors_db, snr_results, 'o-', linewidth=2)
axes[0].plot(reduction_factors_db, theoretical_snr, 's--', linewidth=2)
axes[0].set_xlabel("Signal Level Below Full Scale (dB)")
axes[0].set_ylabel("SNR (dB)")
axes[0].set_title("SNR vs Signal Amplitude (" + str(B) + "-bit quantizer)")
axes[0].grid(True)
axes[0].invert_xaxis()

effective_bits = np.array(snr_results) / 6.02
axes[1].plot(reduction_factors_db, effective_bits, 'o-', linewidth=2)
axes[1].axhline(B, linestyle="--", linewidth=2)
axes[1].set_xlabel("Signal Level Below Full Scale (dB)")
axes[1].set_ylabel("Effective Bit Depth")
axes[1].set_title("Effective Resolution vs Amplitude")
axes[1].grid(True)
axes[1].invert_xaxis()

plt.tight_layout()
plt.show()

# Text output (Pyodide-safe)
snr_16bit = 6.02 * 16
snr_minus_20 = snr_16bit - 20
lost_bits = 20 / 6.02

print("Example: 16-bit quantizer at full range")
print("SNR = 6.02 x 16 = " + str(round(snr_16bit, 2)) + " dB")
print("Same signal at 20 dB below full range")
print("SNR = " + str(round(snr_minus_20, 2)) + " dB")
print("Lost effective bits = " + str(round(lost_bits, 1)))





import io, base64

buf = io.BytesIO()
plt.savefig(buf, format="png", bbox_inches="tight")
plt.close()
buf.seek(0)

img_base64 = base64.b64encode(buf.read()).decode("utf-8")
print("__IMAGE_START__" + img_base64 + "__IMAGE_END__")



`;

}
