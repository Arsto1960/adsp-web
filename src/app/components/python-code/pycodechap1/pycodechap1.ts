import { Component, Input, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-pycodechap1',
  imports: [FormsModule, MatButtonModule, MatCardModule],
  templateUrl: './pycodechap1.html',
  styleUrl: './pycodechap1.css',
})
export class Pycodechap1 implements OnInit {
 title = '🧪 Python Editor';
  @Input() code = ''; // default snippet passed from parent

  output = '';
  loading = true;
  pyodide: any;

  async ngOnInit() {
    // Load Pyodide core
    await this.loadScript('https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js');

    // @ts-ignore
    this.pyodide = await (window as any).loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/',
    });

    // ✅ Preload the libraries you want
    const packages = [
      'numpy',
      'matplotlib',
      'scipy',
      'pandas',
      'micropip',  // allows installing pure-Python wheels later
    ];

    for (const pkg of packages) {
      console.log(`Loading ${pkg}...`);
      await this.pyodide.loadPackage(pkg);
    }

    console.log('✅ All packages loaded!');
    this.loading = false;
  }


  loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).loadPyodide) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  async runCode() {
    if (!this.pyodide) return;
    this.output = '▶ Running...';

    const wrapped = `
import sys, io, traceback
import matplotlib
matplotlib.use('Agg')  # Prevents matplotlib from auto-rendering to screen
_buf = io.StringIO()
_old = sys.stdout
sys.stdout = _buf
try:
${this.indent(this.code)}
except Exception:
    traceback.print_exc(file=_buf)
finally:
    sys.stdout = _old
_buf.getvalue()
`;


    try {
      const result = await this.pyodide.runPythonAsync(wrapped);

      const imgMatch = result.match(/__IMAGE_START__(.*?)__IMAGE_END__/s);
      if (imgMatch) {
        const base64Img = imgMatch[1];
        this.output = result.replace(/__IMAGE_START__.*__IMAGE_END__/s, '');
        const imgTag = `<div class="mt-4 flex justify-center">
  <img src="data:image/png;base64,${base64Img}"
       class="max-w-full h-auto rounded-lg shadow-md block mx-auto"/>
</div>`;
        this.output += '\n' + imgTag;
      } else {
        this.output = result || '';
      }
    } catch (err: any) {
      this.output = '❌ ' + (err.message || err);
    }
  }

  indent(code: string) {
    return code
      .split('\n')
      .map(line => '    ' + line)
      .join('\n');
  }
}
