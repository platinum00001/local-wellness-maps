const id=new URLSearchParams(location.search).get('map');let M,cur;const imgs={};
const DB=new Promise(r=>{const q=indexedDB.open('wellness-maps',1);q.onupgradeneeded=()=>q.result.createObjectStore('ads');q.onsuccess=()=>r(q.result)});
const tx=async(m,f)=>{const d=await DB;return new Promise((r,j)=>{const t=d.transaction('ads',m),s=t.objectStore('ads'),q=f(s);t.oncomplete=()=>r(q&&q.result);t.onerror=j})};
const key=s=>id+'/'+s;
fit.value=localStorage.getItem('fit')||'cover';fit.onchange=()=>{localStorage.setItem('fit',fit.value);render()};
qr.checked=localStorage.getItem('qr')==='1';qr.onchange=()=>{localStorage.setItem('qr',qr.checked?'1':'0');render()};
fetch('maps.json').then(r=>r.json()).then(async ms=>{M=ms.find(m=>m.id===id)||ms[0];title.textContent=M.title;map.src=M.image;
 for(const s in M.slots){const b=await tx('readonly',st=>st.get(key(s)));if(b)imgs[s]=b}
 // baked ads from repo ads/<map-id>/<slot>.png as fallback
 for(const s in M.slots)if(!imgs[s]){try{const r=await fetch(`ads/${M.id}/${s}.png`);if(r.ok&&r.headers.get('content-type')?.startsWith('image'))imgs[s]=await r.blob()}catch(e){}}
 render()});
function render(){slots.innerHTML='';for(const[s,[x,y,w,h]]of Object.entries(M.slots)){if(s.startsWith('QR')&&!qr.checked)continue;
 const d=document.createElement('div');d.className='slot'+(s.startsWith('QR')?' qr':'')+(imgs[s]?' filled':'');Object.assign(d.style,{left:x*100+'%',top:y*100+'%',width:w*100+'%',height:h*100+'%'});
 d.innerHTML=`<span class="lbl">${s}<br>⬆ Upload</span><span class="x" title="Clear">✕</span>`;
 if(imgs[s]){const i=new Image();i.src=URL.createObjectURL(imgs[s]);i.style.objectFit=fit.value;d.prepend(i)}
 d.onclick=e=>{if(e.target.classList.contains('x')){clear(s);return}cur=s;file.value='';file.click()};
 d.ondragover=e=>{e.preventDefault();d.classList.add('over')};d.ondragleave=()=>d.classList.remove('over');
 d.ondrop=e=>{e.preventDefault();d.classList.remove('over');const f=e.dataTransfer.files[0];if(f&&f.type.startsWith('image'))set(s,f)};
 slots.append(d)}}
file.onchange=()=>{if(file.files[0])set(cur,file.files[0])};
async function set(s,f){imgs[s]=f;await tx('readwrite',st=>st.put(f,key(s)));render()}
async function clear(s){delete imgs[s];await tx('readwrite',st=>st.delete(key(s)));render()}
reset.onclick=async()=>{if(!confirm('Clear every slot on this map?'))return;for(const s in M.slots){delete imgs[s];await tx('readwrite',st=>st.delete(key(s)))}render()};
const load=b=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.src=typeof b==='string'?b:URL.createObjectURL(b)});
png.onclick=async()=>{const base=await load(M.image),c=document.createElement('canvas');c.width=base.naturalWidth;c.height=base.naturalHeight;const g=c.getContext('2d');g.drawImage(base,0,0);
 for(const[s,[x,y,w,h]]of Object.entries(M.slots)){if(!imgs[s])continue;const i=await load(imgs[s]),X=x*c.width,Y=y*c.height,W=w*c.width,H=h*c.height;
  const k=fit.value==='cover'?Math.max(W/i.width,H/i.height):Math.min(W/i.width,H/i.height),dw=i.width*k,dh=i.height*k;
  g.save();g.beginPath();g.rect(X,Y,W,H);g.clip();if(fit.value==='contain'){g.fillStyle='#fff';g.fillRect(X,Y,W,H)}g.drawImage(i,X+(W-dw)/2,Y+(H-dh)/2,dw,dh);g.restore()}
 c.toBlob(b=>dl(b,M.id+'-filled.png'),'image/png')};
zip.onclick=async()=>{const z=new JSZip(),f=z.folder('ads/'+M.id);let n=0;for(const s in imgs){const i=await load(imgs[s]),c=document.createElement('canvas');c.width=i.width;c.height=i.height;c.getContext('2d').drawImage(i,0,0);f.file(s+'.png',await new Promise(r=>c.toBlob(r,'image/png')));n++}
 if(!n)return alert('No ads uploaded yet.');dl(await z.generateAsync({type:'blob'}),M.id+'-ads.zip')};
function dl(b,n){const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=n;a.click()}
