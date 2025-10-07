"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/language-selector"
import { useTranslation } from "@/lib/i18n"
import { SignInForm } from "@/components/auth/sign-in-form"
import { SignUpForm } from "@/components/auth/sign-up-form"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

export default function HomePage() {
  const { t } = useTranslation()
  const { user, userProfile, signOut } = useAuth()
  const [isOnline, setIsOnline] = useState(true)
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [authMode, setAuthMode] = useState<"signin" | "signup" | null>(null)
  const [userType, setUserType] = useState<"student" | "teacher">("student")

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[SW] Registration successful:", registration)
        })
        .catch((error) => {
          console.log("[SW] Registration failed:", error)
        })
    }

    // Handle online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    setIsOnline(navigator.onLine)

    // Handle PWA install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallApp = async () => {
    if (installPrompt) {
      installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      if (outcome === "accepted") {
        setInstallPrompt(null)
      }
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      setAuthMode(null)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (user && userProfile) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b-4 border-emerald-300 bg-slate-50 shadow-lg">
          <div className="container mx-auto px-4 py-4 md:py-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl md:text-3xl text-white">📚</span>
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-slate-700 flex items-center gap-2">
                    {t("appName")}
                    <span style={{ fontSize: "16px" }} className="md:text-xl">
                      ✨
                    </span>
                  </h1>
                  <p className="text-xs md:text-sm text-slate-500 font-medium">{t("ruralLearning")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <div className="text-sm text-slate-600">Welcome, {userProfile.displayName}!</div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="rounded-full font-bold bg-transparent"
                >
                  Logout
                </Button>
                <div
                  className={`px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold flex items-center gap-1 md:gap-2 ${
                    isOnline ? "bg-emerald-600 text-white" : "bg-red-500 text-white"
                  }`}
                >
                  <span className="text-sm md:text-base">{isOnline ? "📶" : "📵"}</span>
                  <span>{isOnline ? t("online") : t("offline")}</span>
                </div>
                <LanguageSelector />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Section */}
        <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-white via-slate-50 to-slate-100">
          <div className="container mx-auto text-center max-w-4xl">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-6 md:mb-8">Welcome to Your Dashboard!</h2>
            <p className="text-lg md:text-xl text-slate-600 mb-8 md:mb-10">
              Ready to start learning? Choose your path below.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={userProfile.userType === "student" ? "/student" : "/teacher"}>
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg">
                  {userProfile.userType === "student" ? "📖 Student Portal" : "👩‍🏫 Teacher Dashboard"}
                </Button>
              </Link>
              <Link href="/student?guest=true">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg bg-transparent">
                  👤 Try as Guest
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 md:py-12 px-4 border-t-4 border-emerald-500 bg-gradient-to-r from-slate-100 to-slate-50">
          <div className="container mx-auto text-center">
            <div className="flex justify-center gap-2 md:gap-3 mb-3 md:mb-4">
              <span className="text-lg md:text-xl">💚</span>
              <span className="text-lg md:text-xl">✨</span>
              <span className="text-lg md:text-xl">💚</span>
            </div>
            <p className="text-slate-600 font-medium text-base md:text-lg">
              {t("appName")} - {t("makingLearningFun")}
            </p>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-4 border-emerald-300 bg-slate-50 shadow-lg">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl md:text-3xl text-white">📚</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-700 flex items-center gap-2">
                  {t("appName")}
                  <span style={{ fontSize: "16px" }} className="md:text-xl">
                    ✨
                  </span>
                </h1>
                <p className="text-xs md:text-sm text-slate-500 font-medium">{t("ruralLearning")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <div
                className={`px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold flex items-center gap-1 md:gap-2 ${
                  isOnline ? "bg-emerald-600 text-white" : "bg-red-500 text-white"
                }`}
              >
                <span className="text-sm md:text-base">{isOnline ? "📶" : "📵"}</span>
                <span>{isOnline ? t("online") : t("offline")}</span>
              </div>
              <LanguageSelector />
              {installPrompt && (
                <Button
                  onClick={handleInstallApp}
                  size="sm"
                  variant="outline"
                  className="rounded-full font-bold bg-transparent text-xs md:text-sm px-2 md:px-4"
                >
                  {t("installApp")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-white via-slate-50 to-slate-100">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="flex justify-center gap-2 md:gap-4 mb-4 md:mb-6">
            <span className="text-2xl md:text-4xl animate-bounce" style={{ animationDelay: "0.2s" }}>
              ⭐
            </span>
            <span className="text-2xl md:text-4xl animate-bounce" style={{ animationDelay: "0.4s" }}>
              💚
            </span>
            <span className="text-2xl md:text-4xl animate-bounce" style={{ animationDelay: "0.6s" }}>
              ⭐
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold text-slate-800 mb-6 md:mb-8 text-balance leading-tight">
            {t("learnStemThrough")}
            <span
              style={{
                background: "linear-gradient(to right, #059669, #10b981, #059669)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {" "}
              {t("funGames")}
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 mb-8 md:mb-10 text-pretty max-w-2xl mx-auto font-medium">
            {t("appDescription")}
          </p>

          <div className="flex flex-col items-center gap-6 md:gap-8">
            {!authMode ? (
              <div className="w-full max-w-md space-y-4 md:space-y-6">
                <div className="space-y-3">
                  <h4 className="text-lg md:text-xl font-medium text-slate-700 flex items-center gap-2 justify-center">
                    <span className="text-xl md:text-2xl">🔐</span>
                    Choose Your Portal
                  </h4>
                  <p className="text-sm md:text-base text-slate-600 text-center">
                    Sign in to access your personalized learning experience
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => {
                      setUserType("student")
                      setAuthMode("signin")
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 h-auto flex flex-col gap-2"
                  >
                    <span className="text-2xl">📖</span>
                    <span className="text-sm">Student</span>
                  </Button>
                  <Button
                    onClick={() => {
                      setUserType("teacher")
                      setAuthMode("signin")
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-4 h-auto flex flex-col gap-2"
                  >
                    <span className="text-2xl">👩‍🏫</span>
                    <span className="text-sm">Teacher</span>
                  </Button>
                </div>

                <div className="text-center pt-4 border-t border-slate-200">
                  <Link href="/student?guest=true">
                    <Button variant="outline" className="text-slate-600 hover:text-slate-800 bg-transparent">
                      <span className="text-base mr-2">👤</span>
                      {t("tryAsGuest")}
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-md">
                <div className="mb-4 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => setAuthMode(null)}
                    className="text-slate-600 hover:text-slate-800"
                  >
                    ← Back to Portal Selection
                  </Button>
                </div>

                {authMode === "signin" ? (
                  <SignInForm userType={userType} onToggleMode={() => setAuthMode("signup")} />
                ) : (
                  <SignUpForm userType={userType} onToggleMode={() => setAuthMode("signin")} />
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-12 px-4 border-t-4 border-emerald-500 bg-gradient-to-r from-slate-100 to-slate-50">
        <div className="container mx-auto text-center">
          <div className="flex justify-center gap-2 md:gap-3 mb-3 md:mb-4">
            <span className="text-lg md:text-xl">💚</span>
            <span className="text-lg md:text-xl">✨</span>
            <span className="text-lg md:text-xl">💚</span>
          </div>
          <p className="text-slate-600 font-medium text-base md:text-lg">
            {t("appName")} - {t("makingLearningFun")}
          </p>
        </div>
      </footer>
    </div>
  )
}
