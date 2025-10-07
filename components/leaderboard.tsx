"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Crown, Medal, Award, TrendingUp, Calendar, Zap, Star, Clock } from "lucide-react"
import { progressTracker, type LeaderboardEntry } from "@/lib/progress-tracker"
import { useTranslation } from "@/lib/i18n"

interface LeaderboardProps {
  showTabs?: boolean
  limit?: number
  className?: string
}

export function Leaderboard({ showTabs = true, limit = 10, className = "" }: LeaderboardProps) {
  const { t } = useTranslation()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<LeaderboardEntry[]>([])
  const [currentStudentProgress, setCurrentStudentProgress] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overall")

  useEffect(() => {
    const progress = progressTracker.getStudentProgress()
    setCurrentStudentProgress(progress)

    // Load leaderboards
    setLeaderboard(progressTracker.getLeaderboard(limit))
    setWeeklyLeaderboard(progressTracker.getWeeklyLeaderboard(limit))
  }, [limit])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return <Trophy className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return t("activeNow")
    if (diffInHours < 24) return t("hoursAgo", { hours: diffInHours })
    const diffInDays = Math.floor(diffInHours / 24)
    return t("daysAgo", { days: diffInDays })
  }

  const renderLeaderboardEntry = (entry: LeaderboardEntry, isWeekly = false) => {
    const isCurrentStudent = currentStudentProgress && entry.studentId === currentStudentProgress.studentId
    const xpToShow = isWeekly ? entry.weeklyXP : entry.totalXP

    return (
      <div
        key={`${entry.studentId}-${isWeekly ? "weekly" : "overall"}`}
        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
          isCurrentStudent ? "bg-primary/10 border-2 border-primary/20" : "hover:bg-muted/50"
        }`}
      >
        <div className="flex items-center justify-center w-8 h-8">
          {getRankIcon(entry.rank)}
          <span className="ml-1 text-sm font-medium">{entry.rank}</span>
        </div>

        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
            {entry.studentName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm truncate">{isCurrentStudent ? t("you") : entry.studentName}</p>
            {entry.streak > 5 && (
              <Badge variant="outline" className="text-xs bg-orange-50 text-orange-600 border-orange-200">
                🔥 {entry.streak}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {xpToShow.toLocaleString()} XP
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {getTimeAgo(entry.lastActive)}
            </span>
          </div>
        </div>

        <div className="text-right">
          <Badge variant="outline" className="text-xs mb-1">
            L{entry.level}
          </Badge>
          {entry.recentAchievements > 0 && (
            <div className="flex items-center gap-1 text-xs text-yellow-600">
              <Star className="w-3 h-3" />
              {entry.recentAchievements}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (!showTabs) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            {t("leaderboard")}
          </CardTitle>
          <CardDescription>{t("topPerformers")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">{leaderboard.map((entry) => renderLeaderboardEntry(entry))}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          {t("leaderboard")}
        </CardTitle>
        <CardDescription>{t("competeWithClassmates")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overall" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              {t("overall")}
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {t("thisWeek")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overall" className="mt-4">
            <div className="space-y-2">{leaderboard.map((entry) => renderLeaderboardEntry(entry, false))}</div>
          </TabsContent>

          <TabsContent value="weekly" className="mt-4">
            <div className="space-y-2">{weeklyLeaderboard.map((entry) => renderLeaderboardEntry(entry, true))}</div>
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{t("weeklyRankingsReset")}</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
