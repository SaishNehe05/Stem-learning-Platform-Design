"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Star, Timer, Trophy, ArrowLeft, RotateCcw, Lightbulb, CheckCircle } from "lucide-react"
import Link from "next/link"
import { progressTracker } from "@/lib/progress-tracker"
import { useTranslation } from "@/lib/i18n"

interface BrainTeaser {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  difficulty: "easy" | "medium" | "hard"
}

export default function BrainTeaserGame() {
  const { t } = useTranslation()

  const [currentPuzzle, setCurrentPuzzle] = useState<BrainTeaser | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [score, setScore] = useState(0)
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes

  const puzzles: BrainTeaser[] = [
    {
      id: "bridge",
      question:
        "You need to build a bridge that can hold 100kg using only paper and tape. What engineering principle should you focus on?",
      options: [
        "Making it as thick as possible",
        "Creating triangular supports",
        "Using the longest pieces",
        "Making it perfectly flat",
      ],
      correctAnswer: "Creating triangular supports",
      explanation: "Triangles are the strongest geometric shape and distribute weight evenly.",
      difficulty: "medium",
    },
    {
      id: "water",
      question: "A town needs clean water but the only source is a muddy river. What's the most practical first step?",
      options: [
        "Boil all the water",
        "Build a filtration system",
        "Find a new water source",
        "Add chemicals to kill bacteria",
      ],
      correctAnswer: "Build a filtration system",
      explanation:
        "Filtration removes physical impurities first, then other treatments can address biological contaminants.",
      difficulty: "medium",
    },
    {
      id: "energy",
      question:
        "A remote village needs electricity. They have wind, sun, and a small stream. What's the most reliable combination?",
      options: ["Only solar panels", "Only wind turbines", "Solar + wind + micro-hydro", "Only the stream generator"],
      correctAnswer: "Solar + wind + micro-hydro",
      explanation: "Combining multiple renewable sources ensures power even when one source isn't available.",
      difficulty: "hard",
    },
    {
      id: "transport",
      question: "Design a vehicle for rough terrain with limited fuel. What's most important?",
      options: ["Maximum speed", "Fuel efficiency and durability", "Comfortable seating", "Advanced electronics"],
      correctAnswer: "Fuel efficiency and durability",
      explanation: "In remote areas, reliability and efficiency are more important than comfort or speed.",
      difficulty: "easy",
    },
    {
      id: "communication",
      question: "A disaster cuts all phone lines. What's the most practical emergency communication system?",
      options: ["Smoke signals", "Radio network", "Carrier pigeons", "Internet only"],
      correctAnswer: "Radio network",
      explanation: "Radio waves can travel long distances and don't rely on infrastructure that might be damaged.",
      difficulty: "medium",
    },
  ]

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setPuzzleIndex(0)
    setTimeLeft(300)
    setGameComplete(false)
    setCurrentPuzzle(puzzles[0])
    setSelectedAnswer("")
    setShowFeedback(false)
  }

  const handleAnswer = (answer: string) => {
    if (!currentPuzzle || showFeedback) return

    setSelectedAnswer(answer)
    setShowFeedback(true)

    if (answer === currentPuzzle.correctAnswer) {
      const points = currentPuzzle.difficulty === "hard" ? 25 : currentPuzzle.difficulty === "medium" ? 20 : 15
      setScore((prev) => prev + points)
    }

    setTimeout(() => {
      if (puzzleIndex >= puzzles.length - 1) {
        endGame()
      } else {
        setPuzzleIndex((prev) => prev + 1)
        setCurrentPuzzle(puzzles[puzzleIndex + 1])
        setSelectedAnswer("")
        setShowFeedback(false)
      }
    }, 3000)
  }

  const endGame = () => {
    setGameActive(false)
    setGameComplete(true)

    progressTracker.recordQuizCompletion({
      quizId: "brain-teaser",
      subject: "engineering",
      score: (score / 110) * 100, // Max possible score is 110
      totalQuestions: 5,
      correctAnswers: score > 0 ? Math.ceil(score / 20) : 0,
      timeSpent: 300 - timeLeft,
      difficulty: "medium",
      timestamp: new Date().toISOString(),
      answers: [],
    })
  }

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameActive) {
      endGame()
    }
  }, [gameActive, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/games" className="flex items-center gap-3">
              <ArrowLeft className="w-5 h-5" />
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-foreground">{t("brainBuster")}</span>
                <p className="text-sm text-muted-foreground">{t("engineeringLogicPuzzles")}</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              {gameActive && (
                <>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {score} {t("points")}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    {formatTime(timeLeft)}
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {!gameActive && !gameComplete && (
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Lightbulb className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">🧠 {t("brainBuster")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-muted-foreground">
                <p className="mb-4">{t("engineeringLogicPuzzles")}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">⏱️ {t("timeLimit")}</div>
                    <div>5 {t("minutes")}</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">🧩 {t("puzzles")}</div>
                    <div>5 {t("brainTeasers")}</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">⭐ {t("points")}</div>
                    <div>{t("perCorrectRange")}</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">🏆 {t("xpReward")}</div>
                    <div>{t("upTo110XP")}</div>
                  </div>
                </div>
              </div>
              <Button onClick={startGame} size="lg" className="w-full">
                <Lightbulb className="w-5 h-5 mr-2" />
                {t("startThinking")}
              </Button>
            </CardContent>
          </Card>
        )}

        {gameActive && currentPuzzle && (
          <div className="space-y-6">
            {/* Progress */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {t("puzzles")} {puzzleIndex + 1}/5
                  </span>
                  <span className="text-sm font-medium">
                    {score} {t("points")}
                  </span>
                </div>
                <Progress value={((puzzleIndex + 1) / 5) * 100} />
              </CardContent>
            </Card>

            {/* Puzzle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-orange-500" />
                  {t("engineeringChallenge")}
                  <Badge variant="outline" className="ml-auto">
                    {t(currentPuzzle.difficulty)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-foreground font-medium">{currentPuzzle.question}</p>
                </div>

                {showFeedback && (
                  <div
                    className={`p-4 rounded-lg border ${
                      selectedAnswer === currentPuzzle.correctAnswer
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle
                        className={`w-4 h-4 ${
                          selectedAnswer === currentPuzzle.correctAnswer ? "text-green-600" : "text-red-600"
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          selectedAnswer === currentPuzzle.correctAnswer ? "text-green-800" : "text-red-800"
                        }`}
                      >
                        {selectedAnswer === currentPuzzle.correctAnswer ? t("greatThinking") : t("notQuiteRight")}
                      </span>
                    </div>
                    <p className={selectedAnswer === currentPuzzle.correctAnswer ? "text-green-700" : "text-red-700"}>
                      {currentPuzzle.explanation}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  {currentPuzzle.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={
                        showFeedback
                          ? option === currentPuzzle.correctAnswer
                            ? "default"
                            : selectedAnswer === option
                              ? "destructive"
                              : "outline"
                          : "outline"
                      }
                      onClick={() => handleAnswer(option)}
                      disabled={showFeedback}
                      className="w-full text-left justify-start h-auto p-4"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {gameComplete && (
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Trophy className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">🎉 {t("brainPowerComplete")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{score}</div>
                  <div className="text-sm text-muted-foreground">{t("finalScore")}</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{score}</div>
                  <div className="text-sm text-muted-foreground">{t("xpEarned")}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={startGame} className="flex-1">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t("tryAgain")}
                </Button>
                <Link href="/games" className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    {t("backToGames")}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
