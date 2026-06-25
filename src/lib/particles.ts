// ============================================================
//  Shared: anatomical lateral brain point cloud
//  Returns Float32Array(P*3) shaped like a side-profile brain
//  (frontal lobe toward -x), with gyri folds, cerebellum & stem.
//  Ported verbatim from the portfolio2.html reference.
// ============================================================
export function makeBrain(P: number, opts: { thick?: number; scatter?: number } = {}): Float32Array {
  const thick = opts.thick == null ? 0.17 : opts.thick   // half-depth (z)
  const scatterBg = opts.scatter == null ? 0.06 : opts.scatter
  const a = new Float32Array(P * 3)
  function rn() { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) }

  // cerebrum boundary (clockwise), lateral view, frontal lobe at -x
  const CB = [
    [-1.30, 0.32], [-1.12, 0.72], [-0.78, 1.02], [-0.30, 1.18], [0.22, 1.16],
    [0.66, 1.00], [1.06, 0.70], [1.33, 0.28], [1.41, -0.12], [1.27, -0.44],
    [0.98, -0.56], [0.74, -0.52], [0.56, -0.40], [0.30, -0.52], [-0.06, -0.74],
    [-0.46, -0.82], [-0.86, -0.74], [-1.16, -0.46], [-1.31, -0.06],
  ]
  let minx = 9, maxx = -9, miny = 9, maxy = -9
  CB.forEach(p => { minx = Math.min(minx, p[0]); maxx = Math.max(maxx, p[0]); miny = Math.min(miny, p[1]); maxy = Math.max(maxy, p[1]) })
  function inPoly(x: number, y: number) {
    let c = false
    for (let i = 0, j = CB.length - 1; i < CB.length; j = i++) {
      const xi = CB[i][0], yi = CB[i][1], xj = CB[j][0], yj = CB[j][1]
      if (((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) c = !c
    }
    return c
  }
  // sulci (fold) polylines across the surface
  const sulci = [
    [[-1.02, 0.55], [-0.6, 0.64], [-0.2, 0.5], [0.12, 0.64], [0.5, 0.56], [0.92, 0.40]],
    [[-1.06, 0.20], [-0.6, 0.30], [-0.15, 0.16], [0.32, 0.30], [0.76, 0.16], [1.06, 0.0]],
    [[-0.96, -0.10], [-0.5, -0.02], [-0.05, -0.16], [0.42, -0.02], [0.82, -0.18]],
    [[-0.72, 0.88], [-0.42, 0.60], [-0.32, 0.30], [-0.46, 0.0]],
    [[0.10, 0.92], [0.26, 0.56], [0.16, 0.20], [0.32, -0.10]],
    [[0.60, 0.82], [0.72, 0.46], [0.60, 0.10], [0.76, -0.20]],
    [[-0.30, -0.22], [-0.10, -0.46], [0.22, -0.56]],
  ]
  const cc = [0.95, -0.66], cr = 0.40          // cerebellum centre + radius
  let i = 0
  function put(x: number, y: number, z: number) { if (i >= P) return; const o = i * 3; a[o] = x; a[o + 1] = y; a[o + 2] = z; i++ }

  const nFill = Math.floor(P * 0.40), nEdge = Math.floor(P * 0.12), nSulci = Math.floor(P * 0.20),
    nCblm = Math.floor(P * 0.13), nStem = Math.floor(P * 0.05), nBg = Math.floor(P * scatterBg)

  // interior fill
  let made = 0, guard = 0
  while (made < nFill && guard < nFill * 50) {
    guard++
    const x = minx + Math.random() * (maxx - minx), y = miny + Math.random() * (maxy - miny)
    if (inPoly(x, y)) { put(x, y, rn() * thick); made++ }
  }
  // dense edge outline
  for (let k = 0; k < nEdge; k++) {
    const seg = Math.floor(Math.random() * CB.length), A = CB[seg], B = CB[(seg + 1) % CB.length], t = Math.random()
    put(A[0] + (B[0] - A[0]) * t + rn() * 0.02, A[1] + (B[1] - A[1]) * t + rn() * 0.02, rn() * thick * 0.7)
  }
  // sulci folds
  for (let k = 0; k < nSulci; k++) {
    const sset = sulci[Math.floor(Math.random() * sulci.length)]
    const seg = Math.floor(Math.random() * (sset.length - 1)), A = sset[seg], B = sset[seg + 1], t = Math.random()
    put(A[0] + (B[0] - A[0]) * t + rn() * 0.03, A[1] + (B[1] - A[1]) * t + rn() * 0.03, rn() * thick)
  }
  // cerebellum (radial fan striping, opens lower-right)
  for (let k = 0; k < nCblm; k++) {
    const base = Math.PI * (-0.45 + Math.random() * 1.0)     // sweep
    const fan = Math.round(base / 0.16) * 0.16
    const ang = Math.random() < 0.62 ? fan + rn() * 0.018 : base
    const rad = cr * Math.pow(Math.random(), 0.55)
    put(cc[0] + Math.cos(ang) * rad * 1.05, cc[1] + Math.sin(ang) * rad * 0.92, rn() * thick * 0.7)
  }
  // brain stem
  for (let k = 0; k < nStem; k++) {
    const t = Math.random(), w = 0.11 * (1 - t * 0.4)
    put(0.50 + (Math.random() - 0.5) * w * 2, -0.64 - t * 0.55, rn() * thick * 0.5)
  }
  // sparse background scatter
  for (let k = 0; k < nBg; k++) {
    put((Math.random() - 0.5) * 4.4, (Math.random() - 0.5) * 3.0, (Math.random() - 0.5) * 0.7)
  }
  // fill any leftover slots with interior points
  while (i < P) {
    const x = minx + Math.random() * (maxx - minx), y = miny + Math.random() * (maxy - miny)
    if (inPoly(x, y)) put(x, y, rn() * thick)
    else put(cc[0] + rn() * 0.2, cc[1] + rn() * 0.2, rn() * thick)
  }
  return a
}
