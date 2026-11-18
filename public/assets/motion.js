const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const desktop=matchMedia('(min-width: 768px)');
const finePointer=matchMedia('(hover: hover) and (pointer: fine)');

// Entrances use the reference's 800ms ease-out and per-card stagger.
const revealObserver=new IntersectionObserver(entries=>{
  for(const entry of entries){
    if(!entry.isIntersecting)continue;
    entry.target.classList.remove('motion-pending');
    entry.target.classList.add('motion-visible');
    revealObserver.unobserve(entry.target);
  }
},{threshold:.1});

function reveal(element,{y=60,delay=0,duration=800,initial=false}={}){
  if(!element||element.classList.contains('motion-reveal'))return;
  element.classList.add('motion-reveal');
  element.style.setProperty('--reveal-y',`${y}px`);
  element.style.setProperty('--reveal-delay',`${delay}ms`);
  element.style.setProperty('--reveal-duration',`${duration}ms`);
  const box=element.getBoundingClientRect();
  if(reducedMotion.matches||box.bottom<0||(!initial&&box.top<innerHeight*.8)){
    element.classList.add('motion-visible');
    return;
  }
  element.classList.add('motion-pending');
  revealObserver.observe(element);
}

document.querySelectorAll('section h2,.brand-intro h1,.brand-article h1').forEach(element=>reveal(element));
document.querySelectorAll('.brand-grid article,.brand-grid .brand-card').forEach((element,index)=>reveal(element,{delay:(index%3)*100}));
const hero=document.querySelector('.hero-copy');
if(hero){
  reveal(hero.querySelector('p'),{initial:true});
  reveal(hero.querySelector('h1'),{initial:true,delay:150});
  const cta=hero.querySelector('.hero-cta');
  if(cta){
    const wrapper=document.createElement('span');
    wrapper.className='motion-cta-reveal';
    cta.before(wrapper);wrapper.append(cta);
    reveal(wrapper,{initial:true,delay:600,duration:1000});
  }
}

const serviceCards=[...document.querySelectorAll('a[href^="/services/"]')].filter(card=>card.querySelector('img')&&!card.closest('header,footer,.replica-menu'));
serviceCards.forEach((card,index)=>{
  const wrapper=card.parentElement;
  reveal(wrapper,{y:100,delay:(index%4)*150});
  card.classList.add('motion-service-card');
  card.style.removeProperty('transition');
  card.style.removeProperty('transform');
  card.style.removeProperty('will-change');
  let frame=0,cleanupTimer,pointer;
  const reset=()=>{
    cancelAnimationFrame(frame);frame=0;
    card.classList.add('motion-card-returning');
    card.style.transform='';
    clearTimeout(cleanupTimer);
    cleanupTimer=setTimeout(()=>{card.style.willChange='';},2100);
  };
  card.addEventListener('pointermove',event=>{
    if(reducedMotion.matches||!desktop.matches||!finePointer.matches||event.pointerType!=='mouse')return;
    pointer={x:event.clientX,y:event.clientY};
    clearTimeout(cleanupTimer);
    card.classList.remove('motion-card-returning');
    card.style.willChange='transform';
    if(frame)return;
    frame=requestAnimationFrame(()=>{
      frame=0;
      const box=card.getBoundingClientRect();
      const x=(pointer.x-box.left-box.width/2)/(box.width/2)*10;
      const y=(pointer.y-box.top-box.height/2)/(box.height/2)*10;
      card.style.transform=`perspective(${innerWidth}px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
  },{passive:true});
  card.addEventListener('pointerleave',reset);
  reducedMotion.addEventListener('change',reset);
});

const reel=document.querySelector('.motion-reel');
if(reel){
  const frame=reel.querySelector('.motion-reel-frame');
  const video=reel.querySelector('video');
  const control=reel.querySelector('.motion-reel-control');
  const source=video.querySelector('source');
  const pauseIcon='<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="4" y="3" width="3" height="10" rx=".5"/><rect x="9" y="3" width="3" height="10" rx=".5"/></svg>';
  const playIcon='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m5 3 8 5-8 5z"/></svg>';
  control.innerHTML=pauseIcon;
  let scrollFrame=0,inView=false,userPaused=false,loaded=false;
  const allowVideo=()=>desktop.matches&&!reducedMotion.matches&&!navigator.connection?.saveData;
  const play=()=>{
    if(!inView||userPaused||!allowVideo()){video.pause();return;}
    if(!loaded){source.src=source.dataset.src;video.load();loaded=true;}
    video.muted=true;
    video.play().catch(()=>{frame.classList.remove('is-playing');control.hidden=true;});
  };
  const update=()=>{
    scrollFrame=0;
    if(!desktop.matches||reducedMotion.matches){
      frame.style.removeProperty('--reel-width');frame.style.removeProperty('--reel-height');
      reel.classList.remove('motion-reel-dark');
      video.pause();frame.classList.remove('is-playing');control.hidden=true;
      return;
    }
    const box=reel.getBoundingClientRect();
    const progress=Math.max(0,Math.min(1,-box.top/innerHeight));
    const eased=progress<.5?2*progress*progress:-1+(4-2*progress)*progress;
    const width=innerWidth*(.4+.5*eased);
    const height=innerWidth*.3+(Math.max(240,innerHeight-innerWidth*.06)-innerWidth*.3)*eased;
    frame.style.setProperty('--reel-width',`${width}px`);
    frame.style.setProperty('--reel-height',`${height}px`);
    reel.classList.toggle('motion-reel-dark',box.top<=0);
  };
  const schedule=()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(update);};
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  for(const query of [reducedMotion,desktop])query.addEventListener('change',()=>{update();play();});
  const visibility=new IntersectionObserver(entries=>{
    inView=entries[0].isIntersecting;
    if(inView){reveal(frame,{y:200,initial:true});play();}else video.pause();
  },{rootMargin:'150px 0px',threshold:0});
  visibility.observe(reel);
  video.addEventListener('playing',()=>{
    frame.classList.add('is-playing');control.hidden=false;
    control.setAttribute('aria-label','Pause reel');control.innerHTML=pauseIcon;
  });
  control.addEventListener('click',()=>{
    userPaused=!userPaused;
    if(userPaused){video.pause();control.setAttribute('aria-label','Play reel');control.innerHTML=playIcon;}
    else play();
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else play();});
  update();
}
