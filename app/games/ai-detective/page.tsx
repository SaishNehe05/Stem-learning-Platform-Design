"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeftIcon as ArrowLeft,
  BotIcon as Bot,
  ZapIcon as Zap,
  CheckCircleIcon as CheckCircle,
  XCircleIcon as XCircle,
  LightbulbIcon as Lightbulb,
} from "@/lib/icons"
import Link from "next/link"

interface Scenario {
  id: string
  title: string
  description: string
  type: "ai" | "automation"
  explanation: string
  difficulty: "easy" | "medium" | "hard"
}

export default function AIDetectivePage() {
  const [currentLevel, setCurrentLevel] = useState<"easy" | "medium" | "hard">("easy")
  const [score, setScore] = useState(0)
  const [currentScenario, setCurrentScenario] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<"ai" | "automation" | null>(null)
  const [gameComplete, setGameComplete] = useState(false)

  const scenarios: Record<string, Scenario[]> = {
    easy: [
      {
        id: "e1",
        title: "Washing Machine",
        description: "A machine that automatically washes clothes when you press a button",
        type: "automation",
        explanation:
          "Washing machines follow pre-programmed cycles. They don't learn or make decisions - just automation!",
        difficulty: "easy",
      },
      {
        id: "e2",
        title: "Alexa Voice Assistant",
        description: "A device that understands your voice and answers questions",
        type: "ai",
        explanation: "Alexa uses AI to understand speech, process language, and provide intelligent responses!",
        difficulty: "easy",
      },
      {
        id: "e3",
        title: "Automatic Door",
        description: "A door that opens when someone approaches using sensors",
        type: "automation",
        explanation: "Sensor doors follow simple rules: detect motion → open door. No learning involved!",
        difficulty: "easy",
      },
      {
        id: "e4",
        title: "Netflix Recommendations",
        description: "A system that suggests movies based on what you've watched before",
        type: "ai",
        explanation: "Netflix uses AI to analyze your viewing patterns and predict what you might like!",
        difficulty: "easy",
      },
    ],
    medium: [
      {
        id: "m1",
        title: "Google Maps Navigation",
        description: "An app that finds the best route and updates based on traffic conditions",
        type: "ai",
        explanation: "Google Maps uses AI to analyze real-time traffic data and predict the fastest routes!",
        difficulty: "medium",
      },
      {
        id: "m2",
        title: "Printer",
        description: "A machine that prints documents when you send them from your computer",
        type: "automation",
        explanation: "Printers follow programmed instructions to print. No intelligence or learning required!",
        difficulty: "medium",
      },
      {
        id: "m3",
        title: "Face Unlock on Phone",
        description: "A feature that unlocks your phone by recognizing your face",
        type: "ai",
        explanation: "Face recognition uses AI to identify unique facial patterns and verify identity!",
        difficulty: "medium",
      },
      {
        id: "m4",
        title: "Automatic Car Wash",
        description: "A system that washes cars automatically as they move through",
        type: "automation",
        explanation: "Car washes follow fixed sequences of operations without adapting or learning!",
        difficulty: "medium",
      },
    ],
    hard: [
      {
        id: "h1",
        title: "Self-Driving Car",
        description: "A vehicle that can navigate roads, avoid obstacles, and make driving decisions",
        type: "ai",
        explanation:
          "Self-driving cars use AI to process visual data, make real-time decisions, and learn from experience!",
        difficulty: "hard",
      },
      {
        id: "h2",
        title: "Robotic Assembly Line",
        description: "Robots that perform the same manufacturing tasks repeatedly with precision",
        type: "automation",
        explanation: "Assembly line robots follow programmed motions. They're precise but don't adapt or learn!",
        difficulty: "hard",
      },
      {
        id: "h3",
        title: "AI Fitness Coach App",
        description: "An app that watches your exercise form and gives personalized feedback",
        type: "ai",
        explanation: "AI fitness apps use computer vision to analyze movement and provide intelligent coaching!",
        difficulty: "hard",
      },
    ],
  }

  const currentScenarios = scenarios[currentLevel]
  const totalScenarios = currentScenarios.length

  const handleAnswer = (answer: "ai" | "automation") => {
    setSelectedAnswer(answer)
    setShowResult(true)

    if (answer === currentScenarios[currentScenario].type) {
      setScore(score + 10)
    }
  }

  const nextScenario = () => {
    if (currentScenario < totalScenarios - 1) {
      setCurrentScenario(currentScenario + 1)
      setShowResult(false)
      setSelectedAnswer(null)
    } else {
      setGameComplete(true)
    }
  }

  const resetGame = () => {
    setCurrentScenario(0)
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
    const maxScore = totalScenarios * 10
    const percentage = (score / maxScore) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
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
                <Bot className="w-8 h-8 text-blue-500" />
                Game Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-6xl font-bold text-primary">{percentage.toFixed(0)}%</div>
              <div className="text-lg text-muted-foreground">
                You scored {score} out of {maxScore} points!
              </div>

              <div className="space-y-2">
                {percentage >= 80 && (
                  <Badge className="bg-green-500 text-white text-lg px-4 py-2">🏆 AI Detective Master!</Badge>
                )}
                {percentage >= 60 && percentage < 80 && (
                  <Badge className="bg-blue-500 text-white text-lg px-4 py-2">🔍 Good Detective Work!</Badge>
                )}
                {percentage < 60 && (
                  <Badge className="bg-orange-500 text-white text-lg px-4 py-2">📚 Keep Learning!</Badge>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
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
                <Bot className="w-6 h-6 text-blue-500" />
                AI Detective Challenge
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
                    Question {currentScenario + 1} of {totalScenarios}
                  </span>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold">{score} points</span>
                  </div>
                </div>
                <Progress value={((currentScenario + 1) / totalScenarios) * 100} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-foreground">{currentScenarios[currentScenario].title}</h2>
                <p className="text-lg text-muted-foreground">{currentScenarios[currentScenario].description}</p>
              </div>

              {!showResult ? (
                <div className="space-y-4">
                  <p className="text-center text-muted-foreground">Is this an example of AI or Automation?</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={() => handleAnswer("ai")} className="h-20 text-lg bg-blue-500 hover:bg-blue-600">
                      <Bot className="w-6 h-6 mr-2" />
                      Artificial Intelligence
                    </Button>
                    <Button
                      onClick={() => handleAnswer("automation")}
                      className="h-20 text-lg bg-green-500 hover:bg-green-600"
                    >
                      <Zap className="w-6 h-6 mr-2" />
                      Automation
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    {selectedAnswer === currentScenarios[currentScenario].type ? (
                      <div className="space-y-2">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                        <h3 className="text-xl font-bold text-green-600">Correct!</h3>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                        <h3 className="text-xl font-bold text-red-600">Not quite right</h3>
                      </div>
                    )}
                  </div>

                  <Card className="bg-blue-50 dark:bg-blue-900/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Explanation:</h4>
                          <p className="text-blue-600 dark:text-blue-400">
                            {currentScenarios[currentScenario].explanation}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button onClick={nextScenario} className="w-full">
                    {currentScenario < totalScenarios - 1 ? "Next Question" : "Finish Game"}
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
