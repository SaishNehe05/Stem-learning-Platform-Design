"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, Trophy, ArrowLeft, RotateCcw, Pizza } from "lucide-react"
import Link from "next/link"
import { progressTracker } from "@/lib/progress-tracker"

interface PizzaLevel {
  id: string
  targetFraction: { numerator: number; denominator: number }
  description: string
  difficulty: number
  concept: string
}

export default function PizzaFractionsGame() {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [coins, setCoins] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [selectedSlices, setSelectedSlices] = useState(0)
  const [totalSlices, setTotalSlices] = useState(8)
  const [showResult, setShowResult] = useState(false)
  const [timeBonus, setTimeBonus] = useState(0)
  const [startTime, setStartTime] = useState(0)

  const levels: PizzaLevel[] = [
    {
      id: "1",
      targetFraction: { numerator: 1, denominator: 2 },
      description: "Half a pizza",
      difficulty: 1,
      concept: "Basic fractions - equal parts of a whole",
    },
    {
      id: "2",
      targetFraction: { numerator: 1, denominator: 4 },
      description: "One quarter",
      difficulty: 1,
      concept: "Fractional units as parts of a whole",
    },
    {
      id: "3",
      targetFraction: { numerator: 3, denominator: 4 },
      description: "Three quarters",
      difficulty: 2,
      concept: "Comparing fractions with same denominator",
    },
    {
      id: "4",
      targetFraction: { numerator: 2, denominator: 3 },
      description: "Two thirds",
      difficulty: 2,
      concept: "Different denominators - thirds vs quarters",
    },
    {
      id: "5",
      targetFraction: { numerator: 5, denominator: 6 },
      description: "Five sixths",
      difficulty: 3,
      concept: "Mixed fractions and equivalent fractions",
    },
    {
      id: "6",
      targetFraction: { numerator: 7, denominator: 8 },
      description: "Seven eighths",
      difficulty: 3,
      concept: "Addition of fractions with same denominator",
    },
    {
      id: "7",
      targetFraction: { numerator: 3, denominator: 5 },
      description: "Three fifths",
      difficulty: 3,
      concept: "Representing fractions on number line",
    },
  ]

  const currentLevelData = levels[currentLevel - 1]

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setCoins(0)
    setCurrentLevel(1)
    setSelectedSlices(0)
    setTotalSlices(8)
    setGameComplete(false)
    setShowResult(false)
    setStartTime(Date.now())
  }

  const selectSlice = (sliceIndex: number) => {
    if (showResult) return

    const newSelected = sliceIndex + 1
    setSelectedSlices(newSelected)
  }

  const checkAnswer = () => {
    if (!currentLevelData) return

    const userFraction = selectedSlices / totalSlices
    const targetFraction = currentLevelData.targetFraction.numerator / currentLevelData.targetFraction.denominator

    const isCorrect = Math.abs(userFraction - targetFraction) < 0.001

    if (isCorrect) {
      const timeTaken = (Date.now() - startTime) / 1000
      const bonus = timeTaken < 10 ? 20 : timeTaken < 20 ? 10 : 0
      const points = 50 + bonus

      setScore((prev) => prev + points)
      setCoins((prev) => prev + 10)
      setTimeBonus(bonus)
      setShowResult(true)

      setTimeout(() => {
        if (currentLevel >= 7) {
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
        setSelectedSlices(0)
      }, 1500)
    }
  }

  const nextLevel = () => {
    setCurrentLevel((prev) => prev + 1)
    setSelectedSlices(0)
    setShowResult(false)
    setStartTime(Date.now())

    // Adjust pizza slices based on level
    const nextLevel = levels[currentLevel]
    if (nextLevel) {
      setTotalSlices(nextLevel.targetFraction.denominator)
    }
  }

  const endGame = () => {
    setGameActive(false)
    setGameComplete(true)

    progressTracker.recordQuizCompletion({
      quizId: "pizza-fractions",
      subject: "math",
      score: (score / 420) * 100,
      totalQuestions: 7,
      correctAnswers: currentLevel,
      timeSpent: 0,
      difficulty: "medium",
      timestamp: new Date().toISOString(),
      answers: [],
    })
  }

  const renderPizza = () => {
    const slices = []
    for (let i = 0; i < totalSlices; i++) {
      const angle = (360 / totalSlices) * i
      const isSelected = i < selectedSlices

      slices.push(
        <div
          key={i}
          onClick={() => selectSlice(i)}
          className={`absolute w-16 h-16 cursor-pointer transition-all duration-200 ${
            isSelected ? "opacity-100" : "opacity-30 hover:opacity-60"
          }`}
          style={{
            transform: `rotate(${angle}deg) translateY(-32px)`,
            transformOrigin: "50% 100%",
          }}
        >
          <div
            className={`w-full h-full rounded-t-full ${
              isSelected ? "bg-red-500 border-2 border-red-600" : "bg-yellow-200 border-2 border-yellow-400"
            } flex items-start justify-center pt-2`}
          >
            {isSelected && <span className="text-white text-xs">🍕</span>}
          </div>
        </div>,
      )
    }
    return slices
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/games" className="flex items-center gap-3">
              <ArrowLeft className="w-5 h-5" />
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white">
                <Pizza className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-foreground">Fraction Pizza Party</span>
                <p className="text-sm text-muted-foreground">Math Grade 6 - Chapter 7: Fractions</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              {gameActive && (
                <>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {score} pts
                  </Badge>
                  <Badge variant="default" className="bg-yellow-500">
                    🪙 {coins}
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {!gameActive && !gameComplete && (
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Pizza className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">🍕 Fraction Pizza Party</CardTitle>
              <p className="text-muted-foreground">Grade 6 Mathematics - Chapter 7: Fractions</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Learn fractions as parts of a whole! Understand fractional units, equivalent fractions, and practice
                addition & subtraction of fractions through pizza slicing.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">📚 Learning Goals</div>
                  <div>Fractional units & equal shares</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">📐 Number Line</div>
                  <div>Mark fractions on number line</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">🔄 Equivalent</div>
                  <div>Find equivalent fractions</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">➕ Operations</div>
                  <div>Add & subtract fractions</div>
                </div>
              </div>
              <Button onClick={startGame} size="lg" className="w-full">
                Start Learning Fractions
              </Button>
            </CardContent>
          </Card>
        )}

        {gameActive && currentLevelData && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Level {currentLevel}/7</span>
                  <span className="text-sm font-medium">{score} points</span>
                </div>
                <Progress value={(currentLevel / 7) * 100} />
                <p className="text-xs text-muted-foreground mt-2">{currentLevelData.concept}</p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">👨‍🍳 Chef's Order</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-6xl font-bold text-red-500 mb-2">
                    {currentLevelData.targetFraction.numerator}/{currentLevelData.targetFraction.denominator}
                  </div>
                  <p className="text-lg text-muted-foreground mb-4">{currentLevelData.description}</p>
                  <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
                    <strong>Concept:</strong> {currentLevelData.concept}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pizza Slices</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Click slices to select: {selectedSlices}/{totalSlices} = {selectedSlices}/{totalSlices}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className="absolute inset-0 bg-yellow-100 rounded-full border-4 border-yellow-400"></div>
                    {renderPizza()}
                  </div>

                  {showResult ? (
                    <div className="text-center">
                      {selectedSlices / totalSlices ===
                      currentLevelData.targetFraction.numerator / currentLevelData.targetFraction.denominator ? (
                        <div>
                          <div className="text-green-600 font-medium mb-2">🎉 Perfect! You understand fractions!</div>
                          {timeBonus > 0 && (
                            <div className="text-orange-500 text-sm">⚡ Speed bonus: +{timeBonus} points!</div>
                          )}
                          <div className="text-sm text-muted-foreground mt-2">
                            {selectedSlices}/{totalSlices} = {currentLevelData.targetFraction.numerator}/
                            {currentLevelData.targetFraction.denominator}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-red-600 font-medium">❌ Not quite right. Try again!</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            You selected {selectedSlices}/{totalSlices}, but we need{" "}
                            {currentLevelData.targetFraction.numerator}/{currentLevelData.targetFraction.denominator}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Button onClick={checkAnswer} className="w-full" disabled={selectedSlices === 0}>
                      Check My Fraction
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {gameComplete && (
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Trophy className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">🎉 Fractions Mastered!</CardTitle>
              <p className="text-muted-foreground">You've completed Chapter 7: Fractions</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-green-600 font-medium">🍕 You're now a Fraction Expert!</div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{currentLevel}</div>
                  <div className="text-sm text-muted-foreground">Levels Completed</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{coins}</div>
                  <div className="text-sm text-muted-foreground">Coins Earned</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{Math.round((score / 420) * 100)}%</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground bg-green-50 p-3 rounded-lg">
                <strong>Skills Learned:</strong> Fractional units, equivalent fractions, comparing fractions, addition &
                subtraction of fractions
              </div>
              <div className="flex gap-3">
                <Button onClick={startGame} className="flex-1">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Practice Again
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
