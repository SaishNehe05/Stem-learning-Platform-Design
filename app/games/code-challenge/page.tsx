"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Cpu, Star, Trophy, ArrowLeft, RotateCcw, Code, CheckCircle } from "lucide-react"
import Link from "next/link"
import { progressTracker } from "@/lib/progress-tracker"
import { useTranslation } from "@/lib/i18n"

interface CodeChallenge {
  id: string
  title: string
  description: string
  code: string
  options: string[]
  correctAnswer: string
  explanation: string
}

export default function CodeChallengeGame() {
  const { t } = useTranslation()

  const [currentChallenge, setCurrentChallenge] = useState<CodeChallenge | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [score, setScore] = useState(0)
  const [challengeIndex, setChallengeIndex] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  const challenges: CodeChallenge[] = [
    {
      id: "variables",
      title: t("variablesInPython"),
      description: "What will this code print?",
      code: `x = 5\ny = 3\nprint(x + y)`,
      options: ["5", "8", "53", "Error"],
      correctAnswer: "8",
      explanation: "x + y = 5 + 3 = 8",
    },
    {
      id: "loops",
      title: t("forLoop"),
      description: "How many times will 'Hello' be printed?",
      code: `for i in range(3):\n    print("Hello")`,
      options: ["1", "2", "3", "4"],
      correctAnswer: "3",
      explanation: "range(3) creates [0, 1, 2], so the loop runs 3 times",
    },
    {
      id: "conditions",
      title: t("ifStatement"),
      description: "What will this code print?",
      code: `age = 15\nif age >= 18:\n    print("Adult")\nelse:\n    print("Minor")`,
      options: ["Adult", "Minor", "15", "Nothing"],
      correctAnswer: "Minor",
      explanation: "Since 15 < 18, the else block executes and prints 'Minor'",
    },
    {
      id: "functions",
      title: t("functionCall"),
      description: "What does this function return?",
      code: `def double(x):\n    return x * 2\n\nresult = double(4)`,
      options: ["4", "8", "2", "Error"],
      correctAnswer: "8",
      explanation: "double(4) returns 4 * 2 = 8",
    },
    {
      id: "lists",
      title: t("listOperations"),
      description: "What will this code print?",
      code: `numbers = [1, 2, 3]\nnumbers.append(4)\nprint(len(numbers))`,
      options: ["3", "4", "7", "Error"],
      correctAnswer: "4",
      explanation: "After appending 4, the list has 4 elements: [1, 2, 3, 4]",
    },
  ]

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setChallengeIndex(0)
    setGameComplete(false)
    setCurrentChallenge(challenges[0])
    setSelectedAnswer("")
    setShowFeedback(false)
  }

  const handleAnswer = (answer: string) => {
    if (!currentChallenge || showFeedback) return

    setSelectedAnswer(answer)
    setShowFeedback(true)

    if (answer === currentChallenge.correctAnswer) {
      setScore((prev) => prev + 20)
    }

    setTimeout(() => {
      if (challengeIndex >= challenges.length - 1) {
        endGame()
      } else {
        setChallengeIndex((prev) => prev + 1)
        setCurrentChallenge(challenges[challengeIndex + 1])
        setSelectedAnswer("")
        setShowFeedback(false)
      }
    }, 3000)
  }

  const endGame = () => {
    setGameActive(false)
    setGameComplete(true)

    progressTracker.recordQuizCompletion({
      quizId: "code-challenge",
      subject: "technology",
      score: (score / 100) * 100,
      totalQuestions: 5,
      correctAnswers: score / 20,
      timeSpent: 0,
      difficulty: "hard",
      timestamp: new Date().toISOString(),
      answers: [],
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/games" className="flex items-center gap-3">
              <ArrowLeft className="w-5 h-5" />
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-foreground">{t("codeQuest")}</span>
                <p className="text-sm text-muted-foreground">{t("programmingChallenge")}</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              {gameActive && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {score} {t("points")}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {!gameActive && !gameComplete && (
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Code className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">💻 {t("codeQuest")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-muted-foreground">
                <p className="mb-4">{t("programmingChallenges")}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">💻 {t("language")}</div>
                    <div>{t("pythonBasics")}</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">🎯 {t("challenges")}</div>
                    <div>{t("codeProblems")}</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">⭐ {t("points")}</div>
                    <div>{t("perCorrect")}</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">🏆 {t("xpReward")}</div>
                    <div>{t("upTo100XP")}</div>
                  </div>
                </div>
              </div>
              <Button onClick={startGame} size="lg" className="w-full">
                <Code className="w-5 h-5 mr-2" />
                {t("startCoding")}
              </Button>
            </CardContent>
          </Card>
        )}

        {gameActive && currentChallenge && (
          <div className="space-y-6">
            {/* Progress */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {t("challenge")} {challengeIndex + 1}/5
                  </span>
                  <span className="text-sm font-medium">
                    {score} {t("points")}
                  </span>
                </div>
                <Progress value={((challengeIndex + 1) / 5) * 100} />
              </CardContent>
            </Card>

            {/* Challenge */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-purple-500" />
                  {currentChallenge.title}
                </CardTitle>
                <p className="text-muted-foreground">{currentChallenge.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <pre>{currentChallenge.code}</pre>
                </div>

                {showFeedback && (
                  <div
                    className={`p-4 rounded-lg border ${
                      selectedAnswer === currentChallenge.correctAnswer
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle
                        className={`w-4 h-4 ${
                          selectedAnswer === currentChallenge.correctAnswer ? "text-green-600" : "text-red-600"
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          selectedAnswer === currentChallenge.correctAnswer ? "text-green-800" : "text-red-800"
                        }`}
                      >
                        {selectedAnswer === currentChallenge.correctAnswer ? t("correct") : t("incorrect")}
                      </span>
                    </div>
                    <p
                      className={selectedAnswer === currentChallenge.correctAnswer ? "text-green-700" : "text-red-700"}
                    >
                      {currentChallenge.explanation}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {currentChallenge.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={
                        showFeedback
                          ? option === currentChallenge.correctAnswer
                            ? "default"
                            : selectedAnswer === option
                              ? "destructive"
                              : "outline"
                          : "outline"
                      }
                      onClick={() => handleAnswer(option)}
                      disabled={showFeedback}
                      className="text-lg py-6"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
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
              <CardTitle className="text-2xl">🎉 {t("codingComplete")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{score}</div>
                  <div className="text-sm text-muted-foreground">{t("finalScore")}</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{score}</div>
                  <div className="text-sm text-muted-foreground">{t("xpEarned")}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={startGame} className="flex-1">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t("tryAgain")}
                </Button>
                <Link href="/games" className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    {t("backToGames")}
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
