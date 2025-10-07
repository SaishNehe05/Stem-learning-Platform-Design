"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"

type UserType = "student" | "teacher"

export interface AppUser {
  uid: string
  email: string
  displayName: string
  userType: UserType
}

export interface AppUserProfile {
  uid: string
  email: string
  displayName: string
  userType: UserType
  grade?: number
  school?: string
  subjects?: string[]
  facultyId?: string
  phone?: string
  createdAt: string
}

interface AuthContextType {
  user: AppUser | null
  userProfile: AppUserProfile | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Keys used in localStorage
const CURRENT_USER_KEY = "currentUser"

function readCurrentUser(): AppUser | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY)
    return raw ? (JSON.parse(raw) as AppUser) : null
  } catch {
    return null
  }
}

function readUserProfile(uid?: string | null): AppUserProfile | null {
  if (!uid) return null
  try {
    const raw = localStorage.getItem(`userProfile_${uid}`)
    return raw ? (JSON.parse(raw) as AppUserProfile) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [userProfile, setUserProfile] = useState<AppUserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize from localStorage on mount
  useEffect(() => {
    const initialUser = readCurrentUser()
    const initialProfile = readUserProfile(initialUser?.uid ?? null)
    setUser(initialUser)
    setUserProfile(initialProfile)
    setLoading(false)
  }, [])

  // Listen to our custom "auth-change" event fired by auth-helpers
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { user: AppUser | null; userProfile: AppUserProfile | null }
      setUser(detail.user)
      setUserProfile(detail.userProfile)
    }
    window.addEventListener("auth-change", handler as EventListener)
    return () => window.removeEventListener("auth-change", handler as EventListener)
  }, [])

  // Also respond to storage events (e.g., another tab)
  useEffect(() => {
    const onStorage = () => {
      const updatedUser = readCurrentUser()
      const updatedProfile = readUserProfile(updatedUser?.uid ?? null)
      setUser(updatedUser)
      setUserProfile(updatedProfile)
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const signOut = useCallback(async () => {
    // Clear only the current user key; keep the profile data for future logins
    localStorage.removeItem(CURRENT_USER_KEY)
    const detail = { user: null, userProfile: null }
    window.dispatchEvent(new CustomEvent("auth-change", { detail }))
  }, [])

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
