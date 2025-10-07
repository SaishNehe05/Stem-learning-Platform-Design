"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, Trophy, ArrowLeft, RotateCcw, Zap } from "lucide-react"
import Link from "next/link"
import { progressTracker } from "@/lib/progress-tracker"

interface Shape {
  id: string
  pattern: boolean[][]
  mirrored?: boolean[][]
}

export default function SymmetryMazeGame() {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 })
  const [currentShape, setCurrentShape] = useState<Shape | null>(null)
  const [userMirror, setUserMirror] = useState<boolean[][]>([])
  const [doorOpen, setDoorOpen] = useState(false)
  const [streak, setStreak] = useState(0)

  const shapes: Shape[] = [
    {
      id: "triangle",
      pattern: [
        [false, true, false],
        [true, true, true],
        [false, false, false],
      ],
    },
    {
      id: "L-shape",
      pattern: [
        [true, false, false],
        [true, false, false],
        [true, true, true],
      ],
    },
    {
      id: "cross",
      pattern: [
        [false, true, false],
        [true, true, true],
        [false, true, false],
      ],
    },
  ]

  const generateMirror = (pattern: boolean[][]) => {
    return pattern.map((row) => [...row].reverse())
  }

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setCurrentLevel(1)
    setPlayerPos({ x: 0, y: 0 })
    setStreak(0)
    setGameComplete(false)
    setDoorOpen(false)
    const shape = shapes[0]
    setCurrentShape({ ...shape, mirrored: generateMirror(shape.pattern) })
    setUserMirror(
      Array(3)
        .fill(null)
        .map(() => Array(3).fill(false)),
    )
  }

  const toggleCell = (row: number, col: number) => {
    if (doorOpen) return

    const newMirror = [...userMirror]
    newMirror[row][col] = !newMirror[row][col]
    setUserMirror(newMirror)
  }

  const checkMirror = () => {
    if (!currentShape?.mirrored) return false

    return userMirror.every((row, i) => row.every((cell, j) => cell === currentShape.mirrored![i][j]))
  }

  const submitMirror = () => {
    if (checkMirror()) {
      const points = 10 + streak * 2
      setScore((prev) => prev + points)
      setStreak((prev) => prev + 1)
      setDoorOpen(true)

      setTimeout(() => {
        if (currentLevel >= 5) {
          endGame()
        } else {
          nextLevel()
        }
      }, 2000)
    } else {
      setStreak(0)
      // Flash red or show error
    }
  }

  const nextLevel = () => {
    setCurrentLevel((prev) => prev + 1)
    setPlayerPos({ x: 0, y: 0 })
    setDoorOpen(false)

    const shapeIndex = currentLevel % shapes.length
    const shape = shapes[shapeIndex]
    setCurrentShape({ ...shape, mirrored: generateMirror(shape.pattern) })
    setUserMirror(
      Array(3)
        .fill(null)
        .map(() => Array(3).fill(false)),
    )
  }

  const endGame = () => {
    setGameActive(false)
    setGameComplete(true)

    progressTracker.recordQuizCompletion({
      quizId: "symmetry-maze",
      subject: "math",
      score: (score / 100) * 100,
      totalQuestions: 5,
      correctAnswers: currentLevel,
      timeSpent: 0,
      difficulty: "medium",
      timestamp: new Date().toISOString(),
      answers: [],
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/games" className="flex items-center gap-3">
              <ArrowLeft className="w-5 h-5" />
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-foreground">Symmetry Mirror Maze</span>
                <p className="text-sm text-muted-foreground">Math Grade 6-7</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              {gameActive && (
                <>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {score} pts
                  </Badge>
                  {streak > 0 && (
                    <Badge variant="default" className="bg-orange-500">
                      🔥 {streak}x streak
                    </Badge>
                  )}
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
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">🪞 Symmetry Mirror Maze</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Navigate through the maze by creating perfect mirror reflections! Doors only open when you mirror the
                shape correctly.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">🎯 Goal</div>
                  <div>Mirror shapes perfectly</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">🏆 Scoring</div>
                  <div>+10 pts + streak bonus</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">🔥 Streaks</div>
                  <div>Bonus stars for combos</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium">🛡️ Reward</div>
                  <div>Mirror shield avatar</div>
                </div>
              </div>
              <Button onClick={startGame} size="lg" className="w-full">
                Start Mirror Maze
              </Button>
            </CardContent>
          </Card>
        )}

        {gameActive && currentShape && (
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

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Original Shape</CardTitle>
                  <p className="text-sm text-muted-foreground">Mirror this shape to open the door</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-1 w-fit mx-auto">
                    {currentShape.pattern.map((row, i) =>
                      row.map((cell, j) => (
                        <div
                          key={`${i}-${j}`}
                          className={`w-8 h-8 border-2 ${
                            cell ? "bg-blue-500 border-blue-600" : "bg-gray-100 border-gray-300"
                          }`}
                        />
                      )),
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Mirror</CardTitle>
                  <p className="text-sm text-muted-foreground">Click cells to create the mirror image</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-1 w-fit mx-auto mb-4">
                    {userMirror.map((row, i) =>
                      row.map((cell, j) => (
                        <button
                          key={`${i}-${j}`}
                          onClick={() => toggleCell(i, j)}
                          className={`w-8 h-8 border-2 transition-colors ${
                            cell ? "bg-green-500 border-green-600" : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                          }`}
                        />
                      )),
                    )}
                  </div>

                  {doorOpen ? (
                    <div className="text-center">
                      <div className="text-green-600 font-medium mb-2">🚪 Door Opened! Perfect mirror! ✨</div>
                      <div className="text-sm text-muted-foreground">Moving to next level...</div>
                    </div>
                  ) : (
                    <Button onClick={submitMirror} className="w-full">
                      Check Mirror
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
              <CardTitle className="text-2xl">🎉 Maze Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-green-600 font-medium">🛡️ You earned the Mirror Shield avatar item!</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{currentLevel}</div>
                  <div className="text-sm text-muted-foreground">Levels Completed</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{score}</div>
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
