"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Star, Zap, SearchIcon } from "lucide-react"
import Link from "next/link"

interface DataChallenge {
  type: string
  data: number[]
  labels: string[]
  question: string
  answer: number | string
  chartType: "bar" | "pictograph"
}

export default function DataDetectiveGame() {
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(100)
  const [gameActive, setGameActive] = useState(false)
  const [currentChallenge, setCurrentChallenge] = useState<DataChallenge | null>(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [feedback, setFeedback] = useState("")
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)

  const generateChallenge = (): DataChallenge => {
    const challengeTypes = ["highest", "lowest", "total", "difference", "average"]
    const type = challengeTypes[Math.floor(Math.random() * challengeTypes.length)]

    const datasets = [
      {
        labels: ["Apples", "Bananas", "Oranges", "Grapes"],
        data: [12, 8, 15, 6],
        context: "fruits sold",
      },
      {
        labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        data: [25, 30, 18, 35, 22],
        context: "books read",
      },
      {
        labels: ["Red", "Blue", "Green", "Yellow"],
        data: [9, 14, 7, 11],
        context: "favorite colors",
      },
      {
        labels: ["Soccer", "Basketball", "Tennis", "Swimming"],
        data: [20, 16, 8, 12],
        context: "sports preferences",
      },
    ]

    const dataset = datasets[Math.floor(Math.random() * datasets.length)]
    const chartType = Math.random() > 0.5 ? "bar" : "pictograph"

    switch (type) {
      case "highest":
        const maxValue = Math.max(...dataset.data)
        const maxIndex = dataset.data.indexOf(maxValue)
        return {
          type: "highest",
          data: dataset.data,
          labels: dataset.labels,
          question: `Which ${dataset.labels[maxIndex].toLowerCase()} has the highest value?`,
          answer: maxValue,
          chartType,
        }

      case "lowest":
        const minValue = Math.min(...dataset.data)
        return {
          type: "lowest",
          data: dataset.data,
          labels: dataset.labels,
          question: `What is the lowest value in the ${dataset.context} data?`,
          answer: minValue,
          chartType,
        }

      case "total":
        const total = dataset.data.reduce((sum, val) => sum + val, 0)
        return {
          type: "total",
          data: dataset.data,
          labels: dataset.labels,
          question: `What is the total of all ${dataset.context}?`,
          answer: total,
          chartType,
        }

      case "difference":
        const max = Math.max(...dataset.data)
        const min = Math.min(...dataset.data)
        return {
          type: "difference",
          data: dataset.data,
          labels: dataset.labels,
          question: `What is the difference between the highest and lowest values?`,
          answer: max - min,
          chartType,
        }

      default: // average
        const avg = Math.round(dataset.data.reduce((sum, val) => sum + val, 0) / dataset.data.length)
        return {
          type: "average",
          data: dataset.data,
          labels: dataset.labels,
          question: `What is the average (rounded) of the ${dataset.context}?`,
          answer: avg,
          chartType,
        }
    }
  }

  const startGame = () => {
    setGameActive(true)
    setTimeLeft(100)
    setScore(0)
    setStreak(0)
    setTotalQuestions(0)
    setCorrectAnswers(0)
    setCurrentChallenge(generateChallenge())
    setUserAnswer("")
    setFeedback("")
  }

  const checkAnswer = () => {
    if (!currentChallenge || !userAnswer) return

    const answer = Number.parseInt(userAnswer)
    setTotalQuestions((prev) => prev + 1)

    if (answer === currentChallenge.answer) {
      const points = 12 + streak * 2
      setScore((prev) => prev + points)
      setStreak((prev) => prev + 1)
      setCorrectAnswers((prev) => prev + 1)
      setFeedback(`Great detective work! +${points} points`)

      setTimeout(() => {
        setCurrentChallenge(generateChallenge())
        setUserAnswer("")
        setFeedback("")
      }, 1500)
    } else {
      setStreak(0)
      setFeedback(`Not quite right! The answer was ${currentChallenge.answer}`)

      setTimeout(() => {
        setCurrentChallenge(generateChallenge())
        setUserAnswer("")
        setFeedback("")
      }, 2000)
    }
  }

  const renderChart = (challenge: DataChallenge) => {
    if (challenge.chartType === "bar") {
      const maxValue = Math.max(...challenge.data)
      return (
        <div className="flex items-end justify-center gap-4 h-40 bg-muted rounded-lg p-4">
          {challenge.data.map((value, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div
                className="bg-primary rounded-t-md min-w-[40px] flex items-end justify-center text-white text-sm font-semibold"
                style={{ height: `${(value / maxValue) * 100}px` }}
              >
                {value}
              </div>
              <span className="text-xs text-center font-medium">{challenge.labels[index]}</span>
            </div>
          ))}
        </div>
      )
    } else {
      // Pictograph
      return (
        <div className="bg-muted rounded-lg p-4 space-y-3">
          {challenge.data.map((value, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="w-20 text-sm font-medium">{challenge.labels[index]}:</span>
              <div className="flex gap-1">
                {Array.from({ length: value }, (_, i) => (
                  <div key={i} className="w-4 h-4 bg-primary rounded-sm"></div>
                ))}
              </div>
              <span className="text-sm text-muted-foreground ml-2">({value})</span>
            </div>
          ))}
        </div>
      )
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
          <h1 className="text-4xl font-bold text-foreground mb-2">🔍 Data Detective</h1>
          <p className="text-muted-foreground">Solve mysteries hidden in charts and graphs!</p>
        </div>

        {!gameActive ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Ready to Investigate Data?</CardTitle>
              <CardDescription>Analyze bar graphs and pictographs to solve data mysteries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm">Bar Graphs</h4>
                  <p className="text-xs text-muted-foreground">Compare data using vertical bars</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm">Pictographs</h4>
                  <p className="text-xs text-muted-foreground">Use pictures to represent data</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm">Data Analysis</h4>
                  <p className="text-xs text-muted-foreground">Find patterns and trends</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm">Statistics</h4>
                  <p className="text-xs text-muted-foreground">Calculate averages and totals</p>
                </div>
              </div>

              {score > 0 && (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Last Investigation Results</h3>
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
                      <p className="text-muted-foreground">Cases Solved</p>
                    </div>
                  </div>
                </div>
              )}

              <Button onClick={startGame} className="w-full" size="lg">
                <SearchIcon className="w-4 h-4 mr-2" />
                Start Investigation
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
              <Progress value={(timeLeft / 100) * 100} className="w-32" />
            </div>

            {currentChallenge && (
              <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{currentChallenge.question}</CardTitle>
                  <Badge variant="outline" className="capitalize">
                    {currentChallenge.chartType === "bar" ? "Bar Graph" : "Pictograph"}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                  {renderChart(currentChallenge)}

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
                      Solve
                    </Button>
                  </div>

                  {feedback && (
                    <div
                      className={`text-center p-3 rounded-lg ${
                        feedback.includes("Great") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
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
