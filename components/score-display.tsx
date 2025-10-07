"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Zap, Trophy, TrendingUp, Star, Flame } from "lucide-react"
import { progressTracker, type StudentProgress } from "@/lib/progress-tracker"
import { useTranslation } from "@/lib/i18n"

interface ScoreDisplayProps {
  variant?: "compact" | "detailed"
  showProgress?: boolean
  className?: string
}

export function ScoreDisplay({ variant = "compact", showProgress = true, className = "" }: ScoreDisplayProps) {
  const { t } = useTranslation()
  const [progress, setProgress] = useState<StudentProgress | null>(null)
  const [xpToNextLevel, setXpToNextLevel] = useState(0)
  const [progressToNextLevel, setProgressToNextLevel] = useState(0)

  useEffect(() => {
    const studentProgress = progressTracker.getStudentProgress()
    setProgress(studentProgress)

    // Calculate progress to next level
    const currentLevelXP = (studentProgress.level - 1) * 500
    const nextLevelXP = studentProgress.level * 500
    const xpNeeded = nextLevelXP - studentProgress.totalXP
    const progressPercent = ((studentProgress.totalXP - currentLevelXP) / 500) * 100

    setXpToNextLevel(xpNeeded)
    setProgressToNextLevel(Math.max(0, Math.min(100, progressPercent)))
  }, [])

  if (!progress) {
    return <div className={`animate-pulse bg-muted rounded-lg h-16 ${className}`} />
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
          <Zap className="w-4 h-4" />
          {progress.totalXP.toLocaleString()} XP
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
          <Trophy className="w-4 h-4" />
          {t("level")} {progress.level}
        </Badge>
        {progress.streak > 0 && (
          <Badge
            variant="outline"
            className="flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-600 border-orange-200"
          >
            <Flame className="w-4 h-4" />
            {progress.streak} {t("dayStreak")}
          </Badge>
        )}
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Main Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                <Zap className="w-5 h-5" />
                {progress.totalXP.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">{t("totalXpLabel")}</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary flex items-center justify-center gap-1">
                <Trophy className="w-5 h-5" />
                {progress.level}
              </div>
              <p className="text-sm text-muted-foreground">{t("levelLabel")}</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-500 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5" />
                {progress.streak}
              </div>
              <p className="text-sm text-muted-foreground">{t("dayStreakLabel")}</p>
            </div>
          </div>

          {/* Level Progress */}
          {showProgress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("progressToLevel", { level: progress.level + 1 })}</span>
                <span className="font-medium">{t("xpNeeded", { xp: xpToNextLevel })}</span>
              </div>
              <Progress value={progressToNextLevel} className="h-2" />
            </div>
          )}

          {/* Achievements */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">
                {t("achievementsCount", { count: progress.achievements.length })}
              </span>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {t("rising")}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
