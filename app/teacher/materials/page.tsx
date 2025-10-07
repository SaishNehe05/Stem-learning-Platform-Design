"use client"

import { MaterialUpload } from "@/components/material-upload"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BookOpen } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n"

export default function MaterialsPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/teacher" className="flex items-center gap-3">
              <ArrowLeft className="w-5 h-5" />
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-foreground">{t("learningMaterials")}</span>
                <p className="text-sm text-muted-foreground">{t("uploadManageContent")}</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">📚 {t("learningMaterials")}</h1>
          <p className="text-muted-foreground">{t("uploadManageEducational")}</p>
        </div>

        <MaterialUpload />

        {/* Usage Guidelines */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>📋 {t("uploadGuidelines")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">{t("supportedFileTypes")}</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• {t("documents")}</li>
                  <li>• {t("presentations")}</li>
                  <li>• {t("images")}</li>
                  <li>• {t("videos")}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">{t("bestPractices")}</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• {t("keepFileSizes")}</li>
                  <li>• {t("useDescriptiveFilenames")}</li>
                  <li>• {t("addDetailedDescriptions")}</li>
                  <li>• {t("tagWithCorrectSubject")}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
