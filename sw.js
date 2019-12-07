// WORKBOX SERVICE WORKER LIBRARY (CDN)
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js'); 

const BASE_URL_API_FOOTBALL = 'https://api.football-data.org/v2/';

// Force development builds
// workbox.setConfig({ debug: true });

// Force production builds 
workbox.setConfig({ debug: false }); 

// CHECKING WORKBOX
if (workbox) {
  console.log('[WORKBOX] SUCCESSFULLY TO LOADED');

  // CONFIG CHACHE NAME
  workbox.core.setCacheNameDetails({
    prefix: 'PL',
    suffix: '',
    precache: 'appshell',
    runtime: 'runtime'
  });

  // PRECACHING APP SHELL
  workbox.precaching.precacheAndRoute([
    { url: '/index.html', revision: '1' },
    { url: '/manifest.json', revision: '1' },
    { url: '/sw.js', revision: '1' },
    { url: '/icon.png', revision: '1' },
    { url: '/templates/nav-anchor.html', revision: '1' },
    { url: '/assets/css/materialize.min.css', revision: '1' },
    { url: '/assets/css/normalize.css', revision: '1' },
    { url: '/assets/css/style.css', revision: '1' },
    { url: '/assets/js/materialize/materialize.min.js', revision: '1' },
    { url: '/assets/js/indexedDb/idb.js', revision: '1' },
    { url: '/assets/js/main-app.js', revision: '1' },
    { url: '/assets/js/main-api-football.js', revision: '1' },
    { url: '/assets/js/main-idb-transaction.js', revision: '1' },
    { url: '/assets/js/main-pwa.js', revision: '1' }
  ]);

  // CACHING PAGES
  workbox.routing.registerRoute(
    new RegExp('/pages/'),
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'PL-pages'
    })
  );

  // CACHING IMAGES
  workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
      cacheName: 'PL-images',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    }),
  );
    
  // CACHING FOOTBALL DATA
  workbox.routing.registerRoute(
    /^http:\/\/api\.football-data\.com\/v2\//,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'PL-football-data',
      plugins: [
        new workbox.expiration.Plugin({
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
        })
      ]
    })
  );

} else {
  console.log('[WORKBOX] FAILED TO LOADED');
}

// SERVICE WORKER EVENT FETCH
self.addEventListener('fetch', function(e) {
  // console.log(e.request.url);
  if (e.request.url.indexOf(BASE_URL_API_FOOTBALL) > -1) {
    e.respondWith(
      caches.open('PL-football-data').then(function(cache) {
        return fetch(e.request).then(function(response) {
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request, { ignoreSearch: true }).then(function(response) {
        return response || fetch(e.request);  
      })
    );
  }
});