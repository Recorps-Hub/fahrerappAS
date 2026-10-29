// Offline-Speicher der App. Bei jeder neuen Version VERSION erhöhen (macht build-web.ps1 automatisch).
const VERSION = "fk-1.8-20261029095701";
const FILES = ["./", "index.html", "jspdf.umd.min.js", "logo.js", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Immer zuerst aus dem Offline-Speicher; Internet wird nur für Updates genutzt
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request)));
});
