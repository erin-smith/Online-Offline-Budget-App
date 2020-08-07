console.log("Hi from your service-worker.js file!");

const FILES_TO_CACHE = [ "/", "/index.html", "index.js", "manifest.webmanifest", "icons/money.jpg", "icons/pig.png", "db.js"];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

// install the service worker
self.addEventListener("install", function(event) {
    console.log("service worker installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      //make sure files cache or addall completely fails
        const x = cache.addAll(FILES_TO_CACHE);
        console.log("Your files were pre-cached successfullllly!");
        return x;
    })
  );
});

// activate
self.addEventListener("activate", function(event) {
    console.log("hello from activation vacation");
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// fetch
self.addEventListener("fetch", function(evt) {
  if (evt.request.url.includes("/api/")) {
    evt.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(evt.request)
          .then(response => {
            // If the response was good, clone it and store it in the cache.
            if (response.status === 200) {
              cache.put(evt.request.url, response.clone());
            }

            return response;
          })
          .catch(err => {
            // Network request failed, try to get it from the cache.
            return cache.match(evt.request);
          });
      }).catch(err => console.log(err))
    );

    return;
  }

  evt.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(evt.request).then(response => {
        return response || fetch(evt.request);
      });
    })
  );
});

console.log("sw ok");