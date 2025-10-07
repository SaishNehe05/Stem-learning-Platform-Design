"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, Trophy, ArrowLeft, RotateCcw, Scale } from "lucide-react"
import Link from "next/link"
import { progressTracker } from "@/lib/progress-tracker"

interface EquationLevel {
  id: string
  equation: string
  leftSide: (string | number)[]
  rightSide: (string | number)[]
  solution: number
  description: string
}

export default function EquationBalancerGame() {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [leftWeight, setLeftWeight] = useState(0)
  const [rightWeight, setRightWeight] = useState(0)
  const [draggedValue, setDraggedValue] = useState<number | null>(null)
  const [placedValues, setPlacedValues] = useState<{ left: number[]; right: number[] }>({ left: [], right: [] })
  const [showResult, setShowResult] = useState(false)
  const [startTime, setStartTime] = useState(0)

  const levels: EquationLevel[] = [
    {
      id: "1",
      equation: "x + 3 = 7",
      leftSide: ["x", 3],
      rightSide: [7],
      solution: 4,
      description: "Find x when x + 3 = 7",
    },
    {
      id: "2",
      equation: "2x = 10",
      leftSide: [2, "x"],
      rightSide: [10],
      solution: 5,
      description: "Find x when 2x = 10",
    },
    {
      id: "3",
      equation: "x - 5 = 8",
      leftSide: ["x", -5],
      rightSide: [8],
      solution: 13,
      description: "Find x when x - 5 = 8",
    },
    {
      id: "4",
      equation: "3x + 2 = 14",
      leftSide: [3, "x", 2],
      rightSide: [14],
      solution: 4,
      description: "Find x when 3x + 2 = 14",
    },
    {
      id: "5",
      equation: "2x - 7 = 9",
      leftSide: [2, "x", -7],
      rightSide: [9],
      solution: 8,
      description: "Find x when 2x - 7 = 9",
    },
  ]

  const currentLevelData = levels[currentLevel - 1]
  const availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setCurrentLevel(1)
    setGameComplete(false)
    setLeftWeight(0)
    setRightWeight(0)
    setPlacedValues({ left: [], right: [] })
    setShowResult(false)
    setStartTime(Date.now())
  }

  const calculateWeight = (side: "left" | "right") => {
    const values = placedValues[side]
    if (side === "left") {
      // For left side, we need to substitute x with placed values
      let weight = 0
      const xValue = values.find((v) => typeof v === "number") || 0

      currentLevelData.leftSide.forEach((item) => {
        if (item === "x") {
          weight += xValue
        } else if (typeof item === "number") {
          weight += item
        }
      })
      return weight
    } else {
      return values.reduce((sum, val) => sum + val, 0)
    }
  }

  const handleDrop = (side: "left" | "right", value: number) => {
    if (side === "left" && placedValues.left.length > 0) return // Only one x value allowed

    const newPlaced = { ...placedValues }
    newPlaced[side] = [...newPlaced[side], value]
    setPlacedValues(newPlaced)

    // Update weights
    if (side === "left") {
      setLeftWeight(calculateWeight("left"))
    } else {
      setRightWeight(calculateWeight("right"))
    }
  }

  const checkBalance = () => {
    const leftTotal = calculateWeight("left")
    const rightTotal = currentLevelData.rightSide.reduce((sum, val) => sum + (typeof val === "number" ? val : 0), 0)

    const isCorrect = leftTotal === rightTotal && placedValues.left[0] === currentLevelData.solution

    if (isCorrect) {
      const timeTaken = (Date.now() - startTime) / 1000
      const speedBonus = timeTaken < 15 ? 30 : timeTaken < 30 ? 15 : 0
      const points = 100 + speedBonus

      setScore((prev) => prev + points)
      setShowResult(true)

      setTimeout(() => {
        if (currentLevel >= 5) {
          endGame()
        } else {
          nextLevel()
        }
      }, 2500)
    } else {
      // Show incorrect feedback
      setShowResult(true)
      setTimeout(() => {
        setShowResult(false)
        setPlacedValues({ left: [], right: [] })
        setLeftWeight(0)
        setRightWeight(0)
      }, 1500)
    }
  }

  const nextLevel = () => {
    setCurrentLevel((prev) => prev + 1)
    setPlacedValues({ left: [], right: [] })
    setLeftWeight(0)
    setRightWeight(0)
    setShowResult(false)
    setStartTime(Date.now())
  }

  const endGame = () => {
    setGameActive(false)
    setGameComplete(true)

    progressTracker.recordQuizCompletion({
      quizId: "equation-balancer",
      subject: "math",
      score: (score / 500) * 100,
      totalQuestions: 5,
      correctAnswers: currentLevel,
      timeSpent: 0,
      difficulty: "medium",
      timestamp: new Date().toISOString(),
      answers: [],
    })
  }

  const isBalanced = leftWeight === rightWeight && leftWeight > 0

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/games" className="flex items-center gap-3">
              <ArrowLeft className="w-5 h-5" />
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-foreground">Equation Balancer</span>
                <p className="text-sm text-muted-foreground">Math Grade 7</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              {gameActive && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {score} pts
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {!gameActive && !gameComplete && (
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Scale className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">⚖️ Equation Balancer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Balance the equation by finding the right value for x! Drag numbers to the scale.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">⚖️ Goal</div>
                  <div>Balance both sides</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">⚡ Speed Bonus</div>
                  <div>Solve quickly for more points</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">🎯 Precision</div>
                  <div>Exact values required</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">🏆 Reward</div>
                  <div>Themed weights unlock</div>
                </div>
              </div>
              <Button onClick={startGame} size="lg" className="w-full">
                Start Balancing
              </Button>
            </CardContent>
          </Card>
        )}

        {gameActive && currentLevelData && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Level {currentLevel}/5</span>
                  <span className="text-sm font-medium">{score} points</span>
                </div>
                <Progress value={(currentLevel / 5) * 100} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Solve: {currentLevelData.equation}</CardTitle>
                <p className="text-center text-muted-foreground">{currentLevelData.description}</p>
              </CardHeader>
              <CardContent>
                {/* Balance Scale */}
                <div className="relative mb-8">
                  <div className="flex justify-center mb-4">
                    <div
                      className={`w-4 h-16 bg-gray-400 transition-transform duration-500 ${
                        leftWeight > rightWeight ? "rotate-12" : rightWeight > leftWeight ? "-rotate-12" : ""
                      }`}
                    ></div>
                  </div>

                  <div className="flex justify-between items-end">
                    {/* Left Side */}
                    <div
                      className="w-32 h-20 bg-blue-100 border-2 border-blue-300 rounded-lg flex flex-col items-center justify-center"
                      onDrop={(e) => {
                        e.preventDefault()
                        const value = Number.parseInt(e.dataTransfer.getData("text/plain"))
                        handleDrop("left", value)
                      }}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <div className="text-sm font-medium">x = ?</div>
                      {placedValues.left.map((val, i) => (
                        <div key={i} className="text-lg font-bold text-blue-600">
                          {val}
                        </div>
                      ))}
                    </div>

                    {/* Right Side */}
                    <div className="w-32 h-20 bg-green-100 border-2 border-green-300 rounded-lg flex items-center justify-center">
                      <div className="text-lg font-bold text-green-600">{currentLevelData.rightSide[0]}</div>
                    </div>
                  </div>

                  {/* Balance indicator */}
                  <div className="text-center mt-4">
                    {isBalanced ? (
                      <div className="text-green-600 font-medium">⚖️ Balanced!</div>
                    ) : (
                      <div className="text-muted-foreground">Drag a number to balance</div>
                    )}
                  </div>
                </div>

                {/* Available Numbers */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Available Numbers:</h4>
                  <div className="grid grid-cols-8 gap-2">
                    {availableNumbers.map((num) => (
                      <div
                        key={num}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", num.toString())
                        }}
                        className="w-10 h-10 bg-yellow-100 border-2 border-yellow-300 rounded cursor-move flex items-center justify-center font-medium hover:bg-yellow-200 transition-colors"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>

                {showResult ? (
                  <div className="text-center">
                    {isBalanced && placedValues.left[0] === currentLevelData.solution ? (
                      <div className="text-green-600 font-medium">🎉 Perfect balance! Equation solved!</div>
                    ) : (
                      <div className="text-red-600 font-medium">❌ Not balanced. Try again!</div>
                    )}
                  </div>
                ) : (
                  <Button onClick={checkBalance} className="w-full" disabled={!isBalanced}>
                    Check Balance
                  </Button>
                )}
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
              <CardTitle className="text-2xl">🎉 All Equations Balanced!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-green-600 font-medium">⚖️ You unlocked themed balance weights!</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{currentLevel}</div>
                  <div className="text-sm text-muted-foreground">Equations Solved</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{score}</div>
                  <div className="text-sm text-muted-foreground">Total Score</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={startGame} className="flex-1">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
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
