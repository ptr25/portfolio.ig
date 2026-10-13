(() => {
 const canvas = document.getElementById('binary-flower');
 if (!canvas) return;
 const ctx = canvas.getContext('2d');
 if (!ctx) return;
 const motion = matchMedia('(prefers-reduced-motion: reduce)');
 let paused = motion.matches, visible = false, frame = 0, last = 0, time = 0;
 const colors = ['#d8125b', '#ed4383', '#ff85b2', '#ffb4d1', '#ffe0ec'];
 const hash = (x,y) => {const n = Math.sin(x*127.1+y*311.7)*43758.5453; return n-Math.floor(n)};
 function draw(t) {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  if(canvas.width !== 520*dpr) {canvas.width=520*dpr;canvas.height=560*dpr}
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,520,560);
  const turn = Math.sin(t*.36)*.5, bloom = .92+Math.sin(t*.6)*.08;
  ctx.font='bold 11px monospace';ctx.textAlign='center';ctx.textBaseline='middle';
  for(let y=38;y<525;y+=10) for(let x=35;x<490;x+=10){
   const sway = Math.sin(t*.45)*12;
   const dx=(x-260-sway)/(.88+.12*Math.cos(t*.36)), dy=y-232;
   let inside=false, edge=false;
   for(let k=0;k<7;k++){
    const angle=-Math.PI/2+k*Math.PI*2/7+turn;
    const u=dx*Math.cos(angle)+dy*Math.sin(angle),v=-dx*Math.sin(angle)+dy*Math.cos(angle);
    const ellipse=((u-87*bloom)/(98*bloom))**2+(v/(35*bloom))**2;
    if(ellipse<1)inside=true;
    if(ellipse>.79&&ellipse<1.12)edge=true;
   }
   const stemX=260+sway+Math.sin((y-232)/115)*20;
   const stem=y>244&&Math.abs(x-stemX)<7;
   const leaf=((x-306-sway)/48)**2+((y-388+(x-306)*.55)/16)**2<1;
   const seed=hash(x,y), center=dx*dx+dy*dy<26*26;
   if(!inside&&!stem&&!leaf&&!edge)continue;
   const flicker=Math.sin(t*1.8+seed*20)*.5+.5;
   ctx.globalAlpha=inside||stem||leaf?.82+flicker*.18:.16+flicker*.2;
   ctx.fillStyle=colors[center?4:Math.min(4,Math.floor(seed*4+flicker))];
   const digit=(Math.floor(t*.8+seed*10)%2).toString();
   ctx.fillText(digit,x,y);
   if(edge&&seed>.74){ctx.globalAlpha=.28;ctx.strokeStyle='#ff85b2';ctx.lineWidth=.7;ctx.strokeRect(x-4,y-4,8,8)}
  }
  ctx.globalAlpha=1;
 }
 function tick(now){frame=0;if(paused||!visible||document.hidden)return;time+=last?Math.min(now-last,60)/1000:0;last=now;draw(time);frame=requestAnimationFrame(tick)}
 function sync(){cancelAnimationFrame(frame);frame=0;last=0;if(!paused&&visible&&!document.hidden)frame=requestAnimationFrame(tick)}
 motion.addEventListener('change',e=>{paused=e.matches;sync()});
 document.addEventListener('visibilitychange',sync);
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:0}).observe(canvas);
 else{visible=true;sync()}
 draw(0);sync();
})();
