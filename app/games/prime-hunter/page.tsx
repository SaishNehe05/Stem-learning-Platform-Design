"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Star, Zap, Target } from "lucide-react"
import Link from "next/link"

interface PrimeChallenge {
  type: string
  number: number
  question: string
  answer: number | boolean
  options?: (number | string)[]
}

export default function PrimeHunterGame() {
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(90)
  const [gameActive, setGameActive] = useState(false)
  const [currentChallenge, setCurrentChallenge] = useState<PrimeChallenge | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [feedback, setFeedback] = useState("")
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)

  const isPrime = (n: number): boolean => {
    if (n < 2) return false
    if (n === 2) return true
    if (n % 2 === 0) return false
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
      if (n % i === 0) return false
    }
    return true
  }

  const getFactors = (n: number): number[] => {
    const factors = []
    for (let i = 1; i <= n; i++) {
      if (n % i === 0) factors.push(i)
    }
    return factors
  }

  const generateChallenge = (): PrimeChallenge => {
    const challengeTypes = ["identify_prime", "find_factors", "divisibility", "next_prime", "prime_factorization"]
    const type = challengeTypes[Math.floor(Math.random() * challengeTypes.length)]

    switch (type) {
      case "identify_prime":
        const num = Math.floor(Math.random() * 50) + 2
        return {
          type: "identify_prime",
          number: num,
          question: `Is ${num} a prime number?`,
          answer: isPrime(num),
          options: ["Yes", "No"],
        }

      case "find_factors":
        const factorNum = Math.floor(Math.random() * 30) + 6
        const factors = getFactors(factorNum)
        return {
          type: "find_factors",
          number: factorNum,
          question: `How many factors does ${factorNum} have?`,
          answer: factors.length,
        }

      case "divisibility":
        const divNum = Math.floor(Math.random() * 50) + 10
        const divisors = [2, 3, 5, 7, 11]
        const divisor = divisors[Math.floor(Math.random() * divisors.length)]
        return {
          type: "divisibility",
          number: divNum,
          question: `Is ${divNum} divisible by ${divisor}?`,
          answer: divNum % divisor === 0,
          options: ["Yes", "No"],
        }

      case "next_prime":
        const baseNum = Math.floor(Math.random() * 30) + 10
        let nextPrime = baseNum + 1
        while (!isPrime(nextPrime)) {
          nextPrime++
        }
        return {
          type: "next_prime",
          number: baseNum,
          question: `What is the next prime number after ${baseNum}?`,
          answer: nextPrime,
        }

      default: // prime_factorization
        const primeFactorNum = [12, 15, 18, 20, 24, 28, 30, 36, 40, 42][Math.floor(Math.random() * 10)]
        const primeFactors = []
        let temp = primeFactorNum
        for (let i = 2; i <= temp; i++) {
          while (temp % i === 0) {
            primeFactors.push(i)
            temp = temp / i
          }
        }
        const smallestPrimeFactor = primeFactors[0]
        return {
          type: "prime_factorization",
          number: primeFactorNum,
          question: `What is the smallest prime factor of ${primeFactorNum}?`,
          answer: smallestPrimeFactor,
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
    setCurrentChallenge(generateChallenge())
    setSelectedAnswer(null)
    setUserAnswer("")
    setFeedback("")
  }

  const checkAnswer = (answer?: any) => {
    if (!currentChallenge) return

    const finalAnswer = answer !== undefined ? answer : userAnswer ? Number.parseInt(userAnswer) : selectedAnswer
    setTotalQuestions((prev) => prev + 1)

    let isCorrect = false
    if (typeof currentChallenge.answer === "boolean") {
      isCorrect = (finalAnswer === "Yes") === currentChallenge.answer
    } else {
      isCorrect = finalAnswer === currentChallenge.answer
    }

    if (isCorrect) {
      const points = 10 + streak * 3
      setScore((prev) => prev + points)
      setStreak((prev) => prev + 1)
      setCorrectAnswers((prev) => prev + 1)
      setFeedback(`Excellent hunting! +${points} points`)
    } else {
      setStreak(0)
      setFeedback(`Missed! The answer was ${currentChallenge.answer}`)
    }

    setTimeout(() => {
      setCurrentChallenge(generateChallenge())
      setSelectedAnswer(null)
      setUserAnswer("")
      setFeedback("")
    }, 2000)
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
          <h1 className="text-4xl font-bold text-foreground mb-2">🎯 Prime Number Hunter</h1>
          <p className="text-muted-foreground">Hunt for prime numbers and explore their secrets!</p>
        </div>

        {!gameActive ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Ready to Hunt Primes?</CardTitle>
              <CardDescription>Discover prime numbers, factors, and divisibility rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm">Prime Numbers</h4>
                  <p className="text-xs text-muted-foreground">Numbers with exactly 2 factors: 1 and itself</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm">Factors</h4>
                  <p className="text-xs text-muted-foreground">Numbers that divide evenly into another</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm">Divisibility</h4>
                  <p className="text-xs text-muted-foreground">Rules to check if numbers divide evenly</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm">Prime Factorization</h4>
                  <p className="text-xs text-muted-foreground">Breaking numbers into prime factors</p>
                </div>
              </div>

              {score > 0 && (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Last Hunt Results</h3>
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
                      <p className="text-muted-foreground">Primes Found</p>
                    </div>
                  </div>
                </div>
              )}

              <Button onClick={startGame} className="w-full" size="lg">
                <Target className="w-4 h-4 mr-2" />
                Start Prime Hunt
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

            {currentChallenge && (
              <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{currentChallenge.question}</CardTitle>
                  <Badge variant="outline" className="capitalize">
                    {currentChallenge.type.replace("_", " ")}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                  {currentChallenge.options ? (
                    <div className="grid grid-cols-2 gap-3">
                      {currentChallenge.options.map((option, index) => (
                        <Button
                          key={index}
                          variant={selectedAnswer === option ? "default" : "outline"}
                          onClick={() => {
                            setSelectedAnswer(option)
                            checkAnswer(option)
                          }}
                          disabled={selectedAnswer !== null}
                          className="h-12"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex gap-2 max-w-xs mx-auto">
                      <input
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Your answer"
                        className="flex-1 px-3 py-2 border border-border rounded-md text-center text-lg font-semibold"
                        onKeyPress={(e) => e.key === "Enter" && checkAnswer()}
                      />
                      <Button onClick={() => checkAnswer()} disabled={!userAnswer}>
                        Hunt
                      </Button>
                    </div>
                  )}

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
