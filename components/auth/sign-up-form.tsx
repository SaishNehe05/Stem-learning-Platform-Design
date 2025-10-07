"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signUpWithEmail, getAuthErrorMessage, type SignUpData } from "@/lib/auth-helpers"
import { useTranslation } from "@/lib/i18n"

interface SignUpFormProps {
  userType: "student" | "teacher"
  onToggleMode?: () => void
}

export function SignUpForm({ userType, onToggleMode }: SignUpFormProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    grade: "",
    school: "",
    facultyId: "",
    phone: "",
    subjects: [] as string[],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubjectChange = (subject: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, subjects: [...formData.subjects, subject] })
    } else {
      setFormData({ ...formData, subjects: formData.subjects.filter((s) => s !== subject) })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const signUpData: SignUpData = {
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName,
        userType,
        ...(userType === "student" && {
          grade: formData.grade ? Number.parseInt(formData.grade) : undefined,
          school: formData.school,
        }),
        ...(userType === "teacher" && {
          school: formData.school,
          facultyId: formData.facultyId,
          phone: formData.phone,
          subjects: formData.subjects,
        }),
      }

      await signUpWithEmail(signUpData)
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
  const subjects = [t("mathematics"), t("science"), t("technology"), t("engineering")]

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="text-center pb-6">
        <div className={`w-16 h-16 ${iconColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
          <span className="text-3xl text-white">{icon}</span>
        </div>
        <CardTitle className="text-2xl font-bold text-slate-800">
          {t("signUp")} - {userType === "student" ? t("studentPortal") : t("facultyPortal")}
        </CardTitle>
        <CardDescription className="text-slate-600">
          {userType === "student" ? t("startSTEMJourney") : t("joinPlatformManage")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="displayName">{t("fullName")}</Label>
            <Input
              id="displayName"
              type="text"
              required
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              placeholder={t("enterFullName")}
              className="h-12"
            />
          </div>

          {userType === "student" && (
            <div className="space-y-2">
              <Label htmlFor="grade">{t("grade")}</Label>
              <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={t("selectGrade")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">Grade 6</SelectItem>
                  <SelectItem value="7">Grade 7</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {userType === "teacher" && (
            <div className="space-y-2">
              <Label htmlFor="facultyId">{t("facultyId")}</Label>
              <Input
                id="facultyId"
                type="text"
                required
                value={formData.facultyId}
                onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                placeholder={t("enterFacultyId")}
                className="h-12"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="school">{t("school")}</Label>
            <Input
              id="school"
              type="text"
              required
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              placeholder={t("enterSchoolName")}
              className="h-12"
            />
          </div>

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

          {userType === "teacher" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">{t("phoneNumber")}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={t("enterPhoneNumber")}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label>{t("subjectsTaught")}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {subjects.map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject}
                        checked={formData.subjects.includes(subject)}
                        onCheckedChange={(checked) => handleSubjectChange(subject, checked as boolean)}
                      />
                      <Label htmlFor={subject} className="text-sm">
                        {subject}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={t("createPassword")}
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
            {isLoading ? t("creatingAccount") : `${t("createAccount")} 🚀`}
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
              {t("alreadyHaveAccount")}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
