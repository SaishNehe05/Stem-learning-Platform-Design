"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Star, Zap, Target } from "lucide-react"
import Link from "next/link"

interface AngleQuestion {
  type: string
  angle: number
  description: string
  options: number[]
  correct: number
}

export default function AngleMasterGame() {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(90)
  const [gameActive, setGameActive] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<AngleQuestion | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [feedback, setFeedback] = useState("")
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)

  const angleTypes = [
    { name: "Acute", range: [1, 89], description: "Less than 90°" },
    { name: "Right", range: [90, 90], description: "Exactly 90°" },
    { name: "Obtuse", range: [91, 179], description: "Between 90° and 180°" },
    { name: "Straight", range: [180, 180], description: "Exactly 180°" },
    { name: "Reflex", range: [181, 359], description: "Between 180° and 360°" },
  ]

  const generateQuestion = (): AngleQuestion => {
    const questionTypes = ["identify", "measure", "classify", "calculate"]
    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)]

    switch (type) {
      case "identify":
        const angleType = angleTypes[Math.floor(Math.random() * angleTypes.length)]
        const angle = Math.floor(Math.random() * (angleType.range[1] - angleType.range[0] + 1)) + angleType.range[0]
        const wrongOptions = angleTypes.filter((t) => t.name !== angleType.name).slice(0, 3)
        return {
          type: "identify",
          angle,
          description: `What type of angle is ${angle}°?`,
          options: [angleType.name, ...wrongOptions.map((t) => t.name)].sort(() => Math.random() - 0.5),
          correct: angleType.name,
        }

      case "measure":
        const measureAngle = [30, 45, 60, 90, 120, 135, 150, 180][Math.floor(Math.random() * 8)]
        const wrongMeasures = [30, 45, 60, 90, 120, 135, 150, 180].filter((a) => a !== measureAngle).slice(0, 3)
        return {
          type: "measure",
          angle: measureAngle,
          description: "What is the measure of this angle?",
          options: [measureAngle, ...wrongMeasures].sort(() => Math.random() - 0.5),
          correct: measureAngle,
        }

      case "classify":
        const classifyAngle = Math.floor(Math.random() * 360) + 1
        const correctType =
          angleTypes.find((t) => classifyAngle >= t.range[0] && classifyAngle <= t.range[1])?.name || "Acute"
        const wrongTypes = angleTypes
          .filter((t) => t.name !== correctType)
          .slice(0, 3)
          .map((t) => t.name)
        return {
          type: "classify",
          angle: classifyAngle,
          description: `Classify the angle measuring ${classifyAngle}°`,
          options: [correctType, ...wrongTypes].sort(() => Math.random() - 0.5),
          correct: correctType,
        }

      default: // calculate
        const baseAngle = Math.floor(Math.random() * 90) + 30
        const complement = 90 - baseAngle
        const supplement = 180 - baseAngle
        const isComplement = Math.random() > 0.5
        const targetAngle = isComplement ? complement : supplement
        const wrongCalcs = [baseAngle + 10, baseAngle - 10, baseAngle * 2]
          .filter((a) => a !== targetAngle && a > 0)
          .slice(0, 3)

        return {
          type: "calculate",
          angle: baseAngle,
          description: `Find the ${isComplement ? "complement" : "supplement"} of ${baseAngle}°`,
          options: [targetAngle, ...wrongCalcs].sort(() => Math.random() - 0.5),
          correct: targetAngle,
        }
    }
  }

  const startGame = () => {
    setGameActive(true)
    setTimeLeft(90)
    setScore(0)
    setStreak(0)
    setTotalQuestions(0)
    setCorrectAnswers(0)
    setCurrentQuestion(generateQuestion())
    setSelectedAnswer(null)
    setFeedback("")
  }

  const checkAnswer = (answer: any) => {
    if (!currentQuestion) return

    setSelectedAnswer(answer)
    setTotalQuestions((prev) => prev + 1)

    if (answer === currentQuestion.correct) {
      const points = 15 + streak * 3
      setScore((prev) => prev + points)
      setStreak((prev) => prev + 1)
      setCorrectAnswers((prev) => prev + 1)
      setFeedback(`Excellent! +${points} points`)
    } else {
      setStreak(0)
      setFeedback(`Incorrect. The answer was ${currentQuestion.correct}`)
    }

    setTimeout(() => {
      setCurrentQuestion(generateQuestion())
      setSelectedAnswer(null)
      setFeedback("")
    }, 2000)
  }

  const drawAngle = (angle: number) => {
    const radius = 80
    const centerX = 100
    const centerY = 100

    // Convert angle to radians
    const radians = (angle * Math.PI) / 180

    // Calculate end point
    const endX = centerX + radius * Math.cos(radians)
    const endY = centerY - radius * Math.sin(radians)

    return (
      <svg width="200" height="200" className="mx-auto">
        {/* Base line */}
        <line
          x1={centerX - radius}
          y1={centerY}
          x2={centerX + radius}
          y2={centerY}
          stroke="currentColor"
          strokeWidth="2"
        />
        {/* Angle line */}
        <line x1={centerX} y1={centerY} x2={endX} y2={endY} stroke="currentColor" strokeWidth="2" />
        {/* Arc */}
        <path
          d={`M ${centerX + 30} ${centerY} A 30 30 0 ${angle > 180 ? 1 : 0} 0 ${centerX + 30 * Math.cos(radians)} ${centerY - 30 * Math.sin(radians)}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        {/* Center point */}
        <circle cx={centerX} cy={centerY} r="3" fill="currentColor" />
        {/* Angle label */}
        <text x={centerX + 40} y={centerY - 10} className="text-sm font-semibold" fill="currentColor">
          {currentQuestion?.type === "measure" ? "?" : `${angle}°`}
        </text>
      </svg>
    )
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
          <h1 className="text-4xl font-bold text-foreground mb-2">📐 Angle Master</h1>
          <p className="text-muted-foreground">Master angles, lines, and geometric shapes!</p>
        </div>

        {!gameActive ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Ready to Master Angles?</CardTitle>
              <CardDescription>Learn about different types of angles and their measurements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {angleTypes.map((type, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium text-sm">{type.name} Angle</h4>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
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
                Start Angle Challenge
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
              <Progress value={(timeLeft / 90) * 100} className="w-32" />
            </div>

            {currentQuestion && (
              <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{currentQuestion.description}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted rounded-lg p-6">{drawAngle(currentQuestion.angle)}</div>

                  <div className="grid grid-cols-2 gap-3">
                    {currentQuestion.options.map((option, index) => (
                      <Button
                        key={index}
                        variant={selectedAnswer === option ? "default" : "outline"}
                        onClick={() => checkAnswer(option)}
                        disabled={selectedAnswer !== null}
                        className="h-12"
                      >
                        {typeof option === "string" ? option : `${option}°`}
                      </Button>
                    ))}
                  </div>

                  {feedback && (
                    <div
                      className={`text-center p-3 rounded-lg ${
                        feedback.includes("Excellent") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
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
