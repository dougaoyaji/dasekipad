/* 打席入力パッドの Service Worker。電波の弱い球場でも開けるように、全部をキャッシュする。
   ※ ファイルを直したら CACHE_VERSION を必ず上げること（上げないと、ホーム画面の古い版が残り続ける） */
const CACHE_VERSION = "pad-v1";
const ASSETS = ["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png", "icon-maskable-512.png"];
self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE_VERSION).then(function(c){ return c.addAll(ASSETS); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== CACHE_VERSION; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener("fetch", function(e){
  if(e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, {ignoreSearch:true}).then(function(hit){
    return hit || fetch(e.request);
  }));
});
