(() => {
  const canvas = document.getElementById('binary-flower');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const W = 720, H = 650, cells = [], points = [];
  const hash = n => { const v = Math.sin(n * 127.1) * 43758.5453; return v - Math.floor(v); };
  // A three-dimensional bloom: each petal curves upward from the flower's centre.
  for (let petal = 0; petal < 7; petal++) {
    const angle = petal * Math.PI * 2 / 7;
    for (let u = .03; u <= 1; u += .018) {
      const radius = 18 + 182 * u;
      const width = 51 * Math.pow(Math.sin(Math.PI * u), .65);
      for (let v = -1; v <= 1; v += .09) {
        const side = v * width;
        const height = -29 - 100 * u * u + 23 * v * v * Math.sin(Math.PI * u);
        points.push([Math.cos(angle) * radius - Math.sin(angle) * side, height,
          Math.sin(angle) * radius + Math.cos(angle) * side, 0]);
      }
    }
  }
  for (let y = 0; y < 275; y += 3) {
    for (let a = 0; a < Math.PI * 2; a += .6)
      points.push([Math.sin(y / 110) * 11 + 4 * Math.cos(a), y, 4 * Math.sin(a), 1]);
  }
  // Two slender leaves rise from the stem.
  for (const side of [-1, 1]) for (let u = 0; u < 1; u += .025) {
    for (let v = -1; v <= 1; v += .15) {
      points.push([side * (10 + 102 * u), 160 - 64 * u + 14 * v * v,
        Math.sin(Math.PI * u) * 24 * v, 1]);
    }
  }
  let visible = false, frame = 0, previous = 0, elapsed = 0;
  function draw(t) {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    if (canvas.width !== W * dpr) {canvas.width = W * dpr; canvas.height = H * dpr;}
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    cells.length = 0;
    const turn = t * Math.PI * 2 / 5;
    const tilt = -.55 + .65 * Math.sin(turn);
    const roll = .85 * Math.sin(turn - .5);
    const cy = Math.cos(turn), sy = Math.sin(turn), cx = Math.cos(tilt), sx = Math.sin(tilt);
    const cr = Math.cos(roll), sr = Math.sin(roll), grid = 10;
    for (const [x,y,z,kind] of points) {
      const rx = x * cy + z * sy, rz = -x * sy + z * cy;
      const ry = y * cx - rz * sx, depth = y * sx + rz * cx;
      const px = rx * cr - ry * sr, py = rx * sr + ry * cr;
      const perspective = 900 / (900 + depth);
      const gx = Math.round((W / 2 + px * perspective * 1.25) / grid);
      const gy = Math.round((H * .46 + py * perspective * 1.05) / grid);
      if (gx < 1 || gx > W / grid - 1 || gy < 1 || gy > H / grid - 1) continue;
      const key = gy * 100 + gx;
      if (!cells[key] || depth < cells[key].depth) cells[key] = {gx, gy, depth, kind};
    }
    ctx.font = '600 10px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const cell of cells) {
      if (!cell) continue;
      const {gx,gy,depth,kind} = cell;
      const seed = hash(gx * 97 + gy * 13);
      const sparkle = .5 + .5 * Math.sin(t * 2 + seed * 15);
      ctx.globalAlpha = Math.max(.16, Math.min(1, .72 - depth / 470 + sparkle * .12));
      ctx.fillStyle = kind ? '#ed78a7' : seed > .76 ? '#ffb4d1' : '#ff85b2';
      ctx.fillText(String(Math.floor(seed * 9 + t * .6) % 2), gx * grid, gy * grid);
    }
    ctx.globalAlpha = 1;
  }
  function tick(now) {
    frame = 0;
    if (!visible || document.hidden || reduced.matches) return;
    if (previous) elapsed += Math.min(now - previous, 60) / 1000;
    previous = now; draw(elapsed); frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame); previous = 0;
    if (visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(tick);
    else draw(elapsed);
  }
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting; sync();
  }).observe(canvas);
  else {visible = true; sync();}
  draw(0);
})();
