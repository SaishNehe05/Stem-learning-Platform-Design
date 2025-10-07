const CACHE_NAME = "learnchamp-v2"
const STATIC_CACHE = "learnchamp-static-v2"
const DYNAMIC_CACHE = "learnchamp-dynamic-v2"

const urlsToCache = [
  "/",
  "/student",
  "/teacher",
  "/auth",
  "/offline",
  "/manifest.json",
  "/icon-192.jpg",
  "/icon-512.jpg",
  "/student/onboarding",
  "/teacher/setup",
]

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log("[SW] Caching static resources")
        return cache.addAll(urlsToCache)
      }),
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log("[SW] Dynamic cache ready")
        return cache
      }),
    ]),
  )
  self.skipWaiting()
})

// Fetch event - enhanced offline strategy
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Fallback to cached API response
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }
            // Return offline indicator for failed API calls
            return new Response(
              JSON.stringify({
                error: "offline",
                message: "Data will sync when connection is restored",
              }),
              {
                status: 503,
                headers: { "Content-Type": "application/json" },
              },
            )
          })
        }),
    )
    return
  }

  // Handle static resources with cache-first strategy
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.ok && request.method === "GET") {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Show offline page for navigation requests
          if (request.destination === "document") {
            return caches.match("/offline")
          }
          // Return empty response for other failed requests
          return new Response("", { status: 408 })
        })
    }),
  )
})

// Background sync for queued data
self.addEventListener("sync", (event) => {
  if (event.tag === "quiz-sync") {
    event.waitUntil(syncQuizData())
  }
  if (event.tag === "analytics-sync") {
    event.waitUntil(syncAnalyticsData())
  }
})

async function syncQuizData() {
  try {
    // Get queued quiz results from IndexedDB
    const db = await openDB()
    const transaction = db.transaction(["syncQueue"], "readonly")
    const store = transaction.objectStore("syncQueue")
    const queuedItems = await store.getAll()

    for (const item of queuedItems) {
      try {
        await fetch("/api/sync/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item.data),
        })

        // Remove from queue after successful sync
        const deleteTransaction = db.transaction(["syncQueue"], "readwrite")
        const deleteStore = deleteTransaction.objectStore("syncQueue")
        await deleteStore.delete(item.id)
      } catch (error) {
        console.log("[SW] Failed to sync item:", item.id)
      }
    }
  } catch (error) {
    console.log("[SW] Background sync failed:", error)
  }
}

async function syncAnalyticsData() {
  try {
    const db = await openDB()
    const transaction = db.transaction(["analytics"], "readonly")
    const store = transaction.objectStore("analytics")
    const analyticsData = await store.getAll()

    if (analyticsData.length > 0) {
      await fetch("/api/sync/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(analyticsData),
      })

      // Clear analytics after sync
      const clearTransaction = db.transaction(["analytics"], "readwrite")
      const clearStore = clearTransaction.objectStore("analytics")
      await clearStore.clear()
    }
  } catch (error) {
    console.log("[SW] Analytics sync failed:", error)
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("LearnChamp", 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result

      if (!db.objectStoreNames.contains("syncQueue")) {
        const syncStore = db.createObjectStore("syncQueue", { keyPath: "id", autoIncrement: true })
        syncStore.createIndex("timestamp", "timestamp")
      }

      if (!db.objectStoreNames.contains("analytics")) {
        const analyticsStore = db.createObjectStore("analytics", { keyPath: "id", autoIncrement: true })
        analyticsStore.createIndex("timestamp", "timestamp")
      }

      if (!db.objectStoreNames.contains("gameData")) {
        const gameStore = db.createObjectStore("gameData", { keyPath: "id" })
        gameStore.createIndex("subject", "subject")
      }
    }
  })
}

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("[SW] Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      }),
      self.clients.claim(),
    ]),
  )
})

// Handle push notifications for offline sync status
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SYNC_STATUS") {
    // Broadcast sync status to all clients
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: "SYNC_UPDATE",
          status: event.data.status,
          timestamp: Date.now(),
        })
      })
    })
  }
})
