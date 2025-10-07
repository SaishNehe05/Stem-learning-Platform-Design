"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Clock, Star, CheckCircle, XCircle, Trophy } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { progressTracker, type QuizResult } from "@/lib/progress-tracker"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "easy" | "medium" | "hard"
  points: number
}

interface QuizData {
  [key: string]: {
    name: string
    questions: Question[]
  }
}

const quizData: QuizData = {
  math: {
    name: "Mathematics",
    questions: [
      {
        id: 1,
        question: "What is the value of x in the equation 2x + 5 = 13?",
        options: ["x = 3", "x = 4", "x = 5", "x = 6"],
        correctAnswer: 1,
        explanation: "Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4",
        difficulty: "easy",
        points: 10,
      },
      {
        id: 2,
        question: "What is the area of a circle with radius 5 units?",
        options: ["25π square units", "10π square units", "15π square units", "20π square units"],
        correctAnswer: 0,
        explanation: "Area = πr² = π × 5² = 25π square units",
        difficulty: "medium",
        points: 15,
      },
      {
        id: 3,
        question: "If a triangle has angles of 60°, 60°, and 60°, what type of triangle is it?",
        options: ["Scalene", "Isosceles", "Equilateral", "Right"],
        correctAnswer: 2,
        explanation: "A triangle with all angles equal (60°) is an equilateral triangle",
        difficulty: "easy",
        points: 10,
      },
    ],
  },
  science: {
    name: "Science",
    questions: [
      {
        id: 1,
        question: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "NaCl", "O2"],
        correctAnswer: 0,
        explanation: "Water consists of 2 hydrogen atoms and 1 oxygen atom: H2O",
        difficulty: "easy",
        points: 10,
      },
      {
        id: 2,
        question: "Which planet is closest to the Sun?",
        options: ["Venus", "Earth", "Mercury", "Mars"],
        correctAnswer: 2,
        explanation: "Mercury is the innermost planet in our solar system",
        difficulty: "easy",
        points: 10,
      },
      {
        id: 3,
        question: "What force keeps planets in orbit around the Sun?",
        options: ["Magnetic force", "Gravitational force", "Electric force", "Nuclear force"],
        correctAnswer: 1,
        explanation: "Gravitational force between the Sun and planets keeps them in orbit",
        difficulty: "medium",
        points: 15,
      },
    ],
  },
  technology: {
    name: "Technology",
    questions: [
      {
        id: 1,
        question: "What does CPU stand for?",
        options: [
          "Computer Processing Unit",
          "Central Processing Unit",
          "Core Processing Unit",
          "Central Program Unit",
        ],
        correctAnswer: 1,
        explanation: "CPU stands for Central Processing Unit, the brain of the computer",
        difficulty: "easy",
        points: 10,
      },
      {
        id: 2,
        question: "Which programming language is known for web development?",
        options: ["Python", "JavaScript", "C++", "Java"],
        correctAnswer: 1,
        explanation: "JavaScript is primarily used for web development and runs in browsers",
        difficulty: "medium",
        points: 15,
      },
    ],
  },
  engineering: {
    name: "Engineering",
    questions: [
      {
        id: 1,
        question: "What is the first step in the engineering design process?",
        options: ["Build a prototype", "Test the solution", "Define the problem", "Brainstorm solutions"],
        correctAnswer: 2,
        explanation: "The first step is always to clearly define and understand the problem",
        difficulty: "easy",
        points: 10,
      },
      {
        id: 2,
        question: "Which type of bridge is strongest for spanning long distances?",
        options: ["Beam bridge", "Arch bridge", "Suspension bridge", "Truss bridge"],
        correctAnswer: 2,
        explanation: "Suspension bridges can span the longest distances due to their cable design",
        difficulty: "medium",
        points: 15,
      },
    ],
  },
}

