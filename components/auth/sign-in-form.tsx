"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signInWithEmail, getAuthErrorMessage } from "@/lib/auth-helpers"
import { useTranslation } from "@/lib/i18n"

interface SignInFormProps {
  userType: "student" | "teacher"
  onToggleMode?: () => void
}

export function SignInForm({ userType, onToggleMode }: SignInFormProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await signInWithEmail(formData.email, formData.password)
      // Redirect based on user type
      router.push(userType === "student" ? "/student" : "/teacher")
    } catch (error: any) {
      setError(getAuthErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  const iconColor = userType === "student" ? "bg-emerald-600" : "bg-blue-600"
  const icon = userType === "student" ? "📖" : "👩‍🏫"

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="text-center pb-6">
        <div className={`w-16 h-16 ${iconColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
          <span className="text-3xl text-white">{icon}</span>
        </div>
        <CardTitle className="text-2xl font-bold text-slate-800">
          {userType === "student" ? t("studentPortal") : t("facultyPortal")}
        </CardTitle>
        <CardDescription className="text-slate-600">
          {userType === "student" ? t("enterCredentials") : t("accessTeacherDashboard")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="email">{t("emailAddress")}</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={t("enterEmail")}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={t("enterPassword")}
              className="h-12"
            />
          </div>

          <Button
            type="submit"
            className={`w-full h-12 text-white font-medium text-lg ${
              userType === "student" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? t("signingIn") : `${t("signIn")} ${icon}`}
          </Button>
        </form>

        <div className="mt-6 text-center">
          {onToggleMode && (
            <button
              onClick={onToggleMode}
              className={`font-medium ${
                userType === "student" ? "text-emerald-600 hover:text-emerald-700" : "text-blue-600 hover:text-blue-700"
              }`}
            >
              {t("dontHaveAccount")}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
