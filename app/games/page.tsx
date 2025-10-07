"use client"

import { useState } from "react"

import type React from "react"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  GamepadIcon as Gamepad2,
  TrophyIcon as Trophy,
  StarIcon as Star,
  ZapIcon as Zap,
  TimerIcon as Timer,
  TargetIcon as Target,
  BrainIcon as Brain,
  PuzzleIcon as Puzzle,
  CalculatorIcon as Calculator,
  AtomIcon as Atom,
  CpuIcon as Cpu,
  CrownIcon as Crown,
  MedalIcon as Medal,
  AwardIcon as Award,
  BotIcon as Bot,
  CameraIcon as Camera,
  FlameIcon as Flame,
} from "@/lib/icons"
import Link from "next/link"

interface Game {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  subject: string
  difficulty: "easy" | "medium" | "hard"
  estimatedTime: number
  xpReward: number
  color: string
}

interface LeaderboardEntry {
  rank: number
  studentName: string
  totalXP: number
  level: number
  streak: number
  recentAchievements: number
}

export default function GamesPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [animatedXP, setAnimatedXP] = useState(0)
  const [animatedLevel, setAnimatedLevel] = useState(0)

  const studentProgress = {
    totalXP: 1250,
    level: 5,
    streak: 7,
    achievements: ["First Game", "Math Master", "Science Explorer"],
  }

  useEffect(() => {
    const xpTimer = setInterval(() => {
      setAnimatedXP((prev) => {
        if (prev < studentProgress.totalXP) {
          return Math.min(prev + 25, studentProgress.totalXP)
        }
        clearInterval(xpTimer)
        return prev
      })
    }, 20)

    const levelTimer = setInterval(() => {
      setAnimatedLevel((prev) => {
        if (prev < studentProgress.level) {
          return prev + 1
        }
        clearInterval(levelTimer)
        return prev
      })
    }, 200)

    return () => {
      clearInterval(xpTimer)
      clearInterval(levelTimer)
    }
  }, [])

  const games: Game[] = [
    {
      id: "ai-detective",
      name: "AI Detective Challenge",
      description: "Learn to distinguish between AI and Automation through fun scenarios",
      icon: <Bot className="w-6 h-6" />,
      subject: "ai",
      difficulty: "easy",
      estimatedTime: 10,
      xpReward: 80,
      color: "bg-blue-500",
    },
    {
      id: "vision-quest",
      name: "Vision Quest",
      description: "Help AI identify objects and learn how Computer Vision recognizes patterns",
      icon: <Camera className="w-6 h-6" />,
      subject: "ai",
      difficulty: "medium",
      estimatedTime: 12,
      xpReward: 90,
      color: "bg-purple-500",
    },
    {
      id: "math-puzzle",
      name: "Number Ninja Enhanced",
      description: "Master multiple types of math questions with AI-powered adaptive difficulty",
      icon: <Brain className="w-6 h-6" />,
      subject: "math",
      difficulty: "hard",
      estimatedTime: 15,
      xpReward: 120,
      color: "bg-indigo-600",
    },
    {
      id: "patterns-explorer",
      name: "Pattern Explorer",
      description: "Discover number patterns, sequences and visualize mathematical relationships",
      icon: <Puzzle className="w-6 h-6" />,
      subject: "math",
      difficulty: "easy",
      estimatedTime: 8,
      xpReward: 60,
      color: "bg-blue-500",
    },
    {
      id: "angle-master",
      name: "Angle Master",
      description: "Learn about lines, angles and geometric shapes through interactive challenges",
      icon: <Target className="w-6 h-6" />,
      subject: "math",
      difficulty: "medium",
      estimatedTime: 10,
      xpReward: 75,
      color: "bg-indigo-500",
    },
    {
      id: "number-playground",
      name: "Number Playground",
      description: "Play with palindromes, Kaprekar numbers and mental math tricks",
      icon: <Calculator className="w-6 h-6" />,
      subject: "math",
      difficulty: "easy",
      estimatedTime: 6,
      xpReward: 50,
      color: "bg-purple-500",
    },
    {
      id: "data-detective",
      name: "Data Detective",
      description: "Collect data, create pictographs and bar graphs like a real scientist",
      icon: <Brain className="w-6 h-6" />,
      subject: "math",
      difficulty: "medium",
      estimatedTime: 12,
      xpReward: 80,
      color: "bg-green-500",
    },
    {
      id: "prime-hunter",
      name: "Prime Number Hunter",
      description: "Hunt for prime numbers, find factors and explore divisibility rules",
      icon: <Zap className="w-6 h-6" />,
      subject: "math",
      difficulty: "medium",
      estimatedTime: 9,
      xpReward: 70,
      color: "bg-yellow-500",
    },
    {
      id: "area-architect",
      name: "Area Architect",
      description: "Design buildings while learning perimeter and area calculations",
      icon: <Cpu className="w-6 h-6" />,
      subject: "math",
      difficulty: "medium",
      estimatedTime: 10,
      xpReward: 75,
      color: "bg-teal-500",
    },
    {
      id: "pizza-fractions",
      name: "Fraction Pizza Party",
      description: "Master fractions by slicing pizzas and serving equal shares",
      icon: <Calculator className="w-6 h-6" />,
      subject: "math",
      difficulty: "easy",
      estimatedTime: 8,
      xpReward: 55,
      color: "bg-red-500",
    },
    {
      id: "geometry-constructor",
      name: "Geometry Constructor",
      description: "Construct squares, rectangles and circles using compass and ruler",
      icon: <Puzzle className="w-6 h-6" />,
      subject: "math",
      difficulty: "hard",
      estimatedTime: 15,
      xpReward: 90,
      color: "bg-orange-500",
    },
    {
      id: "symmetry-maze",
      name: "Symmetry Mirror Maze",
      description: "Navigate through mirrors and create perfect symmetrical patterns",
      icon: <Target className="w-6 h-6" />,
      subject: "math",
      difficulty: "medium",
      estimatedTime: 7,
      xpReward: 65,
      color: "bg-cyan-500",
    },
    {
      id: "integer-adventure",
      name: "Integer Adventure",
      description: "Explore positive and negative numbers in Bela's building of fun",
      icon: <Calculator className="w-6 h-6" />,
      subject: "math",
      difficulty: "medium",
      estimatedTime: 8,
      xpReward: 70,
      color: "bg-pink-500",
    },
    {
      id: "food-lab",
      name: "Food Components Lab",
      description: "Test food items for carbohydrates, proteins and fats like a scientist",
      icon: <Atom className="w-6 h-6" />,
      subject: "science",
      difficulty: "easy",
      estimatedTime: 10,
      xpReward: 65,
      color: "bg-emerald-500",
    },
    {
      id: "circuit-builder",
      name: "Electric Circuit Builder",
      description: "Build open and closed circuits, test conductors and insulators",
      icon: <Zap className="w-6 h-6" />,
      subject: "science",
      difficulty: "medium",
      estimatedTime: 12,
      xpReward: 85,
      color: "bg-amber-500",
    },
    {
      id: "magnet-explorer",
      name: "Magnet Explorer",
      description: "Discover magnetic properties, poles and use magnetic compass",
      icon: <Target className="w-6 h-6" />,
      subject: "science",
      difficulty: "easy",
      estimatedTime: 8,
      xpReward: 60,
      color: "bg-violet-500",
    },
    {
      id: "light-shadow-lab",
      name: "Light & Shadow Lab",
      description: "Explore how light travels, create shadows and build pinhole cameras",
      icon: <Brain className="w-6 h-6" />,
      subject: "science",
      difficulty: "medium",
      estimatedTime: 11,
      xpReward: 75,
      color: "bg-slate-500",
    },
    {
      id: "plant-detective",
      name: "Plant Detective",
      description: "Classify plants, study leaf venation and explore plant parts",
      icon: <Atom className="w-6 h-6" />,
      subject: "science",
      difficulty: "easy",
      estimatedTime: 9,
      xpReward: 55,
      color: "bg-lime-500",
    },
    {
      id: "habitat-explorer",
      name: "Habitat Explorer",
      description: "Discover living organisms and their habitats around the world",
      icon: <Puzzle className="w-6 h-6" />,
      subject: "science",
      difficulty: "medium",
      estimatedTime: 13,
      xpReward: 80,
      color: "bg-rose-500",
    },
    {
      id: "air-investigator",
      name: "Air Investigator",
      description: "Investigate air properties, oxygen in burning and air pollution",
      icon: <Cpu className="w-6 h-6" />,
      subject: "science",
      difficulty: "medium",
      estimatedTime: 10,
      xpReward: 70,
      color: "bg-sky-500",
    },
  ]

  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, studentName: "Carol Davis", totalXP: 3120, level: 8, streak: 18, recentAchievements: 5 },
    { rank: 2, studentName: "Emma Brown", totalXP: 2780, level: 7, streak: 9, recentAchievements: 3 },
    { rank: 3, studentName: "Alice Johnson", totalXP: 2450, level: 6, streak: 12, recentAchievements: 4 },
    { rank: 4, studentName: "Bob Smith", totalXP: 1890, level: 4, streak: 5, recentAchievements: 2 },
    { rank: 5, studentName: "David Wilson", totalXP: 1245, level: 3, streak: 2, recentAchievements: 1 },
  ]

  const filteredGames =
    selectedDifficulty === "all" ? games : games.filter((game) => game.difficulty === selectedDifficulty)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/student" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-12">
                <Gamepad2 className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <span className="font-semibold text-foreground">Game Center</span>
                <p className="text-sm text-muted-foreground">Play & Learn</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="flex items-center gap-1 transition-all hover:scale-105">
                <Zap className="w-3 h-3 animate-pulse" />
                {animatedXP} XP
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 transition-all hover:scale-105">
                <Trophy className="w-3 h-3" />
                Level {animatedLevel}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Games Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-foreground animate-in slide-in-from-left duration-500">
                🎮 Fun Learning Games
              </h1>
              <div className="flex gap-2">
                {["all", "easy", "medium", "hard"].map((difficulty, index) => (
                  <Button
                    key={difficulty}
                    variant={selectedDifficulty === difficulty ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`transition-all duration-300 hover:scale-105 animate-in slide-in-from-top delay-${index * 100}`}
                  >
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-8 animate-in slide-in-from-bottom duration-700">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="w-6 h-6 text-blue-500 animate-pulse" />
                <h2 className="text-xl font-semibold text-foreground">🤖 AI Learning Games</h2>
                <Badge className="bg-blue-100 text-blue-800 animate-bounce">New!</Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {games
                  .filter((game) => game.subject === "ai")
                  .map((game, index) => (
                    <Link key={game.id} href={`/games/${game.id}`}>
                      <Card
                        className={`hover:shadow-xl transition-all duration-500 cursor-pointer group border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:scale-105 hover:-translate-y-2 animate-in slide-in-from-left delay-${index * 200}`}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div
                              className={`w-12 h-12 ${game.color} rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-110 group-hover:rotate-12`}
                            >
                              {game.icon}
                            </div>
                            <Badge className={getDifficultyColor(game.difficulty)}>{game.difficulty}</Badge>
                          </div>
                          <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                            {game.name}
                          </CardTitle>
                          <CardDescription className="group-hover:text-blue-500 transition-colors">
                            {game.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <Timer className="w-4 h-4 text-muted-foreground group-hover:animate-spin" />
                                <span>{game.estimatedTime} min</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-500 group-hover:animate-pulse" />
                                <span className="font-medium">{game.xpReward} XP</span>
                              </div>
                            </div>
                            <Button className="w-full group-hover:bg-primary/90 transition-all duration-300 hover:shadow-lg transform hover:scale-105">
                              <Gamepad2 className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                              Play Now
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {filteredGames
                .filter((game) => game.subject !== "ai")
                .map((game, index) => (
                  <Link key={game.id} href={`/games/${game.id}`}>
                    <Card
                      className={`hover:shadow-xl transition-all duration-500 cursor-pointer group hover:scale-105 hover:-translate-y-2 animate-in slide-in-from-bottom delay-${(index % 4) * 150}`}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div
                            className={`w-12 h-12 ${game.color} rounded-lg flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-lg`}
                          >
                            {game.icon}
                          </div>
                          <Badge className={getDifficultyColor(game.difficulty)}>{game.difficulty}</Badge>
                        </div>
                        <CardTitle className="text-xl transition-colors group-hover:text-primary">
                          {game.name}
                        </CardTitle>
                        <CardDescription className="transition-colors group-hover:text-primary/70">
                          {game.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Timer className="w-4 h-4 text-muted-foreground transition-transform group-hover:animate-spin" />
                              <span>{game.estimatedTime} min</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-500 transition-transform group-hover:animate-pulse group-hover:scale-125" />
                              <span className="font-medium">{game.xpReward} XP</span>
                            </div>
                          </div>
                          <Button className="w-full group-hover:bg-primary/90 transition-all duration-300 hover:shadow-lg transform hover:scale-105 active:scale-95">
                            <Gamepad2 className="w-4 h-4 mr-2 transition-transform group-hover:animate-bounce" />
                            Play Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <Card className="animate-in slide-in-from-right duration-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500 animate-pulse" />🏆 Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.slice(0, 5).map((entry, index) => (
                    <div
                      key={entry.rank}
                      className={`flex items-center justify-between transition-all duration-300 hover:bg-muted/50 rounded-lg p-2 -m-2 animate-in slide-in-from-right delay-${index * 100}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="transition-transform hover:scale-125">{getRankIcon(entry.rank)}</div>
                        <div>
                          <p className="font-medium text-sm">{entry.studentName}</p>
                          <p className="text-xs text-muted-foreground">Level {entry.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{entry.totalXP} XP</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-500" />
                          {entry.streak} day streak
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Challenge */}
            <Card className="animate-in slide-in-from-right duration-700 delay-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-500 animate-pulse" />🎯 Weekly Challenge
                </CardTitle>
                <CardDescription>Complete 10 games this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Progress value={60} className="h-3 transition-all duration-1000 ease-out" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">6/10 games completed</span>
                    <span className="font-medium text-green-600 animate-pulse">+200 XP reward</span>
                  </div>
                  <p className="text-xs text-muted-foreground">4 days remaining</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="animate-in slide-in-from-right duration-700 delay-400">
              <CardHeader>
                <CardTitle className="text-lg">📊 Your Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="transition-transform hover:scale-110 cursor-pointer">
                    <div className="text-2xl font-bold text-primary animate-pulse">
                      {studentProgress.achievements.length}
                    </div>
                    <p className="text-xs text-muted-foreground">Achievements</p>
                  </div>
                  <div className="transition-transform hover:scale-110 cursor-pointer">
                    <div className="text-2xl font-bold text-orange-500 flex items-center justify-center gap-1">
                      <Flame className="w-5 h-5 animate-bounce" />
                      {studentProgress.streak}
                    </div>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
