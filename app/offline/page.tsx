"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WifiOffIcon as WifiOff, RefreshCwIcon as RefreshCw } from "@/lib/icons"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n"

export default function OfflinePage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <WifiOff className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle>{t("youreOffline")}</CardTitle>
          <CardDescription>{t("noConnection")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/student">
            <Button className="w-full">{t("continueOffline")}</Button>
          </Link>
          <Button variant="outline" className="w-full bg-transparent" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("tryAgain")}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
