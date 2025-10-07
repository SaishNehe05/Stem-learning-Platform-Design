"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, Star, Zap } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface Challenge {
  id: string
  title: string
  description: string
  subject: "math" | "science" | "technology" | "engineering"
  difficulty: "easy" | "medium" | "hard"
  xpReward: number
  timeLimit: number // in minutes
  completed: boolean
  progress: number
}

export function DailyChallenges() {
  const { t } = useTranslation()

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: "1",
      title: t("fractionMaster"),
      description: t("solveFractionProblems"),
      subject: "math",
      difficulty: "easy",
      xpReward: 50,
      timeLimit: 15,
      completed: false,
      progress: 60,
    },
    {
      id: "2",
      title: t("circuitDetective"),
      description: t("buildWorkingCircuits"),
      subject: "science",
      difficulty: "medium",
      xpReward: 100,
      timeLimit: 25,
      completed: false,
      progress: 33,
    },
    {
      id: "3",
      title: t("codeNinja"),
      description: t("completePythonChallenges"),
      subject: "technology",
      difficulty: "hard",
      xpReward: 150,
      timeLimit: 30,
      completed: true,
      progress: 100,
    },
  ])

  const [timeRemaining, setTimeRemaining] = useState(86400) // 24 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return t("hoursMinutes", { hours, minutes })
  }

  const getSubjectColor = (subject: string) => {
    const colors = {
      math: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      science: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      technology: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      engineering: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
    }
    return colors[subject as keyof typeof colors] || colors.math
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: "bg-green-500",
      medium: "bg-yellow-500",
      hard: "bg-red-500",
    }
    return colors[difficulty as keyof typeof colors] || colors.easy
  }

  const completeChallenge = (challengeId: string) => {
    setChallenges((prev) =>
      prev.map((challenge) =>
        challenge.id === challengeId ? { ...challenge, completed: true, progress: 100 } : challenge,
      ),
    )
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Zap className="w-5 h-5 text-yellow-500" />
            {t("dailyChallenges")}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {t("timeLeft", { time: formatTime(timeRemaining) })}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">{challenge.title}</h4>
                    {challenge.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{challenge.description}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={getSubjectColor(challenge.subject)}>{t(challenge.subject)}</Badge>
                    <div className={`w-2 h-2 rounded-full ${getDifficultyColor(challenge.difficulty)}`} />
                    <span className="text-xs text-muted-foreground capitalize">{t(challenge.difficulty)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-semibold text-accent">
                    <Star className="w-4 h-4" />
                    {challenge.xpReward} XP
                  </div>
                  <div className="text-xs text-muted-foreground">{t("minLimit", { min: challenge.timeLimit })}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("progress")}</span>
                  <span className="font-medium text-foreground">{challenge.progress}%</span>
                </div>
                <Progress value={challenge.progress} className="h-2" />
              </div>

              {!challenge.completed && (
                <Button
                  onClick={() => completeChallenge(challenge.id)}
                  className="w-full mt-3 bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  {t("startChallenge")}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}
