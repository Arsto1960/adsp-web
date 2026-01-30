export function makeBlobs(n_samples: number, n_clusters: number, cluster_std: number) {
  const X: number[][] = [];
  const y: number[] = [];

  // Generate random cluster centers in 2D
  const centers: number[][] = [];
  for (let i = 0; i < n_clusters; i++) {
    centers.push([Math.random() * 10, Math.random() * 10]);
  }

  for (let i = 0; i < n_samples; i++) {
    const clusterIdx = Math.floor(Math.random() * n_clusters);
    const [cx, cy] = centers[clusterIdx];

    // Sample around center using Gaussian noise
    const x = cx + cluster_std * randomNormal();
    const yVal = cy + cluster_std * randomNormal();

    X.push([x, yVal]);
    y.push(clusterIdx);
  }

  return { X, y };
}

// --- Helper: Standard Normal distribution ~ N(0,1)
function randomNormal(): number {
  let u = 0, v = 0;
  while(u === 0) u = Math.random();
  while(v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}
