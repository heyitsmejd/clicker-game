importScripts('/dist/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/dist/_nuxt/282bf2163c81aa3ede5e.js",
    "revision": "d9f45d58445f8d1c671efd3d8823b6a1"
  },
  {
    "url": "/dist/_nuxt/7d688ed3e1a5113c05b9.js",
    "revision": "f5c73c86f4c3335bb847f22f72310c39"
  },
  {
    "url": "/dist/_nuxt/7dd6fa393ea41469afb9.js",
    "revision": "590adb0a05496a181aeec25b7542396b"
  },
  {
    "url": "/dist/_nuxt/8209753ac565bce8bb50.js",
    "revision": "077894961e9da6d782b479b6bb31c8fe"
  },
  {
    "url": "/dist/_nuxt/d4a4f59f6e4d92a8a3de.js",
    "revision": "96fd74e19f315c8e2995e02c7242f0c8"
  },
  {
    "url": "/dist/_nuxt/f8aecd286b9fa1948882.js",
    "revision": "5bc43ee876aac650aa617b0782ad7231"
  }
], {
  "cacheId": "clicker",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/dist/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/dist/.*'), workbox.strategies.networkFirst({}), 'GET')
