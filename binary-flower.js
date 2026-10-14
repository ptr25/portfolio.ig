(() => {
 const video = document.getElementById('binary-flower');
 if (!video) return;
 const motion = matchMedia('(prefers-reduced-motion: reduce)');
 let visible = false;
 function sync() {
  if (visible && !document.hidden && !motion.matches) video.play().catch(() => {});
  else video.pause();
 }
 motion.addEventListener('change', sync);
 document.addEventListener('visibilitychange', sync);
 if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
  visible = entries[0].isIntersecting; sync();
 }, {threshold: 0}).observe(video);
 else {visible = true; sync();}
})();
