(() => {
 const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const intro = document.getElementById('intro');
 let timer;
 const done = () => {intro.hidden=true;document.body.classList.remove('intro-running');clearTimeout(timer)};
 const play = () => {if(reduced){done();return}intro.hidden=false;intro.classList.remove('is-leaving');intro.style.animation='none';void intro.offsetWidth;intro.style.animation='';intro.querySelector('.signature').getAnimations({subtree:true}).forEach(a=>a.currentTime=0);document.body.classList.add('intro-running');timer=setTimeout(done,4400)};
 document.getElementById('skip-intro').addEventListener('click',done);
 document.addEventListener('keydown',e=>{if(e.key==='Escape')done()});
 document.getElementById('replay')?.addEventListener('click',()=>{window.scrollTo({top:0,behavior:'instant'});play()});
 play();
 document.fonts.ready.then(()=>{if(!intro.hidden){const signature=intro.querySelector('.signature');signature.getAnimations({subtree:true}).forEach(a=>a.currentTime=0)}});
 document.getElementById('github-days').textContent=Math.floor((Date.now()-Date.UTC(2020,2,30))/86400000).toLocaleString('en-IN');
 const toggle=document.querySelector('.marquee-toggle');toggle.addEventListener('click',()=>{const paused=document.querySelector('.marquee').classList.toggle('paused');toggle.textContent=paused?'▶':'Ⅱ';toggle.setAttribute('aria-label',paused?'Play scrolling banner':'Pause scrolling banner')});
 if('IntersectionObserver' in window){const ob=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');ob.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>ob.observe(el))}else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'))}

 // Trigger all four contact tiles together when the grid enters view.
 if (!reduced && 'IntersectionObserver' in window) {
  const grid = document.querySelector('.contact-grid');
  if (grid) {
   const contactObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
     if (entry.isIntersecting && entry.intersectionRatio >= .2) {
      grid.classList.add('contact-arriving');
     } else if (!entry.isIntersecting) {
      grid.classList.remove('contact-arriving');
     }
    });
   }, {threshold: [0, .2]});
   contactObserver.observe(grid);
  }
 }

})();
