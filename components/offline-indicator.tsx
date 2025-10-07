"use client"

import { useState, useEffect } from "react"
import {
  WifiOffIcon as WifiOff,
  ClockIcon as Clock,
  CheckCircleIcon as CheckCircle,
  AlertCircleIcon as AlertCircle,
} from "@/lib/icons"
import { offlineManager, type SyncStatus } from "@/lib/offline-manager"
import { useTranslation } from "@/lib/i18n"

export function OfflineIndicator() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(offlineManager.getSyncStatus())
  const { t } = useTranslation()

  useEffect(() => {
    const unsubscribe = offlineManager.onSyncStatusChange(setSyncStatus)
    return unsubscribe
  }, [])

  const getStatusColor = () => {
    if (!syncStatus.isOnline) return "text-red-500"
    if (syncStatus.syncInProgress) return "text-yellow-500"
    if (syncStatus.pendingItems > 0) return "text-orange-500"
    return "text-green-500"
  }

  const getStatusIcon = () => {
    if (!syncStatus.isOnline) return <WifiOff className="h-4 w-4" />
    if (syncStatus.syncInProgress) return <Clock className="h-4 w-4 animate-spin" />
    if (syncStatus.pendingItems > 0) return <AlertCircle className="h-4 w-4" />
    return <CheckCircle className="h-4 w-4" />
  }

  const getStatusText = () => {
    if (!syncStatus.isOnline) return t("offline")
    if (syncStatus.syncInProgress) return t("syncing")
    if (syncStatus.pendingItems > 0) return t("pendingSync", { count: syncStatus.pendingItems })
    return t("synced")
  }

  const getLastSyncText = () => {
    if (!syncStatus.lastSync) return t("neverSynced")

    const now = Date.now()
    const diff = now - syncStatus.lastSync
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return t("lastSyncDays", { days })
    if (hours > 0) return t("lastSyncHours", { hours })
    if (minutes > 0) return t("lastSyncMinutes", { minutes })
    return t("justSynced")
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`flex items-center gap-1 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="font-medium">{getStatusText()}</span>
      </div>

      {syncStatus.isOnline && syncStatus.lastSync && (
        <span className="text-muted-foreground text-xs">{getLastSyncText()}</span>
      )}

      {!syncStatus.isOnline && <span className="text-xs text-muted-foreground">{t("offlineMode")}</span>}
    </div>
  )
}
