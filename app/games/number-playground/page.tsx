"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Star, Zap, Calculator, Stars } from "lucide-react"
import Link from "next/link"

interface NumberChallenge {
  type: string
  number: number
  question: string
  answer: number
  hint: string
}

export default function NumberPlaygroundGame() {
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(120)
  const [gameActive, setGameActive] = useState(false)
  const [currentChallenge, setCurrentChallenge] = useState<NumberChallenge | null>(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [feedback, setFeedback] = useState("")
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [showHint, setShowHint] = useState(false)

  const generateChallenge = (): NumberChallenge => {
    const challengeTypes = ["palindrome", "kaprekar", "mental_math", "digit_sum", "reverse"]
    const type = challengeTypes[Math.floor(Math.random() * challengeTypes.length)]

    switch (type) {
      case "palindrome":
        const palindromes = [121, 131, 141, 151, 161, 171, 181, 191, 202, 212, 222, 232, 242, 252]
        const palindrome = palindromes[Math.floor(Math.random() * palindromes.length)]
        return {
          type: "palindrome",
          number: palindrome,
          question: `Is ${palindrome} a palindrome? (1 for Yes, 0 for No)`,
          answer: 1,
          hint: "A palindrome reads the same forwards and backwards!",
        }

      case "kaprekar":
        const num = Math.floor(Math.random() * 90) + 10
        const squared = num * num
        const str = squared.toString()
        const mid = Math.floor(str.length / 2)
        const left = Number.parseInt(str.substring(0, mid) || "0")
        const right = Number.parseInt(str.substring(mid))
        const sum = left + right
        return {
          type: "kaprekar",
          number: num,
          question: `${num}² = ${squared}. Split and add: ${left} + ${right} = ?`,
          answer: sum,
          hint: `Split ${squared} into ${left} and ${right}, then add them!`,
        }

      case "mental_math":
        const base = Math.floor(Math.random() * 20) + 10
        const trick = Math.floor(Math.random() * 3)
        if (trick === 0) {
          // Square numbers ending in 5
          const num5 = Math.floor(Math.random() * 9) * 10 + 5
          return {
            type: "mental_math",
            number: num5,
            question: `Quick! What is ${num5}²?`,
            answer: num5 * num5,
            hint: `For numbers ending in 5: multiply the first digit by (first digit + 1), then add 25!`,
          }
        } else if (trick === 1) {
          // Multiply by 11
          const num11 = Math.floor(Math.random() * 90) + 10
          return {
            type: "mental_math",
            number: num11,
            question: `Quick! What is ${num11} × 11?`,
            answer: num11 * 11,
            hint: `To multiply by 11: add the digits and put the sum in the middle!`,
          }
        } else {
          // Double and halve
          const a = Math.floor(Math.random() * 20) + 5
          const b = Math.floor(Math.random() * 10) * 2 + 2
          return {
            type: "mental_math",
            number: a,
            question: `Quick! What is ${a} × ${b}?`,
            answer: a * b,
            hint: `Try doubling one number and halving the other to make it easier!`,
          }
        }

      case "digit_sum":
        const bigNum = Math.floor(Math.random() * 9000) + 1000
        const digitSum = bigNum
          .toString()
          .split("")
          .reduce((sum, digit) => sum + Number.parseInt(digit), 0)
        return {
          type: "digit_sum",
          number: bigNum,
          question: `What is the sum of digits in ${bigNum}?`,
          answer: digitSum,
          hint: `Add each digit: ${bigNum.toString().split("").join(" + ")}`,
        }

      default: // reverse
        const original = Math.floor(Math.random() * 900) + 100
        const reversed = Number.parseInt(original.toString().split("").reverse().join(""))
        return {
          type: "reverse",
          number: original,
          question: `What is ${original} written backwards?`,
          answer: reversed,
          hint: `Reverse the digits: ${original.toString().split("").reverse().join("")}`,
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
    setShowHint(false)
  }

  const checkAnswer = () => {
    if (!currentChallenge || !userAnswer) return

    const answer = Number.parseInt(userAnswer)
    setTotalQuestions((prev) => prev + 1)

    if (answer === currentChallenge.answer) {
      const points = showHint ? 8 : 15 + streak * 2
      setScore((prev) => prev + points)
      setStreak((prev) => prev + 1)
      setCorrectAnswers((prev) => prev + 1)
      setFeedback(`Amazing! +${points} points`)

      setTimeout(() => {
        setCurrentChallenge(generateChallenge())
        setUserAnswer("")
        setFeedback("")
        setShowHint(false)
      }, 1500)
    } else {
      setStreak(0)
      setFeedback(`Not quite! The answer was ${currentChallenge.answer}`)

      setTimeout(() => {
        setCurrentChallenge(generateChallenge())
        setUserAnswer("")
        setFeedback("")
        setShowHint(false)
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
          <h1 className="text-4xl font-bold text-foreground mb-2">🎮 Number Playground</h1>
          <p className="text-muted-foreground">Discover amazing number tricks and mental math!</p>
        </div>

        {!gameActive ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Ready to Play with Numbers?</CardTitle>
              <CardDescription>Explore palindromes, Kaprekar numbers, and mental math tricks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm">Palindromes</h4>
                  <p className="text-xs text-muted-foreground">Numbers that read the same forwards and backwards</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm">Kaprekar Numbers</h4>
                  <p className="text-xs text-muted-foreground">Special numbers with magical properties</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm">Mental Math</h4>
                  <p className="text-xs text-muted-foreground">Quick calculation tricks and shortcuts</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm">Number Patterns</h4>
                  <p className="text-xs text-muted-foreground">Hidden patterns in everyday numbers</p>
                </div>
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
                <Calculator className="w-4 h-4 mr-2" />
                Start Number Adventure
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
                    {currentChallenge.type.replace("_", " ")}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6">
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

                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowHint(!showHint)}
                      className="flex items-center gap-2"
                    >
                      <Stars className="w-4 h-4" />
                      {showHint ? "Hide Hint" : "Show Hint"}
                    </Button>
                  </div>

                  {showHint && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center text-blue-800">
                      💡 {currentChallenge.hint}
                    </div>
                  )}

                  {feedback && (
                    <div
                      className={`text-center p-3 rounded-lg ${
                        feedback.includes("Amazing") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
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
