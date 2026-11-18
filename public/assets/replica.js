const menu=document.querySelector('.replica-menu');
const toggle=document.querySelector('.menu-toggle');
let inertBackground=[];
function closeMenu(){
 if(!menu||menu.hidden)return;
 menu.hidden=true;document.body.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false');
 inertBackground.forEach(([element,wasInert])=>{element.inert=wasInert});inertBackground=[];toggle.focus({preventScroll:true});
}
toggle?.addEventListener('click',()=>{
 menu.hidden=false;document.body.classList.add('menu-open');toggle.setAttribute('aria-expanded','true');
 inertBackground=[...document.body.children].filter(element=>element!==menu&&!['SCRIPT','STYLE','LINK'].includes(element.tagName)).map(element=>[element,element.inert]);
 inertBackground.forEach(([element])=>{element.inert=true});menu.querySelector('button').focus();
});
menu?.querySelector('button').addEventListener('click',closeMenu);
document.addEventListener('keydown',event=>{
 if(!menu||menu.hidden)return;
 if(event.key==='Escape'){event.preventDefault();closeMenu();return;}
 if(event.key==='Tab'){
  const controls=[...menu.querySelectorAll('a[href],button:not([disabled]),[tabindex="0"]')].filter(element=>element.getClientRects().length&&!element.closest('[hidden]'));
  const first=controls[0],last=controls.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 }
});

// Visible local images replace the original hydration-dependent loading masks.
document.querySelectorAll('img').forEach(img=>{img.addEventListener('load',()=>img.style.opacity='1',{once:true});if(img.complete)img.style.opacity='1';});
document.querySelectorAll('a').forEach(a=>{if(a.textContent.trim()==='Start a Project'||a.textContent.trim()==="Let's work together"){a.href='/contact';}});

// Preserve the original light-to-dark progression without requiring Svelte runtime state.
if(location.pathname==='/'){
 const first=[...document.querySelectorAll('section')].find(s=>s.textContent.includes('LATEST WORK'));
 if(first){const parent=first.parentNode;const group=document.createElement('div');group.className='replica-dark-zone';parent.insertBefore(group,first);let node=first;while(node){let next=node.nextSibling;group.appendChild(node);node=next;}}
}

// Contact requests use the server when configured, with a direct email fallback.
const contactForms=[...document.querySelectorAll('.contact-form')];
document.querySelectorAll('.service-options button').forEach(button=>button.addEventListener('click',()=>button.setAttribute('aria-pressed',button.getAttribute('aria-pressed')!=='true'?'true':'false')));
const contactDelivery=contactForms.length?fetch('/api/contact',{signal:AbortSignal.timeout(5000)}).then(r=>r.ok?r.json():null).then(data=>Boolean(data?.available)).catch(()=>false):Promise.resolve(false);
contactDelivery.then(available=>contactForms.forEach(form=>{if(!available){form.querySelector('[type=submit]').textContent='Compose email ↗';form.querySelector('.form-message').textContent='Opens your email app.';}}));
for(const form of contactForms)form.addEventListener('submit',async event=>{
 event.preventDefault();if(!form.reportValidity())return;
 const button=form.querySelector('[type=submit]'),status=form.querySelector('.form-message');if(button.disabled)return;
 const data=new FormData(form);const services=[...form.querySelectorAll('[aria-pressed=true]')].map(b=>b.textContent.trim());
 const payload={name:data.get('name'),email:data.get('email'),phone:data.get('phone'),message:data.get('message'),_hp_website:data.get('_hp_website'),services};
 button.disabled=true;
 try{
  const available=await contactDelivery;
  if(!available){
   const body=`Name: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone||'Not provided'}\nServices: ${services.join(', ')||'Not selected'}\n\n${payload.message}`;
   window.location.href='mailto:hello@damcraft.com?subject='+encodeURIComponent('Project inquiry — '+payload.name)+'&body='+encodeURIComponent(body);
   status.textContent='Your email draft is ready in your email app.';
  }else{
   button.textContent='Sending…';status.textContent='';
   const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(20000)});
   const result=await response.json();if(!response.ok)throw new Error(result.error||'We couldn’t send your message. Please email hello@damcraft.com.');
   status.textContent='Thanks — your message has been sent.';form.reset();form.querySelectorAll('[aria-pressed=true]').forEach(b=>b.setAttribute('aria-pressed','false'));
  }
 }catch(error){status.textContent=error.message||'Please email hello@damcraft.com directly.';}
 finally{button.disabled=false;button.textContent=await contactDelivery?'Send message ↗':'Compose email ↗';}
});

