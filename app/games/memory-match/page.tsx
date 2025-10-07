"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  PuzzleIcon as Puzzle,
  StarIcon as Star,
  TimerIcon as Timer,
  TrophyIcon as Trophy,
  ArrowLeftIcon as ArrowLeft,
  RotateCcwIcon as RotateCcw,
} from "@/lib/icons"
import Link from "next/link"
import { progressTracker } from "@/lib/progress-tracker"
import { useTranslation } from "@/lib/i18n"

interface MemoryCard {
  id: number
  content: string
  isFlipped: boolean
  isMatched: boolean
}

export default function MemoryMatchGame() {
  const { t } = useTranslation()

  const [cards, setCards] = useState<MemoryCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matches, setMatches] = useState(0)
  const [moves, setMoves] = useState(0)
  const [timeLeft, setTimeLeft] = useState(120)
  const [gameActive, setGameActive] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)

  // Science terms for memory matching
  const scienceTerms = [
    "🧬 DNA",
    "🔬 Microscope",
    "⚛️ Atom",
    "🌍 Earth",
    "🌙 Moon",
    "⭐ Star",
    "🌊 Wave",
    "🔥 Energy",
    "💧 Water",
    "🌱 Plant",
    "🦠 Cell",
    "🧲 Magnet",
  ]

  // Initialize game
  const initializeGame = () => {
    const selectedTerms = scienceTerms.slice(0, 8) // Use 8 pairs
    const gameCards = [...selectedTerms, ...selectedTerms]
      .map((content, index) => ({
        id: index,
        content,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5) // Shuffle

    setCards(gameCards)
    setFlippedCards([])
    setMatches(0)
    setMoves(0)
    setTimeLeft(120)
    setGameActive(true)
    setGameComplete(false)
  }

  // Handle card click
  const handleCardClick = (cardId: number) => {
    if (!gameActive || flippedCards.length >= 2) return

    const card = cards.find((c) => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    // Flip the card
    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)))

    // Check for match when 2 cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1)

      const [firstId, secondId] = newFlippedCards
      const firstCard = cards.find((c) => c.id === firstId)
      const secondCard = cards.find((c) => c.id === secondId)

      if (firstCard && secondCard && firstCard.content === secondCard.content) {
        // Match found
        setTimeout(() => {
          setCards((prev) => prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c)))
          setMatches((prev) => prev + 1)
          setFlippedCards([])
        }, 1000)
      } else {
        // No match - flip back
        setTimeout(() => {
          setCards((prev) => prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c)))
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  // End game
  const endGame = (won: boolean) => {
    setGameActive(false)
    setGameComplete(true)

    if (won) {
      const score = Math.max(0, 100 - moves * 2) // Better score for fewer moves
      const xpGained = score + (timeLeft > 60 ? 50 : 25) // Bonus for time remaining

      progressTracker.recordQuizCompletion({
        quizId: "memory-match",
        subject: "science",
        score: score,
        totalQuestions: 8,
        correctAnswers: matches,
        timeSpent: 120 - timeLeft,
        difficulty: "easy",
        timestamp: new Date().toISOString(),
        answers: [],
      })
    }
  }

  // Check win condition
  useEffect(() => {
    if (matches === 8 && gameActive) {
      endGame(true)
    }
  }, [matches, gameActive])

  // Timer effect
  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameActive) {
      endGame(false)
    }
  }, [gameActive, timeLeft])

  const score = Math.max(0, 100 - moves * 2)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/games" className="flex items-center gap-3">
              <ArrowLeft className="w-5 h-5" />
              <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-white">
                <Puzzle className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-foreground">{t("memoryMaster")}</span>
                <p className="text-sm text-muted-foreground">{t("scienceMemoryGame")}</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              {gameActive && (
                <>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {matches}/8 {t("matches")}
                  </Badge>
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {!gameActive && !gameComplete && (
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Puzzle className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">🧩 {t("memoryMaster")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-muted-foreground">
                <p className="mb-4">{t("scienceMemoryGame")}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">⏱️ {t("timeLimit")}</div>
                    <div>2 {t("minutes")}</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">🎯 {t("goal")}</div>
                    <div>{t("memoryMatchPairs")}</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">🧠 {t("challenge")}</div>
                    <div>{t("fewerMovesHigherScore")}</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">🏆 {t("xpReward")}</div>
                    <div>{t("upTo150XP")}</div>
                  </div>
                </div>
              </div>
              <Button onClick={initializeGame} size="lg" className="w-full">
                <Puzzle className="w-5 h-5 mr-2" />
                {t("startGame")}
              </Button>
            </CardContent>
          </Card>
        )}

        {gameActive && (
          <div className="space-y-6">
            {/* Progress */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {t("matches")}: {matches}/8
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t("totalMoves")}: {moves}
                  </span>
                  <span className="text-sm font-medium">
                    {t("score")}: {score}
                  </span>
                </div>
                <Progress value={(matches / 8) * 100} />
              </CardContent>
            </Card>

            {/* Game Board */}
            <div className="grid grid-cols-4 gap-4">
              {cards.map((card) => (
                <Card
                  key={card.id}
                  className={`aspect-square cursor-pointer transition-all hover:shadow-lg ${
                    card.isMatched
                      ? "bg-green-100 border-green-300"
                      : card.isFlipped
                        ? "bg-blue-100 border-blue-300"
                        : "hover:bg-muted"
                  }`}
                  onClick={() => handleCardClick(card.id)}
                >
                  <CardContent className="p-0 h-full flex items-center justify-center">
                    <div className="text-2xl font-bold">{card.isFlipped || card.isMatched ? card.content : "❓"}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {gameComplete && (
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Trophy className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">
                {matches === 8 ? `🎉 ${t("congratulations")}` : `⏰ ${t("timesUp")}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{matches}</div>
                  <div className="text-sm text-muted-foreground">{t("matchesFound")}</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{moves}</div>
                  <div className="text-sm text-muted-foreground">{t("totalMoves")}</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {matches === 8 ? score + (timeLeft > 60 ? 50 : 25) : 0}
                  </div>
                  <div className="text-sm text-muted-foreground">{t("xpEarned")}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={initializeGame} className="flex-1">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t("playAgain")}
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
