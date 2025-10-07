"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Target, Award, Crown, Medal, Flame } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface Achievement {
  id: string
  title: string
  description: string
  category: "games" | "streak" | "learning" | "social" | "special"
  icon: string
  rarity: "common" | "rare" | "epic" | "legendary"
  xpReward: number
  unlocked: boolean
  progress: number
  maxProgress: number
  unlockedDate?: string
}

export function AchievementsSystem() {
  const { t } = useTranslation()

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "1",
      title: t("firstSteps"),
      description: t("completeFirstGame"),
      category: "games",
      icon: "🎮",
      rarity: "common",
      xpReward: 25,
      unlocked: true,
      progress: 1,
      maxProgress: 1,
      unlockedDate: "2024-01-15",
    },
    {
      id: "2",
      title: t("streakMaster"),
      description: t("maintainLearningStreak"),
      category: "streak",
      icon: "🔥",
      rarity: "rare",
      xpReward: 100,
      unlocked: true,
      progress: 7,
      maxProgress: 7,
      unlockedDate: "2024-01-20",
    },
    {
      id: "3",
      title: t("mathWizard"),
      description: t("scorePerfectMathGames"),
      category: "learning",
      icon: "🧙‍♂️",
      rarity: "epic",
      xpReward: 200,
      unlocked: false,
      progress: 6,
      maxProgress: 10,
    },
    {
      id: "4",
      title: t("scienceExplorer"),
      description: t("completeAllLabExperiments"),
      category: "learning",
      icon: "🔬",
      rarity: "rare",
      xpReward: 150,
      unlocked: false,
      progress: 8,
      maxProgress: 12,
    },
    {
      id: "5",
      title: t("codeNinja"),
      description: t("solveProgrammingChallenges"),
      category: "games",
      icon: "🥷",
      rarity: "epic",
      xpReward: 250,
      unlocked: false,
      progress: 23,
      maxProgress: 50,
    },
    {
      id: "6",
      title: t("stemLegend"),
      description: t("reachLevel50AllSubjects"),
      category: "special",
      icon: "👑",
      rarity: "legendary",
      xpReward: 500,
      unlocked: false,
      progress: 2,
      maxProgress: 4,
    },
  ])

  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      rare: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      epic: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      legendary: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    }
    return colors[rarity as keyof typeof colors] || colors.common
  }

  const getRarityBorder = (rarity: string) => {
    const borders = {
      common: "border-gray-300 dark:border-gray-600",
      rare: "border-blue-300 dark:border-blue-600",
      epic: "border-purple-300 dark:border-purple-600",
      legendary: "border-yellow-300 dark:border-yellow-600",
    }
    return borders[rarity as keyof typeof borders] || borders.common
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      games: <Trophy className="w-4 h-4" />,
      streak: <Flame className="w-4 h-4" />,
      learning: <Star className="w-4 h-4" />,
      social: <Award className="w-4 h-4" />,
      special: <Crown className="w-4 h-4" />,
    }
    return icons[category as keyof typeof icons] || icons.games
  }

  const filteredAchievements =
    selectedCategory === "all"
      ? achievements
      : achievements.filter((achievement) => achievement.category === selectedCategory)

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalXP = achievements.filter((a) => a.unlocked).reduce((sum, a) => sum + a.xpReward, 0)

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{unlockedCount}</div>
              <div className="text-sm text-muted-foreground">{t("unlocked")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{achievements.length}</div>
              <div className="text-sm text-muted-foreground">{t("total")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{totalXP}</div>
              <div className="text-sm text-muted-foreground">{t("xpEarned")}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            {t("achievementsTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            {["all", "games", "streak", "learning", "social", "special"].map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => setSelectedCategory(category)}
              >
                {category === "all" ? (
                  <Target className="w-3 h-3 mr-1" />
                ) : (
                  <span className="mr-1">{getCategoryIcon(category)}</span>
                )}
                {t(category)}
              </Badge>
            ))}
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAchievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`${getRarityBorder(achievement.rarity)} ${
                  achievement.unlocked ? "achievement-shine" : "opacity-60"
                } transition-all duration-300 hover:scale-105`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`text-3xl ${achievement.unlocked ? "" : "grayscale"}`}>{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                        {achievement.unlocked && <Medal className="w-4 h-4 text-yellow-500" />}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>

                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={getRarityColor(achievement.rarity)}>{t(achievement.rarity)}</Badge>
                        <div className="flex items-center gap-1 text-sm text-accent">
                          <Star className="w-3 h-3" />
                          {achievement.xpReward} XP
                        </div>
                      </div>

                      {!achievement.unlocked && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{t("progress")}</span>
                            <span className="font-medium">
                              {achievement.progress}/{achievement.maxProgress}
                            </span>
                          </div>
                          <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                        </div>
                      )}

                      {achievement.unlocked && achievement.unlockedDate && (
                        <div className="text-xs text-muted-foreground">
                          {t("unlockedOn", { date: new Date(achievement.unlockedDate).toLocaleDateString() })}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
