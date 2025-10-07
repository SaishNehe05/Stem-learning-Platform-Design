"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Star, Zap, Target } from "lucide-react"
import Link from "next/link"

interface Pattern {
  sequence: number[]
  missing: number
  type: string
  rule: string
}

export default function PatternsExplorerGame() {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameActive, setGameActive] = useState(false)
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [feedback, setFeedback] = useState("")
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)

  const patternTypes = [
    { type: "arithmetic", name: "Arithmetic Sequence", rule: "Add same number" },
    { type: "geometric", name: "Geometric Sequence", rule: "Multiply by same number" },
    { type: "square", name: "Square Numbers", rule: "Perfect squares" },
    { type: "triangular", name: "Triangular Numbers", rule: "Triangle patterns" },
    { type: "fibonacci", name: "Fibonacci", rule: "Add previous two" },
  ]

  const generatePattern = (): Pattern => {
    const types = ["arithmetic", "geometric", "square", "triangular", "fibonacci"]
    const type = types[Math.floor(Math.random() * types.length)]

    switch (type) {
      case "arithmetic":
        const diff = Math.floor(Math.random() * 5) + 2
        const start = Math.floor(Math.random() * 10) + 1
        const sequence = [start, start + diff, start + 2 * diff, start + 3 * diff]
        return {
          sequence,
          missing: start + 4 * diff,
          type: "Arithmetic (+" + diff + ")",
          rule: `Add ${diff} each time`,
        }

      case "geometric":
        const mult = Math.floor(Math.random() * 3) + 2
        const base = Math.floor(Math.random() * 3) + 1
        const geoSeq = [base, base * mult, base * mult * mult, base * mult * mult * mult]
        return {
          sequence: geoSeq,
          missing: base * mult * mult * mult * mult,
          type: "Geometric (×" + mult + ")",
          rule: `Multiply by ${mult} each time`,
        }

      case "square":
        const sqStart = Math.floor(Math.random() * 3) + 1
        const squares = [
          sqStart * sqStart,
          (sqStart + 1) * (sqStart + 1),
          (sqStart + 2) * (sqStart + 2),
          (sqStart + 3) * (sqStart + 3),
        ]
        return {
          sequence: squares,
          missing: (sqStart + 4) * (sqStart + 4),
          type: "Square Numbers",
          rule: "Perfect squares pattern",
        }

      case "triangular":
        const triStart = 1
        const triangular = [1, 3, 6, 10]
        return {
          sequence: triangular,
          missing: 15,
          type: "Triangular Numbers",
          rule: "Triangle number pattern",
        }

      default: // fibonacci
        const fibSeq = [1, 1, 2, 3]
        return {
          sequence: fibSeq,
          missing: 5,
          type: "Fibonacci",
          rule: "Add previous two numbers",
        }
    }
  }

  const startGame = () => {
    setGameActive(true)
    setTimeLeft(60)
    setScore(0)
    setStreak(0)
    setTotalQuestions(0)
    setCorrectAnswers(0)
    setCurrentPattern(generatePattern())
    setFeedback("")
  }

  const checkAnswer = () => {
    if (!currentPattern || !userAnswer) return

    const answer = Number.parseInt(userAnswer)
    setTotalQuestions((prev) => prev + 1)

    if (answer === currentPattern.missing) {
      const points = 10 + streak * 2
      setScore((prev) => prev + points)
      setStreak((prev) => prev + 1)
      setCorrectAnswers((prev) => prev + 1)
      setFeedback(`Correct! +${points} points`)

      setTimeout(() => {
        setCurrentPattern(generatePattern())
        setUserAnswer("")
        setFeedback("")
      }, 1500)
    } else {
      setStreak(0)
      setFeedback(`Wrong! The answer was ${currentPattern.missing}`)

      setTimeout(() => {
        setCurrentPattern(generatePattern())
        setUserAnswer("")
        setFeedback("")
      }, 2000)
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000)
    } else if (timeLeft === 0) {
      setGameActive(false)
    }
    return () => clearTimeout(timer)
  }, [gameActive, timeLeft])

  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/games" className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Games
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                {score} points
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {streak} streak
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">🔍 Pattern Explorer</h1>
          <p className="text-muted-foreground">Discover number patterns and sequences!</p>
        </div>

        {!gameActive ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Ready to Explore Patterns?</CardTitle>
              <CardDescription>Find the missing numbers in various mathematical sequences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {patternTypes.map((type, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium text-sm">{type.name}</h4>
                    <p className="text-xs text-muted-foreground">{type.rule}</p>
                  </div>
                ))}
              </div>

              {score > 0 && (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Last Game Results</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-2xl font-bold text-primary">{score}</div>
                      <p className="text-muted-foreground">Score</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
                      <p className="text-muted-foreground">Accuracy</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-500">{correctAnswers}</div>
                      <p className="text-muted-foreground">Correct</p>
                    </div>
                  </div>
                </div>
              )}

              <Button onClick={startGame} className="w-full" size="lg">
                <Target className="w-4 h-4 mr-2" />
                Start Pattern Hunt
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Badge variant="outline">Time: {timeLeft}s</Badge>
                <Badge variant="secondary">Score: {score}</Badge>
                <Badge variant="default">Streak: {streak}</Badge>
              </div>
              <Progress value={(timeLeft / 60) * 100} className="w-32" />
            </div>

            {currentPattern && (
              <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Find the Missing Number</CardTitle>
                  <Badge variant="outline">{currentPattern.type}</Badge>
                  <CardDescription>{currentPattern.rule}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-center gap-4 text-3xl font-bold">
                    {currentPattern.sequence.map((num, index) => (
                      <span
                        key={index}
                        className="w-16 h-16 bg-primary text-primary-foreground rounded-lg flex items-center justify-center"
                      >
                        {num}
                      </span>
                    ))}
                    <span className="text-2xl text-muted-foreground">→</span>
                    <div className="w-16 h-16 bg-muted border-2 border-dashed border-primary rounded-lg flex items-center justify-center text-primary">
                      ?
                    </div>
                  </div>

                  <div className="flex gap-2 max-w-xs mx-auto">
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Your answer"
                      className="flex-1 px-3 py-2 border border-border rounded-md text-center text-lg font-semibold"
                      onKeyPress={(e) => e.key === "Enter" && checkAnswer()}
                    />
                    <Button onClick={checkAnswer} disabled={!userAnswer}>
                      Check
                    </Button>
                  </div>

                  {feedback && (
                    <div
                      className={`text-center p-3 rounded-lg ${
                        feedback.includes("Correct") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {feedback}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
