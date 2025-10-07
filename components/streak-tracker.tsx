"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActivity: string
  streakType: "daily" | "weekly" | "monthly"
}

export function StreakTracker() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 7,
    longestStreak: 15,
    lastActivity: new Date().toISOString().split("T")[0],
    streakType: "daily",
  })

  const [showStreakAnimation, setShowStreakAnimation] = useState(false)

  const updateStreak = () => {
    const today = new Date().toISOString().split("T")[0]
    if (streakData.lastActivity !== today) {
      const newStreak = streakData.currentStreak + 1
      setStreakData((prev) => ({
        ...prev,
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastActivity: today,
      }))
      setShowStreakAnimation(true)
      setTimeout(() => setShowStreakAnimation(false), 2000)
    }
  }

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return "🔥"
    if (streak >= 14) return "⚡"
    if (streak >= 7) return "✨"
    if (streak >= 3) return "🌟"
    return "💫"
  }

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "text-red-500"
    if (streak >= 14) return "text-orange-500"
    if (streak >= 7) return "text-yellow-500"
    if (streak >= 3) return "text-blue-500"
    return "text-purple-500"
  }

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">Daily Streak</h3>
          <Button onClick={updateStreak} size="sm" className="bg-primary hover:bg-primary/90">
            Check In
          </Button>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className={`text-4xl ${showStreakAnimation ? "streak-flame" : ""}`}>
            {getStreakEmoji(streakData.currentStreak)}
          </div>
          <div>
            <div className={`text-3xl font-bold ${getStreakColor(streakData.currentStreak)}`}>
              {streakData.currentStreak}
            </div>
            <div className="text-sm text-muted-foreground">days in a row</div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="text-lg font-semibold text-accent">{streakData.longestStreak}</div>
            <div className="text-xs text-muted-foreground">Best Streak</div>
          </div>

          <Badge
            variant="secondary"
            className={`${showStreakAnimation ? "pulse-glow" : ""} bg-secondary text-secondary-foreground`}
          >
            {streakData.streakType.charAt(0).toUpperCase() + streakData.streakType.slice(1)} Learner
          </Badge>
        </div>

        {/* Streak milestones */}
        <div className="mt-4 space-y-2">
          <div className="text-sm font-medium text-foreground mb-2">Next Milestone:</div>
          <div className="flex gap-2">
            {[7, 14, 30, 60, 100].map((milestone) => (
              <div
                key={milestone}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  ${
                    streakData.currentStreak >= milestone
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
              >
                {milestone}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
