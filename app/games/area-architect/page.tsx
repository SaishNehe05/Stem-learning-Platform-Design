"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Star, Zap, Square } from "lucide-react"
import Link from "next/link"

interface BuildingChallenge {
  type: string
  shape: "rectangle" | "square"
  width: number
  height: number
  question: string
  answer: number
  unit: string
}

export default function AreaArchitectGame() {
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(120)
  const [gameActive, setGameActive] = useState(false)
  const [currentChallenge, setCurrentChallenge] = useState<BuildingChallenge | null>(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [feedback, setFeedback] = useState("")
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)

  const generateChallenge = (): BuildingChallenge => {
    const challengeTypes = ["area", "perimeter", "missing_side"]
    const type = challengeTypes[Math.floor(Math.random() * challengeTypes.length)]
    const shapes = ["rectangle", "square"] as const
    const shape = shapes[Math.floor(Math.random() * shapes.length)]

    const width = Math.floor(Math.random() * 12) + 3
    const height = shape === "square" ? width : Math.floor(Math.random() * 12) + 3

    const buildings = ["house", "school", "library", "park", "playground", "garden", "pool", "garage"]
    const building = buildings[Math.floor(Math.random() * buildings.length)]

    switch (type) {
      case "area":
        return {
          type: "area",
          shape,
          width,
          height,
          question: `What is the area of this ${shape === "square" ? "square" : "rectangular"} ${building}?`,
          answer: width * height,
          unit: "square meters",
        }

      case "perimeter":
        return {
          type: "perimeter",
          shape,
          width,
          height,
          question: `What is the perimeter of this ${shape === "square" ? "square" : "rectangular"} ${building}?`,
          answer: 2 * (width + height),
          unit: "meters",
        }

      default: // missing_side
        const knownSide = Math.random() > 0.5 ? width : height
        const area = width * height
        const missingSide = area / knownSide

        return {
          type: "missing_side",
          shape: "rectangle",
          width: knownSide,
          height: missingSide,
          question: `A rectangular ${building} has area ${area} sq m and one side is ${knownSide} m. What is the other side?`,
          answer: missingSide,
          unit: "meters",
        }
    }
  }

  const startGame = () => {
    setGameActive(true)
    setTimeLeft(120)
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

    const answer = Number.parseFloat(userAnswer)
    setTotalQuestions((prev) => prev + 1)

    if (Math.abs(answer - currentChallenge.answer) < 0.01) {
      const points = 15 + streak * 3
      setScore((prev) => prev + points)
      setStreak((prev) => prev + 1)
      setCorrectAnswers((prev) => prev + 1)
      setFeedback(`Perfect architecture! +${points} points`)

      setTimeout(() => {
        setCurrentChallenge(generateChallenge())
        setUserAnswer("")
        setFeedback("")
      }, 1500)
    } else {
      setStreak(0)
      setFeedback(`Not quite right! The answer was ${currentChallenge.answer} ${currentChallenge.unit}`)

      setTimeout(() => {
        setCurrentChallenge(generateChallenge())
        setUserAnswer("")
        setFeedback("")
      }, 2500)
    }
  }

  const drawBuilding = (challenge: BuildingChallenge) => {
    const maxSize = 200
    const scale = Math.min(maxSize / Math.max(challenge.width, challenge.height), 15)
    const rectWidth = challenge.width * scale
    const rectHeight = challenge.height * scale

    return (
      <div className="flex justify-center items-center bg-muted rounded-lg p-8 min-h-[250px]">
        <div className="relative">
          <svg width={rectWidth + 60} height={rectHeight + 60}>
            {/* Building */}
            <rect
              x="30"
              y="30"
              width={rectWidth}
              height={rectHeight}
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary"
              opacity="0.7"
            />

            {/* Dimensions */}
            {challenge.type !== "missing_side" && (
              <>
                {/* Width label */}
                <text x={30 + rectWidth / 2} y={25} textAnchor="middle" className="text-sm font-semibold fill-current">
                  {challenge.width}m
                </text>

                {/* Height label */}
                <text
                  x={20}
                  y={30 + rectHeight / 2}
                  textAnchor="middle"
                  className="text-sm font-semibold fill-current"
                  transform={`rotate(-90, 20, ${30 + rectHeight / 2})`}
                >
                  {challenge.height}m
                </text>
              </>
            )}

            {challenge.type === "missing_side" && (
              <>
                <text x={30 + rectWidth / 2} y={25} textAnchor="middle" className="text-sm font-semibold fill-current">
                  {challenge.width}m
                </text>

                <text
                  x={20}
                  y={30 + rectHeight / 2}
                  textAnchor="middle"
                  className="text-sm font-semibold fill-current text-red-600"
                  transform={`rotate(-90, 20, ${30 + rectHeight / 2})`}
                >
                  ?
                </text>
              </>
            )}

            {/* Grid pattern for area visualization */}
            {challenge.type === "area" && (
              <g opacity="0.3">
                {Array.from({ length: challenge.width }, (_, i) => (
                  <line
                    key={`v${i}`}
                    x1={30 + (i + 1) * scale}
                    y1="30"
                    x2={30 + (i + 1) * scale}
                    y2={30 + rectHeight}
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                ))}
                {Array.from({ length: challenge.height }, (_, i) => (
                  <line
                    key={`h${i}`}
                    x1="30"
                    y1={30 + (i + 1) * scale}
                    x2={30 + rectWidth}
                    y2={30 + (i + 1) * scale}
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                ))}
              </g>
            )}
          </svg>
        </div>
      </div>
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
          <h1 className="text-4xl font-bold text-foreground mb-2">🏗️ Area Architect</h1>
          <p className="text-muted-foreground">Design buildings while mastering area and perimeter!</p>
        </div>

        {!gameActive ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Ready to Build?</CardTitle>
              <CardDescription>Calculate area and perimeter while designing amazing buildings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm">Area</h4>
                  <p className="text-xs text-muted-foreground">Length × Width (square units)</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm">Perimeter</h4>
                  <p className="text-xs text-muted-foreground">Distance around the shape</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm">Rectangle</h4>
                  <p className="text-xs text-muted-foreground">4 sides, opposite sides equal</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm">Square</h4>
                  <p className="text-xs text-muted-foreground">4 equal sides, special rectangle</p>
                </div>
              </div>

              {score > 0 && (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Last Building Project</h3>
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
                      <p className="text-muted-foreground">Buildings Built</p>
                    </div>
                  </div>
                </div>
              )}

              <Button onClick={startGame} className="w-full" size="lg">
                <Square className="w-4 h-4 mr-2" />
                Start Building
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Badge variant="outline">
                  Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                </Badge>
                <Badge variant="secondary">Score: {score}</Badge>
                <Badge variant="default">Streak: {streak}</Badge>
              </div>
              <Progress value={(timeLeft / 120) * 100} className="w-32" />
            </div>

            {currentChallenge && (
              <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{currentChallenge.question}</CardTitle>
                  <Badge variant="outline" className="capitalize">
                    {currentChallenge.type.replace("_", " ")} Challenge
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                  {drawBuilding(currentChallenge)}

                  <div className="flex gap-2 max-w-xs mx-auto">
                    <input
                      type="number"
                      step="0.1"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Your answer"
                      className="flex-1 px-3 py-2 border border-border rounded-md text-center text-lg font-semibold"
                      onKeyPress={(e) => e.key === "Enter" && checkAnswer()}
                    />
                    <Button onClick={checkAnswer} disabled={!userAnswer}>
                      Build
                    </Button>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">Answer in {currentChallenge.unit}</div>

                  {feedback && (
                    <div
                      className={`text-center p-3 rounded-lg ${
                        feedback.includes("Perfect") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
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
