"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Camera, EyeIcon, CheckCircle, XCircle, Lightbulb, Star } from "lucide-react"
import Link from "next/link"

interface VisionChallenge {
  id: string
  image: string
  question: string
  options: string[]
  correct: number
  explanation: string
  patterns: string[]
  difficulty: "easy" | "medium" | "hard"
}

export default function VisionQuestPage() {
  const [currentLevel, setCurrentLevel] = useState<"easy" | "medium" | "hard">("easy")
  const [score, setScore] = useState(0)
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [gameComplete, setGameComplete] = useState(false)

  const challenges: Record<string, VisionChallenge[]> = {
    easy: [
      {
        id: "e1",
        image: "🐕",
        question: "What animal is this?",
        options: ["Cat", "Dog", "Bird", "Fish"],
        correct: 1,
        explanation: "AI identifies dogs by recognizing patterns like four legs, tail, ears, and snout shape!",
        patterns: ["Four legs", "Tail", "Pointed ears", "Snout"],
        difficulty: "easy",
      },
      {
        id: "e2",
        image: "🚗",
        question: "What vehicle is this?",
        options: ["Bicycle", "Car", "Airplane", "Boat"],
        correct: 1,
        explanation: "AI recognizes cars by their wheels, windows, doors, and rectangular body shape!",
        patterns: ["Four wheels", "Windows", "Doors", "Rectangular body"],
        difficulty: "easy",
      },
      {
        id: "e3",
        image: "🍎",
        question: "What fruit is this?",
        options: ["Orange", "Apple", "Banana", "Grape"],
        correct: 1,
        explanation: "AI identifies apples by their round shape, stem, and red/green color patterns!",
        patterns: ["Round shape", "Stem on top", "Red/green color", "Smooth surface"],
        difficulty: "easy",
      },
    ],
    medium: [
      {
        id: "m1",
        image: "🏠",
        question: "What type of building is this?",
        options: ["School", "House", "Hospital", "Store"],
        correct: 1,
        explanation: "AI recognizes houses by identifying roof, windows, door, and residential structure patterns!",
        patterns: ["Triangular roof", "Multiple windows", "Front door", "Residential size"],
        difficulty: "medium",
      },
      {
        id: "m2",
        image: "✈️",
        question: "What mode of transport is this?",
        options: ["Car", "Train", "Airplane", "Ship"],
        correct: 2,
        explanation: "AI identifies airplanes by wings, fuselage, tail, and ability to fly!",
        patterns: ["Wings", "Fuselage", "Tail fin", "Jet engines"],
        difficulty: "medium",
      },
      {
        id: "m3",
        image: "🌳",
        question: "What type of plant is this?",
        options: ["Flower", "Grass", "Tree", "Bush"],
        correct: 2,
        explanation: "AI recognizes trees by their trunk, branches, leaves, and tall vertical structure!",
        patterns: ["Thick trunk", "Branches", "Leaves/foliage", "Tall height"],
        difficulty: "medium",
      },
    ],
    hard: [
      {
        id: "h1",
        image: "🦋",
        question: "What type of insect is this?",
        options: ["Bee", "Butterfly", "Fly", "Ant"],
        correct: 1,
        explanation: "AI identifies butterflies by colorful wings, antennae, and symmetric wing patterns!",
        patterns: ["Colorful wings", "Long antennae", "Symmetric patterns", "Delicate structure"],
        difficulty: "hard",
      },
      {
        id: "h2",
        image: "🏔️",
        question: "What geographical feature is this?",
        options: ["Hill", "Mountain", "Valley", "Plain"],
        correct: 1,
        explanation: "AI recognizes mountains by their peak, steep slopes, and high elevation patterns!",
        patterns: ["Pointed peak", "Steep slopes", "Rocky surface", "High elevation"],
        difficulty: "hard",
      },
      {
        id: "h3",
        image: "🌙",
        question: "What celestial object is this?",
        options: ["Sun", "Moon", "Star", "Planet"],
        correct: 1,
        explanation: "AI identifies the moon by its crescent shape, surface craters, and nighttime appearance!",
        patterns: ["Crescent shape", "Surface craters", "Gray color", "Nighttime visibility"],
        difficulty: "hard",
      },
    ],
  }

  const currentChallenges = challenges[currentLevel]
  const totalChallenges = currentChallenges.length

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowResult(true)

    if (answerIndex === currentChallenges[currentChallenge].correct) {
      setScore(score + 15)
    }
  }

  const nextChallenge = () => {
    if (currentChallenge < totalChallenges - 1) {
      setCurrentChallenge(currentChallenge + 1)
      setShowResult(false)
      setSelectedAnswer(null)
    } else {
      setGameComplete(true)
    }
  }

  const resetGame = () => {
    setCurrentChallenge(0)
    setScore(0)
    setShowResult(false)
    setSelectedAnswer(null)
    setGameComplete(false)
  }

  const changeLevel = (level: "easy" | "medium" | "hard") => {
    setCurrentLevel(level)
    resetGame()
  }

  if (gameComplete) {
    const maxScore = totalChallenges * 15
    const percentage = (score / maxScore) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link href="/games">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Games
              </Button>
            </Link>
          </div>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Camera className="w-8 h-8 text-purple-500" />
                Vision Quest Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-6xl font-bold text-primary">{percentage.toFixed(0)}%</div>
              <div className="text-lg text-muted-foreground">
                You scored {score} out of {maxScore} points!
              </div>

              <div className="space-y-2">
                {percentage >= 80 && (
                  <Badge className="bg-purple-500 text-white text-lg px-4 py-2">👁️ Computer Vision Expert!</Badge>
                )}
                {percentage >= 60 && percentage < 80 && (
                  <Badge className="bg-blue-500 text-white text-lg px-4 py-2">🔍 Good Pattern Recognition!</Badge>
                )}
                {percentage < 60 && (
                  <Badge className="bg-orange-500 text-white text-lg px-4 py-2">📚 Keep Practicing Vision!</Badge>
                )}
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={resetGame} className="bg-primary">
                  Play Again
                </Button>
                <Link href="/games">
                  <Button variant="outline">More Games</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/games">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Games
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-6 h-6 text-purple-500" />
                Vision Quest - Computer Vision Challenge
              </CardTitle>
              <div className="flex gap-2">
                {["easy", "medium", "hard"].map((level) => (
                  <Button
                    key={level}
                    variant={currentLevel === level ? "default" : "outline"}
                    size="sm"
                    onClick={() => changeLevel(level as "easy" | "medium" | "hard")}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Challenge {currentChallenge + 1} of {totalChallenges}
                  </span>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold">{score} points</span>
                  </div>
                </div>
                <Progress value={((currentChallenge + 1) / totalChallenges) * 100} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="text-8xl mb-4 animate-pulse">{currentChallenges[currentChallenge].image}</div>
                  <div className="absolute inset-0 border-4 border-dashed border-purple-300 rounded-lg animate-pulse opacity-50" />
                  <EyeIcon className="absolute top-2 right-2 w-6 h-6 text-purple-500" />
                </div>
                <h2 className="text-xl font-bold text-foreground">{currentChallenges[currentChallenge].question}</h2>
              </div>

              {!showResult ? (
                <div className="space-y-4">
                  <p className="text-center text-muted-foreground">Help the AI identify what it sees!</p>
                  <div className="grid grid-cols-2 gap-3">
                    {currentChallenges[currentChallenge].options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        variant="outline"
                        className="h-16 text-lg hover:bg-purple-50 dark:hover:bg-purple-900/20"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    {selectedAnswer === currentChallenges[currentChallenge].correct ? (
                      <div className="space-y-2">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                        <h3 className="text-xl font-bold text-green-600">Perfect Vision!</h3>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                        <h3 className="text-xl font-bold text-red-600">Look Again!</h3>
                      </div>
                    )}
                  </div>

                  <Card className="bg-purple-50 dark:bg-purple-900/20">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Lightbulb className="w-5 h-5 text-purple-500 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-1">How AI Sees It:</h4>
                            <p className="text-purple-600 dark:text-purple-400">
                              {currentChallenges[currentChallenge].explanation}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-purple-700 dark:text-purple-300 mb-2">
                            Key Patterns AI Looks For:
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {currentChallenges[currentChallenge].patterns.map((pattern, index) => (
                              <Badge key={index} variant="outline" className="text-purple-600 border-purple-300">
                                {pattern}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button onClick={nextChallenge} className="w-full bg-purple-500 hover:bg-purple-600">
                    {currentChallenge < totalChallenges - 1 ? "Next Challenge" : "Complete Quest"}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
