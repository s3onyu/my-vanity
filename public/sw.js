/**
 * 최소 서비스 워커.
 * 홈 화면에 설치했을 때 앱처럼 열리게 하고, 네트워크가 끊겨도 첫 화면이 뜨도록 index.html 만 캐시한다.
 * 항상 네트워크를 먼저 쓰기 때문에 배포한 새 버전이 곧바로 반영된다.
 */
const CACHE = 'my-vanity-shell-v1';
const SHELL = '/index.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.add(SHELL))
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // 화면 이동만 다룬다. API·이미지·스크립트는 브라우저 기본 동작에 맡긴다.
  if (request.mode !== 'navigate') return;
  event.respondWith(
    fetch(request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(SHELL, copy)).catch(() => undefined);
        return res;
      })
      .catch(() => caches.match(SHELL).then((hit) => hit ?? Response.error())),
  );
});
