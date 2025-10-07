"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredUserType?: "student" | "teacher"
  redirectTo?: string
}

export function ProtectedRoute({ children, requiredUserType, redirectTo = "/" }: ProtectedRouteProps) {
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo)
        return
      }

      if (requiredUserType && userProfile?.userType !== requiredUserType) {
        router.push(redirectTo)
        return
      }
    }
  }, [user, userProfile, loading, requiredUserType, redirectTo, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || (requiredUserType && userProfile?.userType !== requiredUserType)) {
    return null
  }

  return <>{children}</>
}
