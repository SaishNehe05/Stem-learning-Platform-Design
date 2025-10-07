"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, Star, Timer, Trophy, ArrowLeft, RotateCcw, Calculator } from "lucide-react"
import Link from "next/link"
import { progressTracker } from "@/lib/progress-tracker"

interface MathProblem {
  question: string
  answer: number
  userAnswer?: number
}

export default function SpeedCalcGame() {
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null)
  const [userInput, setUserInput] = useState("")
  const [score, setScore] = useState(0)
  const [problemCount, setProblemCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes
  const [gameActive, setGameActive] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)

  const generateProblem = (): MathProblem => {
    const operations = ["+", "-", "×", "÷"]
    const operation = operations[Math.floor(Math.random() * operations.length)]

    let num1: number, num2: number, answer: number, question: string

    switch (operation) {
      case "+":
        num1 = Math.floor(Math.random() * 99) + 1
        num2 = Math.floor(Math.random() * 99) + 1
        answer = num1 + num2
        question = `${num1} + ${num2}`
        break
      case "-":
        num1 = Math.floor(Math.random() * 99) + 50
        num2 = Math.floor(Math.random() * num1)
        answer = num1 - num2
        question = `${num1} - ${num2}`
        break
      case "×":
        num1 = Math.floor(Math.random() * 15) + 1
        num2 = Math.floor(Math.random() * 15) + 1
        answer = num1 * num2
        question = `${num1} × ${num2}`
        break
      case "÷":
        num2 = Math.floor(Math.random() * 12) + 2
        answer = Math.floor(Math.random() * 20) + 1
        num1 = num2 * answer
        question = `${num1} ÷ ${num2}`
        break
      default:
        num1 = 5
        num2 = 3
        answer = 8
        question = "5 + 3"
    }

    return { question, answer }
  }

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setProblemCount(0)
    setTimeLeft(180)
    setStreak(0)
    setMaxStreak(0)
    setGameComplete(false)
    setCurrentProblem(generateProblem())
    setUserInput("")
  }

  const handleSubmit = () => {
    if (!currentProblem || userInput === "") return

    const userAnswer = Number.parseInt(userInput)
    const isCorrect = userAnswer === currentProblem.answer

    if (isCorrect) {
      const basePoints = 10
      const streakBonus = Math.min(streak * 2, 20) // Max 20 bonus points
      const timeBonus = timeLeft > 120 ? 5 : 0
      const totalPoints = basePoints + streakBonus + timeBonus

      setScore((prev) => prev + totalPoints)
      setStreak((prev) => {
        const newStreak = prev + 1
        setMaxStreak((current) => Math.max(current, newStreak))
        return newStreak
      })
    } else {
      setStreak(0)
    }

    setProblemCount((prev) => prev + 1)
    setCurrentProblem(generateProblem())
    setUserInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

  const endGame = () => {
    setGameActive(false)
    setGameComplete(true)

    progressTracker.recordQuizCompletion({
      quizId: "speed-calc",
      subject: "math",
      score: Math.min((score / problemCount) * 10, 100), // Normalize to percentage
      totalQuestions: problemCount,
      correctAnswers: score > 0 ? Math.floor(score / 15) : 0, // Estimate correct answers
      timeSpent: 180 - timeLeft,
      difficulty: "hard",
      timestamp: new Date().toISOString(),
      answers: [],
    })
  }

  // Timer effect
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
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-white">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-foreground">Speed Calculator</span>
                <p className="text-sm text-muted-foreground">Lightning Fast Math</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              {gameActive && (
                <>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {score} points
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {streak} streak
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
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Calculator className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">⚡ Speed Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-muted-foreground">
                <p className="mb-4">Solve as many math problems as you can in 3 minutes!</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">⏱️ Time Limit</div>
                    <div>3 minutes</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">🎯 Goal</div>
                    <div>Maximum problems</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">🔥 Streak Bonus</div>
                    <div>+2 points per streak</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">🏆 XP Reward</div>
                    <div>Based on performance</div>
                  </div>
                </div>
              </div>
              <Button onClick={startGame} size="lg" className="w-full">
                <Zap className="w-5 h-5 mr-2" />
                Start Speed Run
              </Button>
            </CardContent>
          </Card>
        )}

        {gameActive && currentProblem && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{problemCount}</div>
                  <div className="text-sm text-muted-foreground">Problems</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-500">{streak}</div>
                  <div className="text-sm text-muted-foreground">Streak</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{score}</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </CardContent>
              </Card>
            </div>

            {/* Problem */}
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-6xl font-bold text-foreground mb-6">{currentProblem.question} = ?</div>
                <div className="max-w-xs mx-auto">
                  <input
                    type="number"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full text-3xl text-center p-4 border-2 border-border rounded-lg focus:border-primary focus:outline-none"
                    placeholder="?"
                    autoFocus
                  />
                </div>
                <Button onClick={handleSubmit} size="lg" className="mt-6 w-full max-w-xs" disabled={userInput === ""}>
                  Submit Answer
                </Button>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Time Remaining</span>
                  <span className="text-sm font-medium">{formatTime(timeLeft)}</span>
                </div>
                <Progress value={(timeLeft / 180) * 100} />
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
              <CardTitle className="text-2xl">⚡ Speed Run Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{problemCount}</div>
                  <div className="text-sm text-muted-foreground">Problems Solved</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-orange-500">{maxStreak}</div>
                  <div className="text-sm text-muted-foreground">Best Streak</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{score}</div>
                  <div className="text-sm text-muted-foreground">Final Score</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{Math.floor(score * 0.8)}</div>
                  <div className="text-sm text-muted-foreground">XP Earned</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={startGame} className="flex-1">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Link href="/games" className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    Back to Games
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
