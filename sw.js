const SERVER = location.protocol + '//' + location.host;
const MODULES_MAP = 'modules.json';

const openCache = caches.open(SERVER);

let modules = fetch(MODULES_MAP).then(b => b.json());
addEventListener('install', event => {
  event.waitUntil(openCache.then(cache => cache.addAll([
    MODULES_MAP
  ])));
});

const responses = {};
addEventListener('fetch', event => {
  const request = event.request;
  if (/^\/[:@!~]([^?]+)/.test(request.url.slice(SERVER.length))) {
    const name = RegExp.$1;
    event.respondWith(
      (responses[name] ||
        (responses[name] = modules.then(m => fetch(m[name])
          .then(b => b.text())
          .then(body => new Response(body, {
            headers: {'Content-Type': 'application/javascript'}
          })))))
      .then(response => response.clone())
    );
  } else {
      event.respondWith(
        openCache.then(cache => cache.match(request).then(
          response => {
            const remote = fetch(request).then(
              response => {
                if (200 <= response.status && response.status < 400) {
                  cache.put(request, response.clone());
                }
                return response;
              },
              console.warn
            );
            return response ? any([response, remote]) : remote;
          }
        ))
      );
  }
});

const any = $ => new Promise((D, E, A, L) => {
  A = [];
  L = $.map(($, i) => Promise
      .resolve($)
      .then(D, O => (((A[i] = O), --L) || E(A)))
  ).length;
});
