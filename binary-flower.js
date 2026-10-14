(() => {
  const canvas = document.getElementById('binary-flower');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', {alpha: false});
  if (!ctx) return;
  // Keep the decoder off the page; only the canvas is displayed.
  const source = document.createElement('video');
  source.muted = true;
  source.loop = true;
  source.playsInline = true;
  source.disablePictureInPicture = true;
  source.disableRemotePlayback = true;
  source.preload = 'auto';
  source.src = new URL('assets/pink-flower-blend.mp4', document.baseURI).href;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false, frame = 0;
  const poster = new Image();
  poster.onload = () => {if (source.readyState < 2 || reduced.matches) ctx.drawImage(poster, 0, 0, canvas.width, canvas.height);};
  poster.src = new URL('assets/pink-flower-blend.jpg', document.baseURI).href;
  function draw() {
    frame = 0;
    if (source.readyState >= 2) ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
    if (visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(draw);
  }
  function sync() {
    cancelAnimationFrame(frame); frame = 0;
    if (visible && !document.hidden && !reduced.matches) {
      source.play().catch(() => {});
      draw();
    } else {source.pause();}
  }
  source.addEventListener('loadeddata', () => {draw(); sync();});
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting; sync();
  }).observe(canvas);
  else {visible = true; sync();}
})();
