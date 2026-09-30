const CACHE="nexumid-salud-shell-v4";
const SHELL=["/salud.html","/salud-manifest.webmanifest","/salud-icon-192.png","/salud-icon-512.png","/salud-banner.png"];
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).catch(()=>{}));
 self.skipWaiting();
});
self.addEventListener("activate",event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
 self.clients.claim();
});
self.addEventListener("fetch",event=>{
 const u=new URL(event.request.url);
 if(event.request.mode==="navigate" && u.origin===self.location.origin && u.pathname==="/salud.html"){
   event.respondWith(fetch(event.request).then(r=>{
     if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put("/salud.html",copy))}
     return r;
   }).catch(()=>caches.match("/salud.html")));
 }
});