export default function QuizPage() {
  const params = useParams()
  const subject = params.subject as string
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [answers, setAnswers] = useState<number[]>([])
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())
  const [questionTimes, setQuestionTimes] = useState<number[]>([])
  const [xpGained, setXpGained] = useState<number>(0)

  const quiz = quizData[subject]
  const questions = quiz?.questions || []
  const currentQ = questions[currentQuestion]

  useEffect(() => {
    setStartTime(Date.now())
    setQuestionStartTime(Date.now())
  }, [])

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleQuizComplete()
    }
  }, [timeLeft, quizCompleted])

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value)
  }

  const handleNextQuestion = () => {
    const answerIndex = Number.parseInt(selectedAnswer)
    const newAnswers = [...answers, answerIndex]
    setAnswers(newAnswers)

    // Record time spent on this question
    const questionTime = Date.now() - questionStartTime
    const newQuestionTimes = [...questionTimes, questionTime]
    setQuestionTimes(newQuestionTimes)

    if (answerIndex === currentQ.correctAnswer) {
      setScore(score + currentQ.points)
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer("")
      setQuestionStartTime(Date.now())
    } else {
      handleQuizComplete()
    }
  }

  const handleQuizComplete = () => {
    setQuizCompleted(true)
    setShowResult(true)

    const totalTime = Date.now() - startTime
    const correctAnswers = answers.filter((answer, index) => answer === questions[index].correctAnswer).length
    const finalScore = Math.round((correctAnswers / questions.length) * 100)

    const quizResult: QuizResult = {
      quizId: `${subject}-quiz-${Date.now()}`,
      subject: subject,
      score: finalScore,
      totalQuestions: questions.length,
      correctAnswers: correctAnswers,
      timeSpent: Math.round(totalTime / 1000), // Convert to seconds
      difficulty: "medium", // Could be calculated based on question mix
      timestamp: new Date().toISOString(),
      answers: answers.map((answer, index) => ({
        questionId: questions[index].id,
        selectedAnswer: answer,
        correctAnswer: questions[index].correctAnswer,
        isCorrect: answer === questions[index].correctAnswer,
        timeSpent: Math.round((questionTimes[index] || 0) / 1000),
      })),
    }

    const scoreUpdate = progressTracker.recordScoreUpdate(quizResult)

    setXpGained(scoreUpdate.xpGained)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getScoreMessage = () => {
    const percentage = (score / (questions.length * 15)) * 100
    if (percentage >= 80) return { message: "Excellent work!", icon: "🏆", color: "text-green-600" }
    if (percentage >= 60) return { message: "Good job!", icon: "⭐", color: "text-blue-600" }
    if (percentage >= 40) return { message: "Keep practicing!", icon: "💪", color: "text-orange-600" }
    return { message: "Try again!", icon: "📚", color: "text-red-600" }
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Subject not found</p>
            <Link href="/student">
              <Button className="w-full mt-4">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showResult) {
    const scoreMsg = getScoreMessage()
    const correctCount = answers.filter((answer, index) => answer === questions[index].correctAnswer).length

    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card p-4">
          <div className="container mx-auto">
            <Link href="/student" className="flex items-center gap-2 text-foreground hover:text-secondary">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">{scoreMsg.icon}</div>
              <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
              <CardDescription className={scoreMsg.color}>{scoreMsg.message}</CardDescription>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Trophy className="w-5 h-5 text-secondary" />
                <span className="text-lg font-semibold text-secondary">+{xpGained} XP gained!</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-foreground mb-2">
                  {Math.round((correctCount / questions.length) * 100)}%
                </div>
                <p className="text-muted-foreground">Final Score</p>
                <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">+{xpGained} XP</div>
                  <p className="text-sm text-muted-foreground">Experience Points Earned</p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Base: {correctCount * 10} • Accuracy: {Math.round((correctCount / questions.length) * 30)} • Speed
                    Bonus: {timeLeft > 240 ? 20 : timeLeft > 120 ? 10 : 0}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{correctCount}</div>
                  <p className="text-sm text-muted-foreground">Correct</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{questions.length}</div>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>

              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div key={question.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    {answers[index] === question.correctAnswer ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Question {index + 1}</p>
                      <p className="text-xs text-muted-foreground">{question.explanation}</p>
                    </div>
                    <Badge variant={answers[index] === question.correctAnswer ? "default" : "destructive"}>
                      {question.points} XP
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Link href="/student" className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  className="flex-1"
                  onClick={() => {
                    setCurrentQuestion(0)
                    setSelectedAnswer("")
                    setShowResult(false)
                    setScore(0)
                    setTimeLeft(300)
                    setQuizCompleted(false)
                    setAnswers([])
                    setStartTime(Date.now())
                    setQuestionStartTime(Date.now())
                    setQuestionTimes([])
                    setXpGained(0)
                  }}
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/student" className="flex items-center gap-2 text-foreground hover:text-secondary">
              <ArrowLeft className="w-4 h-4" />
              {quiz.name} Quiz
            </Link>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(timeLeft)}
              </Badge>
              <Badge variant="secondary">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          <Progress value={((currentQuestion + 1) / questions.length) * 100} />
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge
                variant={
                  currentQ.difficulty === "easy"
                    ? "default"
                    : currentQ.difficulty === "medium"
                      ? "secondary"
                      : "destructive"
                }
              >
                {currentQ.difficulty}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                {currentQ.points} XP
              </Badge>
            </div>
            <CardTitle className="text-xl text-balance">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
              {currentQ.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <Button onClick={handleNextQuestion} disabled={!selectedAnswer} className="w-full" size="lg">
              {currentQuestion < questions.length - 1 ? "Next Question" : "Complete Quiz"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
