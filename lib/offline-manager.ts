export interface OfflineData {
  id: string
  type: "quiz" | "analytics" | "progress"
  data: any
  timestamp: number
  synced: boolean
}

export interface SyncStatus {
  isOnline: boolean
  lastSync: number | null
  pendingItems: number
  syncInProgress: boolean
}

class OfflineManager {
  private static instance: OfflineManager
  private db: IDBDatabase | null = null
  private syncStatus: SyncStatus = {
    isOnline: navigator.onLine,
    lastSync: null,
    pendingItems: 0,
    syncInProgress: false,
  }
  private listeners: ((status: SyncStatus) => void)[] = []

  static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager()
    }
    return OfflineManager.instance
  }

  constructor() {
    if (typeof window !== "undefined") {
      this.initializeDB()
      this.setupEventListeners()
      this.loadSyncStatus()
    }
  }

  private async initializeDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("LearnChamp", 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        this.updatePendingCount()
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        if (!db.objectStoreNames.contains("syncQueue")) {
          const syncStore = db.createObjectStore("syncQueue", { keyPath: "id", autoIncrement: true })
          syncStore.createIndex("timestamp", "timestamp")
          syncStore.createIndex("type", "type")
        }

        if (!db.objectStoreNames.contains("analytics")) {
          const analyticsStore = db.createObjectStore("analytics", { keyPath: "id", autoIncrement: true })
          analyticsStore.createIndex("timestamp", "timestamp")
        }

        if (!db.objectStoreNames.contains("gameData")) {
          const gameStore = db.createObjectStore("gameData", { keyPath: "id" })
          gameStore.createIndex("subject", "subject")
          gameStore.createIndex("grade", "grade")
        }
      }
    })
  }

  private setupEventListeners(): void {
    window.addEventListener("online", () => {
      this.syncStatus.isOnline = true
      this.notifyListeners()
      this.syncPendingData()
    })

    window.addEventListener("offline", () => {
      this.syncStatus.isOnline = false
      this.notifyListeners()
    })

    // Listen for service worker messages
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "SYNC_UPDATE") {
          this.syncStatus.lastSync = event.data.timestamp
          this.notifyListeners()
        }
      })
    }
  }

  private loadSyncStatus(): void {
    const stored = localStorage.getItem("learnchamp-sync-status")
    if (stored) {
      const storedStatus = JSON.parse(stored)
      this.syncStatus = { ...this.syncStatus, ...storedStatus }
    }
  }

  private saveSyncStatus(): void {
    localStorage.setItem("learnchamp-sync-status", JSON.stringify(this.syncStatus))
  }

  async queueForSync(type: "quiz" | "analytics" | "progress", data: any): Promise<void> {
    if (!this.db) await this.initializeDB()

    const item: Omit<OfflineData, "id"> = {
      type,
      data,
      timestamp: Date.now(),
      synced: false,
    }

    const transaction = this.db!.transaction(["syncQueue"], "readwrite")
    const store = transaction.objectStore("syncQueue")

    await new Promise<void>((resolve, reject) => {
      const request = store.add(item)
      request.onsuccess = () => {
        this.updatePendingCount()
        resolve()
      }
      request.onerror = () => reject(request.error)
    })

    // Try immediate sync if online
    if (this.syncStatus.isOnline) {
      this.syncPendingData()
    }
  }

  async syncPendingData(): Promise<void> {
    if (!this.db || this.syncStatus.syncInProgress) return

    this.syncStatus.syncInProgress = true
    this.notifyListeners()

    try {
      const transaction = this.db.transaction(["syncQueue"], "readwrite")
      const store = transaction.objectStore("syncQueue")

      const request = store.getAll()
      const items = await new Promise<OfflineData[]>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })

      for (const item of items) {
        try {
          await this.syncItem(item)

          // Remove from queue after successful sync
          const deleteTransaction = this.db.transaction(["syncQueue"], "readwrite")
          const deleteStore = deleteTransaction.objectStore("syncQueue")
          await new Promise<void>((resolve, reject) => {
            const deleteRequest = deleteStore.delete(item.id)
            deleteRequest.onsuccess = () => resolve()
            deleteRequest.onerror = () => reject(deleteRequest.error)
          })
        } catch (error) {
          console.log("[OfflineManager] Failed to sync item:", item.id, error)
        }
      }

      this.syncStatus.lastSync = Date.now()
      this.updatePendingCount()
    } catch (error) {
      console.error("[OfflineManager] Sync failed:", error)
    } finally {
      this.syncStatus.syncInProgress = false
      this.saveSyncStatus()
      this.notifyListeners()
    }
  }

  private async syncItem(item: OfflineData): Promise<void> {
    const endpoint = `/api/sync/${item.type}`

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item.data),
    })

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status}`)
    }
  }

  private async updatePendingCount(): Promise<void> {
    if (!this.db) return

    const transaction = this.db.transaction(["syncQueue"], "readonly")
    const store = transaction.objectStore("syncQueue")

    const request = store.count()
    const count = await new Promise<number>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })

    this.syncStatus.pendingItems = count
    this.notifyListeners()
  }

  async storeGameData(gameId: string, subject: string, grade: number, data: any): Promise<void> {
    if (!this.db) await this.initializeDB()

    const gameData = {
      id: gameId,
      subject,
      grade,
      data,
      timestamp: Date.now(),
    }

    const transaction = this.db!.transaction(["gameData"], "readwrite")
    const store = transaction.objectStore("gameData")

    await new Promise<void>((resolve, reject) => {
      const request = store.put(gameData)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getGameData(subject?: string, grade?: number): Promise<any[]> {
    if (!this.db) await this.initializeDB()

    const transaction = this.db!.transaction(["gameData"], "readonly")
    const store = transaction.objectStore("gameData")

    let request: IDBRequest
    if (subject) {
      const index = store.index("subject")
      request = index.getAll(subject)
    } else if (grade) {
      const index = store.index("grade")
      request = index.getAll(grade)
    } else {
      request = store.getAll()
    }

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  onSyncStatusChange(callback: (status: SyncStatus) => void): () => void {
    this.listeners.push(callback)

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((callback) => callback(this.syncStatus))
  }

  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus }
  }

  async clearAllData(): Promise<void> {
    if (!this.db) return

    const transaction = this.db.transaction(["syncQueue", "analytics", "gameData"], "readwrite")

    await Promise.all([
      new Promise<void>((resolve, reject) => {
        const request = transaction.objectStore("syncQueue").clear()
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      }),
      new Promise<void>((resolve, reject) => {
        const request = transaction.objectStore("analytics").clear()
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      }),
      new Promise<void>((resolve, reject) => {
        const request = transaction.objectStore("gameData").clear()
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      }),
    ])

    this.syncStatus.pendingItems = 0
    this.syncStatus.lastSync = null
    this.saveSyncStatus()
    this.notifyListeners()
  }
}

export const offlineManager = OfflineManager.getInstance()
