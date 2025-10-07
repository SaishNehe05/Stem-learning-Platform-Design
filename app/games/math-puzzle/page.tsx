"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calculator, Star, Timer, Trophy, ArrowLeft, RotateCcw, Zap } from "lucide-react"
import Link from "next/link"
import { progressTracker } from "@/lib/progress-tracker"

interface MathProblem {
  question: string
  answer: number | string
  options: (number | string)[]
  type: string
}

export default function MathPuzzleGame() {
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(45)
  const [gameActive, setGameActive] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null)
  const [feedback, setFeedback] = useState<string>("")
  const [problemCount, setProblemCount] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [streak, setStreak] = useState(0)
  const [comboMultiplier, setComboMultiplier] = useState(1)

  const generateProblem = (): MathProblem => {
    const questionTypes = [
      "arithmetic",
      "patterns",
      "fractions",
      "prime",
      "angles",
      "perimeter",
      "integers",
      "symmetry",
      "data",
      "factors",
    ]

    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)]

    switch (type) {
      case "patterns":
        return generatePatternProblem()
      case "fractions":
        return generateFractionProblem()
      case "prime":
        return generatePrimeProblem()
      case "angles":
        return generateAngleProblem()
      case "perimeter":
        return generatePerimeterProblem()
      case "integers":
        return generateIntegerProblem()
      case "symmetry":
        return generateSymmetryProblem()
      case "data":
        return generateDataProblem()
      case "factors":
        return generateFactorProblem()
      default:
        return generateArithmeticProblem()
    }
  }

  const generateArithmeticProblem = (): MathProblem => {
    const operations = ["+", "-", "×", "÷"]
    let operation: string
    let num1: number, num2: number, answer: number, question: string

    switch (difficulty) {
      case "easy":
        operation = operations[Math.floor(Math.random() * 2)]
        break
      case "medium":
        operation = operations[Math.floor(Math.random() * operations.length)]
        break
      case "hard":
        const hardOps = ["+", "-", "×", "÷", "^", "√"]
        operation = hardOps[Math.floor(Math.random() * hardOps.length)]
        break
      default:
        operation = "+"
    }

    switch (operation) {
      case "+":
        if (difficulty === "easy") {
          num1 = Math.floor(Math.random() * 50) + 1
          num2 = Math.floor(Math.random() * 50) + 1
        } else if (difficulty === "medium") {
          num1 = Math.floor(Math.random() * 100) + 10
          num2 = Math.floor(Math.random() * 100) + 10
        } else {
          num1 = Math.floor(Math.random() * 500) + 50
          num2 = Math.floor(Math.random() * 500) + 50
        }
        answer = num1 + num2
        question = `${num1} + ${num2} = ?`
        break
      case "-":
        if (difficulty === "easy") {
          num1 = Math.floor(Math.random() * 50) + 20
          num2 = Math.floor(Math.random() * num1)
        } else if (difficulty === "medium") {
          num1 = Math.floor(Math.random() * 200) + 50
          num2 = Math.floor(Math.random() * num1)
        } else {
          num1 = Math.floor(Math.random() * 1000) + 100
          num2 = Math.floor(Math.random() * num1)
        }
        answer = num1 - num2
        question = `${num1} - ${num2} = ?`
        break
      case "×":
        if (difficulty === "easy") {
          num1 = Math.floor(Math.random() * 10) + 1
          num2 = Math.floor(Math.random() * 10) + 1
        } else if (difficulty === "medium") {
          num1 = Math.floor(Math.random() * 15) + 1
          num2 = Math.floor(Math.random() * 15) + 1
        } else {
          num1 = Math.floor(Math.random() * 25) + 1
          num2 = Math.floor(Math.random() * 25) + 1
        }
        answer = num1 * num2
        question = `${num1} × ${num2} = ?`
        break
      case "÷":
        if (difficulty === "easy") {
          num2 = Math.floor(Math.random() * 8) + 2
          answer = Math.floor(Math.random() * 10) + 1
        } else if (difficulty === "medium") {
          num2 = Math.floor(Math.random() * 12) + 2
          answer = Math.floor(Math.random() * 20) + 1
        } else {
          num2 = Math.floor(Math.random() * 20) + 2
          answer = Math.floor(Math.random() * 50) + 1
        }
        num1 = num2 * answer
        question = `${num1} ÷ ${num2} = ?`
        break
      case "^":
        num1 = Math.floor(Math.random() * 10) + 2
        num2 = 2
        answer = Math.pow(num1, num2)
        question = `${num1}² = ?`
        break
      case "√":
        answer = Math.floor(Math.random() * 15) + 1
        num1 = answer * answer
        question = `√${num1} = ?`
        break
      default:
        num1 = 5
        num2 = 3
        answer = 8
        question = "5 + 3 = ?"
    }

    const options = generateNumericOptions(answer)
    return { question, answer, options, type: "arithmetic" }
  }

  const generatePatternProblem = (): MathProblem => {
    const patternTypes = ["arithmetic", "geometric", "square", "triangular"]
    const type = patternTypes[Math.floor(Math.random() * patternTypes.length)]

    switch (type) {
      case "arithmetic":
        const diff = Math.floor(Math.random() * 5) + 2
        const start = Math.floor(Math.random() * 10) + 1
        const sequence = [start, start + diff, start + 2 * diff, start + 3 * diff]
        const answer = start + 4 * diff
        return {
          question: `Find the next number: ${sequence.join(", ")}, ?`,
          answer,
          options: generateNumericOptions(answer),
          type: "patterns",
        }
      case "square":
        const squares = [1, 4, 9, 16]
        return {
          question: `Square numbers: ${squares.join(", ")}, ?`,
          answer: 25,
          options: [25, 20, 24, 30],
          type: "patterns",
        }
      default:
        return generateArithmeticProblem()
    }
  }

  const generateFractionProblem = (): MathProblem => {
    const operations = ["add", "subtract", "compare", "equivalent"]
    const op = operations[Math.floor(Math.random() * operations.length)]

    switch (op) {
      case "add":
        const num1 = Math.floor(Math.random() * 5) + 1
        const num2 = Math.floor(Math.random() * 5) + 1
        const den = Math.floor(Math.random() * 8) + 4
        const answer = `${num1 + num2}/${den}`
        return {
          question: `${num1}/${den} + ${num2}/${den} = ?`,
          answer,
          options: [
            `${num1 + num2}/${den}`,
            `${num1 + num2}/${den * 2}`,
            `${num1 * num2}/${den}`,
            `${num1 + num2 + 1}/${den}`,
          ],
          type: "fractions",
        }
      case "equivalent":
        const base = Math.floor(Math.random() * 4) + 2
        const mult = Math.floor(Math.random() * 3) + 2
        return {
          question: `Which fraction is equivalent to ${base}/8?`,
          answer: `${base * mult}/${8 * mult}`,
          options: [
            `${base * mult}/${8 * mult}`,
            `${base + mult}/${8 + mult}`,
            `${base}/${8 + mult}`,
            `${base * 2}/${8}`,
          ],
          type: "fractions",
        }
      default:
        return generateArithmeticProblem()
    }
  }

  const generatePrimeProblem = (): MathProblem => {
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]
    const composites = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 30]

    if (Math.random() < 0.5) {
      const prime = primes[Math.floor(Math.random() * primes.length)]
      return {
        question: `Is ${prime} a prime number?`,
        answer: "Yes",
        options: ["Yes", "No", "Maybe", "Cannot determine"],
        type: "prime",
      }
    } else {
      const composite = composites[Math.floor(Math.random() * composites.length)]
      return {
        question: `Is ${composite} a prime number?`,
        answer: "No",
        options: ["Yes", "No", "Maybe", "Cannot determine"],
        type: "prime",
      }
    }
  }

  const generateAngleProblem = (): MathProblem => {
    const angleTypes = ["acute", "obtuse", "right", "straight"]
    const angles = {
      acute: [30, 45, 60, 75],
      obtuse: [120, 135, 150],
      right: [90],
      straight: [180],
    }

    const type = angleTypes[Math.floor(Math.random() * angleTypes.length)]
    const angle = angles[type][Math.floor(Math.random() * angles[type].length)]

    return {
      question: `What type of angle is ${angle}°?`,
      answer: type,
      options: ["acute", "obtuse", "right", "straight"],
      type: "angles",
    }
  }

  const generatePerimeterProblem = (): MathProblem => {
    if (Math.random() < 0.5) {
      // Rectangle
      const length = Math.floor(Math.random() * 10) + 5
      const width = Math.floor(Math.random() * 8) + 3
      const answer = 2 * (length + width)
      return {
        question: `Perimeter of rectangle: length=${length}cm, width=${width}cm`,
        answer,
        options: generateNumericOptions(answer),
        type: "perimeter",
      }
    } else {
      // Square
      const side = Math.floor(Math.random() * 12) + 4
      const answer = 4 * side
      return {
        question: `Perimeter of square with side ${side}cm = ?`,
        answer,
        options: generateNumericOptions(answer),
        type: "perimeter",
      }
    }
  }

  const generateIntegerProblem = (): MathProblem => {
    const num1 = Math.floor(Math.random() * 20) - 10
    const num2 = Math.floor(Math.random() * 20) - 10

    if (Math.random() < 0.5) {
      const answer = num1 + num2
      return {
        question: `${num1} + (${num2}) = ?`,
        answer,
        options: generateNumericOptions(answer),
        type: "integers",
      }
    } else {
      const answer = num1 - num2
      return {
        question: `${num1} - (${num2}) = ?`,
        answer,
        options: generateNumericOptions(answer),
        type: "integers",
      }
    }
  }

  const generateSymmetryProblem = (): MathProblem => {
    const shapes = [
      { name: "Circle", lines: "Infinite" },
      { name: "Square", lines: "4" },
      { name: "Rectangle", lines: "2" },
      { name: "Triangle (equilateral)", lines: "3" },
      { name: "Triangle (isosceles)", lines: "1" },
    ]

    const shape = shapes[Math.floor(Math.random() * shapes.length)]
    return {
      question: `How many lines of symmetry does a ${shape.name} have?`,
      answer: shape.lines,
      options: ["1", "2", "3", "4", "Infinite"].filter((opt) => Math.random() < 0.8 || opt === shape.lines).slice(0, 4),
      type: "symmetry",
    }
  }

  const generateDataProblem = (): MathProblem => {
    const data = [12, 15, 8, 20, 10, 18, 14]
    const operations = ["mean", "median", "mode", "range"]
    const op = operations[Math.floor(Math.random() * operations.length)]

    switch (op) {
      case "mean":
        const sum = data.reduce((a, b) => a + b, 0)
        const mean = Math.round(sum / data.length)
        return {
          question: `Find the mean of: ${data.join(", ")}`,
          answer: mean,
          options: generateNumericOptions(mean),
          type: "data",
        }
      case "range":
        const range = Math.max(...data) - Math.min(...data)
        return {
          question: `Find the range of: ${data.join(", ")}`,
          answer: range,
          options: generateNumericOptions(range),
          type: "data",
        }
      default:
        return generateArithmeticProblem()
    }
  }

  const generateFactorProblem = (): MathProblem => {
    const numbers = [12, 15, 18, 20, 24, 30, 36]
    const num = numbers[Math.floor(Math.random() * numbers.length)]

    const factors = []
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) factors.push(i)
    }

    return {
      question: `How many factors does ${num} have?`,
      answer: factors.length,
      options: generateNumericOptions(factors.length),
      type: "factors",
    }
  }

  const generateNumericOptions = (answer: number): number[] => {
    const options = [answer]
    const variance = difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 20

    while (options.length < 4) {
      let wrongAnswer: number
      if (Math.random() < 0.5) {
        wrongAnswer = answer + (Math.floor(Math.random() * 6) - 3)
      } else {
        wrongAnswer = answer + Math.floor(Math.random() * variance * 2) - variance
      }

      if (wrongAnswer !== answer && wrongAnswer > -100 && !options.includes(wrongAnswer)) {
        options.push(wrongAnswer)
      }
    }

    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[options[i], options[j]] = [options[j], options[i]]
    }

    return options
  }

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setTimeLeft(45)
    setProblemCount(0)
    setGameComplete(false)
    setStreak(0)
    setComboMultiplier(1)
    setCurrentProblem(generateProblem())
  }

  const handleAnswer = (selectedOption: number | string) => {
    if (!currentProblem || !gameActive) return

    setSelectedAnswer(selectedOption)

    if (selectedOption === currentProblem.answer) {
      const basePoints = difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 15
      const streakBonus = Math.min(streak * 2, 20)
      const totalPoints = (basePoints + streakBonus) * comboMultiplier

      setScore((prev) => prev + totalPoints)
      setStreak((prev) => prev + 1)

      if (streak > 0 && (streak + 1) % 3 === 0) {
        setComboMultiplier((prev) => Math.min(prev + 0.5, 3))
      }

      setFeedback(`🎉 Correct! +${totalPoints} points ${streak >= 2 ? `(${streak + 1}x streak!)` : ""}`)
    } else {
      setStreak(0)
      setComboMultiplier(1)
      setFeedback(`❌ Wrong! The answer was ${currentProblem.answer}`)
    }

    setTimeout(() => {
      if (problemCount >= 14) {
        endGame()
      } else {
        setProblemCount((prev) => prev + 1)
        setCurrentProblem(generateProblem())
        setSelectedAnswer(null)
        setFeedback("")
      }
    }, 1500)
  }

  const endGame = () => {
    setGameActive(false)
    setGameComplete(true)

    const xpGained = score * 2
    progressTracker.recordQuizCompletion({
      quizId: "math-puzzle",
      subject: "math",
      score: (score / 225) * 100,
      totalQuestions: 15,
      correctAnswers: score / 10,
      timeSpent: 45 - timeLeft,
      difficulty: difficulty,
      timestamp: new Date().toISOString(),
      answers: [],
    })
  }

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameActive) {
      endGame()
    }
  }, [gameActive, timeLeft])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/games" className="flex items-center gap-3">
              <ArrowLeft className="w-5 h-5" />
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-foreground">Number Ninja</span>
                <p className="text-sm text-muted-foreground">Multi-Topic Math Challenge</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              {gameActive && (
                <>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {score} points
                  </Badge>
                  {streak > 0 && (
                    <Badge variant="default" className="bg-orange-500">
                      🔥 {streak}x streak
                    </Badge>
                  )}
                  {comboMultiplier > 1 && (
                    <Badge variant="default" className="bg-purple-500">
                      <Zap className="w-3 h-3 mr-1" />
                      {comboMultiplier}x combo
                    </Badge>
                  )}
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    {timeLeft}s
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {!gameActive && !gameComplete && (
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Calculator className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">🧮 Number Ninja - Multi-Topic Challenge</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <p className="text-muted-foreground font-medium">Choose Your Challenge Level:</p>
                <div className="flex gap-2 justify-center">
                  {(["easy", "medium", "hard"] as const).map((level) => (
                    <Button
                      key={level}
                      variant={difficulty === level ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDifficulty(level)}
                      className="capitalize"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="text-muted-foreground">
                <p className="mb-4">Solve 15 problems covering patterns, fractions, prime numbers, angles, and more!</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">📚 Topics</div>
                    <div>10 different types</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">⏱️ Time Limit</div>
                    <div>45 seconds</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">🎯 Goal</div>
                    <div>15 problems</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">🔥 Combo System</div>
                    <div>3x streak = multiplier</div>
                  </div>
                </div>
              </div>
              <Button onClick={startGame} size="lg" className="w-full">
                <Calculator className="w-5 h-5 mr-2" />
                Start Challenge ({difficulty})
              </Button>
            </CardContent>
          </Card>
        )}

        {gameActive && currentProblem && (
          <div className="space-y-6">
            {/* Progress */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Problem {problemCount + 1}/15</span>
                  <span className="text-sm font-medium">{score} points</span>
                </div>
                <Progress value={(problemCount / 15) * 100} />
              </CardContent>
            </Card>

            {/* Question */}
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-foreground mb-6">{currentProblem.question}</div>
                {feedback && <div className="text-lg font-medium mb-4 text-primary">{feedback}</div>}
                <div className="grid grid-cols-2 gap-4">
                  {currentProblem.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={
                        selectedAnswer === option
                          ? option === currentProblem.answer
                            ? "default"
                            : "destructive"
                          : "outline"
                      }
                      size="lg"
                      onClick={() => handleAnswer(option)}
                      disabled={selectedAnswer !== null}
                      className="text-xl py-6"
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
              <CardTitle className="text-2xl">🎉 Challenge Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{score}</div>
                  <div className="text-sm text-muted-foreground">Final Score</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{score * 2}</div>
                  <div className="text-sm text-muted-foreground">XP Earned</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {score >= 150 && <Badge className="bg-gold">🏆 Math Master</Badge>}
                {streak >= 5 && <Badge className="bg-orange-500">🔥 Streak Legend</Badge>}
                {comboMultiplier >= 2 && <Badge className="bg-purple-500">⚡ Combo King</Badge>}
                {difficulty === "hard" && score >= 100 && <Badge className="bg-red-500">💀 Nightmare Mode</Badge>}
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
