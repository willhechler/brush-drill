// Brush Drill offline cache, version 5afdcc1122
const CACHE="brush-drill-5afdcc1122";
const FILES=["./","index.html","manifest.webmanifest","icon-180.png","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:"reload"})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// The page itself: network first (newest version whenever online), saved copy if offline or the network is too slow.
// Everything else (icons, manifest): saved copy first.
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;
  const page=r.mode==="navigate"||/\/(index\.html)?$/.test(new URL(r.url).pathname);
  if(page){
    e.respondWith(new Promise(done=>{let over=false;
      const fallback=()=>{if(over)return;over=true;caches.match("index.html").then(c=>done(c||fetch(r)))};
      const t=setTimeout(fallback,4000);
      fetch(r.url,{cache:"no-store"}).then(res=>{if(!res.ok)throw 0;clearTimeout(t);const c=res.clone();caches.open(CACHE).then(x=>x.put("index.html",c));if(!over){over=true;done(res)}}).catch(()=>{clearTimeout(t);fallback()});
    }));return;
  }
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(c=>c||fetch(r).then(res=>{const c2=res.clone();caches.open(CACHE).then(x=>x.put(r,c2));return res}).catch(()=>caches.match("index.html"))))});