// Extrude the custom D outline with the reconstructed emblem's original material and motion.
async function startHero(){
 const host=document.querySelector('.hero-visual');if(!host)return;
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){document.querySelector('.hero-motion-control')?.setAttribute('hidden','');return;}
 let renderer;
 try{
  const THREE=await import('three');
  const [{SVGLoader},{RoomEnvironment}]=await Promise.all([import('/assets/vendor/SVGLoader.js'),import('/assets/vendor/RoomEnvironment.js')]);
  const canvas=host.querySelector('canvas');
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
  const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(45,1,.1,1000);
  const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(new RoomEnvironment(),.04).texture;pmrem.dispose();
  scene.add(new THREE.AmbientLight(0xffffff,.5));const key=new THREE.DirectionalLight(0xfff5e0,4);key.position.set(60,80,60);scene.add(key);
  const blue=new THREE.PointLight(0x66aaff,8,400);blue.position.set(-80,-40,40);scene.add(blue);
  const warm=new THREE.PointLight(0xff6633,6,400);warm.position.set(40,-80,-40);scene.add(warm);
  const group=new THREE.Group();scene.add(group);
  const svg=await fetch('/assets/hero-d-ribbon.svg').then(r=>r.text());const data=new SVGLoader().parse(svg);
  const box=new THREE.Box3();for(const p of data.paths)for(const shape of SVGLoader.createShapes(p)){const g=new THREE.ExtrudeGeometry(shape,{depth:1,bevelEnabled:false});g.computeBoundingBox();box.union(g.boundingBox);g.dispose();}
  const center=new THREE.Vector3();box.getCenter(center);
  data.paths.forEach((p,index)=>{const progress=index/Math.max(data.paths.length-1,1);const material=new THREE.MeshStandardMaterial({color:new THREE.Color().setHSL(.08+progress*.04,.08,.6+progress*.25),metalness:.98,roughness:.08,envMapIntensity:2.2});for(const shape of SVGLoader.createShapes(p)){const g=new THREE.ExtrudeGeometry(shape,{depth:14,curveSegments:64,bevelEnabled:true,bevelThickness:2,bevelSize:.6,bevelSegments:24});g.translate(-center.x,-center.y,-7);const mesh=new THREE.Mesh(g,material);mesh.scale.y=-1;group.add(mesh);}});
  const bounds=new THREE.Box3().setFromObject(group),size=new THREE.Vector3(),mid=new THREE.Vector3();bounds.getSize(size);bounds.getCenter(mid);group.position.copy(mid).negate();
  const fit=()=>{const w=host.clientWidth,h=host.clientHeight;camera.aspect=w/h;const angle=camera.fov*Math.PI/180;camera.position.z=Math.max(size.y/(Math.tan(angle/2)),size.x/(Math.tan(angle/2)*camera.aspect));camera.updateProjectionMatrix();renderer.setSize(w,h);};
  fit();new ResizeObserver(fit).observe(host);
  const pointer={x:0,y:0},smooth={x:0,y:0};host.parentElement.addEventListener('pointermove',e=>{const r=host.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width-.5)*2;pointer.y=((e.clientY-r.top)/r.height-.5)*2;});host.parentElement.addEventListener('pointerleave',()=>{pointer.x=pointer.y=0;});
  host.classList.add('rendered');const reduced=matchMedia('(prefers-reduced-motion: reduce)');const motionControl=document.querySelector('.hero-motion-control');let userPaused=false;motionControl.hidden=reduced.matches;motionControl.addEventListener('click',()=>{userPaused=!userPaused;motionControl.textContent=userPaused?'Play animation':'Pause animation';});reduced.addEventListener('change',()=>{motionControl.hidden=reduced.matches;});let frame=0;const clock=new THREE.Clock();
  function render(){const paused=reduced.matches||userPaused;const t=clock.getElapsedTime();smooth.x+=((paused?0:pointer.x)-smooth.x)*.055;smooth.y+=((paused?0:pointer.y)-smooth.y)*.055;group.rotation.y=smooth.x*.65+(paused?0:Math.sin(t*.35)*.05);group.rotation.x=smooth.y*.5+(paused?0:Math.sin(t*.28)*.04);group.position.y=5+(paused?0:Math.sin(t*2)*1.4);warm.intensity=5+(paused?0:Math.sin(t*1.8)*2.5);renderer.render(scene,camera);frame=requestAnimationFrame(render);}
  render();window.addEventListener('pagehide',()=>{cancelAnimationFrame(frame);renderer.dispose();},{once:true});
 }catch(error){renderer?.dispose();host.classList.remove('rendered');host.classList.add('fallback');document.querySelector('.hero-motion-control')?.setAttribute('hidden','');console.info('Using the SVG emblem fallback because WebGL is unavailable.');}
}
startHero();
