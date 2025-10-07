"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Trophy, Star, Zap } from "lucide-react"
import Link from "next/link"

interface Animal {
  id: string
  name: string
  emoji: string
  level: number
  description: string
}

const animals: Animal[] = [
  { id: "grass", name: "Grass", emoji: "🌱", level: 1, description: "Producer - Makes its own food" },
  { id: "rabbit", name: "Rabbit", emoji: "🐰", level: 2, description: "Primary Consumer - Eats plants" },
  { id: "snake", name: "Snake", emoji: "🐍", level: 3, description: "Secondary Consumer - Eats small animals" },
  { id: "hawk", name: "Hawk", emoji: "🦅", level: 4, description: "Tertiary Consumer - Top predator" },
]

const foodChains = [
  ["grass", "rabbit", "snake", "hawk"],
  ["grass", "rabbit", "hawk"],
  ["grass", "rabbit", "snake"],
]

export default function EcosystemExplorer() {
  const [currentChain, setCurrentChain] = useState<string[]>([])
  const [targetChain, setTargetChain] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameActive, setGameActive] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [streak, setStreak] = useState(0)
  const [draggedAnimal, setDraggedAnimal] = useState<string | null>(null)

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setGameActive(false)
      setFeedback("Time's up! Try again!")
    }
  }, [timeLeft, gameActive])

  const startGame = () => {
    setGameActive(true)
    setTimeLeft(60)
    setCurrentChain([])
    setTargetChain(foodChains[Math.floor(Math.random() * foodChains.length)])
    setFeedback("")
  }

  const handleDragStart = (animalId: string) => {
    setDraggedAnimal(animalId)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedAnimal && !currentChain.includes(draggedAnimal)) {
      const newChain = [...currentChain, draggedAnimal]
      setCurrentChain(newChain)

      if (newChain.length === targetChain.length) {
        checkChain(newChain)
      }
    }
    setDraggedAnimal(null)
  }

  const checkChain = (chain: string[]) => {
    const isCorrect = chain.every((animal, index) => animal === targetChain[index])

    if (isCorrect) {
      const basePoints = 5
      const timeBonus = timeLeft < 60 ? 10 : 0
      const streakBonus = streak * 2
      const totalPoints = basePoints + timeBonus + streakBonus

      setScore(score + totalPoints)
      setStreak(streak + 1)
      setFeedback(`Perfect! +${totalPoints} points! ${timeBonus > 0 ? "Speed bonus!" : ""}`)

      setTimeout(() => {
        setLevel(level + 1)
        setCurrentChain([])
        setTargetChain(foodChains[Math.floor(Math.random() * foodChains.length)])
        setTimeLeft(60)
        setFeedback("")
      }, 2000)
    } else {
      setStreak(0)
      setFeedback("Not quite right! Try again - think about who eats whom!")
      setCurrentChain([])
    }
  }

  const removeFromChain = (index: number) => {
    const newChain = currentChain.filter((_, i) => i !== index)
    setCurrentChain(newChain)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/games">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Games
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-lg px-3 py-1">
              <Trophy className="w-4 h-4 mr-1" />
              {score}
            </Badge>
            <Badge variant="outline" className="text-lg px-3 py-1">
              Level {level}
            </Badge>
            {streak > 0 && (
              <Badge className="bg-orange-500 text-white">
                <Zap className="w-4 h-4 mr-1" />
                {streak}x Streak
              </Badge>
            )}
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-green-700">🌿 Ecosystem Explorer 🦅</CardTitle>
            <p className="text-center text-gray-600">Build the food chain by dragging animals in the correct order!</p>
          </CardHeader>
          <CardContent>
            {!gameActive ? (
              <div className="text-center">
                <Button onClick={startGame} size="lg" className="bg-green-600 hover:bg-green-700">
                  Start Exploring
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold">Time: {timeLeft}s</div>
                  <Progress value={(timeLeft / 60) * 100} className="w-32" />
                </div>

                {feedback && (
                  <div
                    className={`text-center p-3 rounded-lg ${
                      feedback.includes("Perfect") ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {feedback}
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {animals.map((animal) => (
                    <Card
                      key={animal.id}
                      className={`cursor-grab active:cursor-grabbing transition-transform hover:scale-105 ${
                        currentChain.includes(animal.id) ? "opacity-50" : ""
                      }`}
                      draggable
                      onDragStart={() => handleDragStart(animal.id)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-4xl mb-2 animate-bounce">{animal.emoji}</div>
                        <div className="font-semibold">{animal.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{animal.description}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="border-2 border-dashed border-green-300 bg-green-50">
                  <CardContent className="p-6" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
                    <h3 className="text-lg font-semibold mb-4 text-center">Food Chain Builder</h3>
                    <div className="flex items-center justify-center gap-4 min-h-[100px]">
                      {currentChain.length === 0 ? (
                        <div className="text-gray-400 text-center">Drag animals here to build the food chain</div>
                      ) : (
                        currentChain.map((animalId, index) => {
                          const animal = animals.find((a) => a.id === animalId)
                          return (
                            <div key={index} className="flex items-center">
                              <Card className="cursor-pointer hover:bg-red-50" onClick={() => removeFromChain(index)}>
                                <CardContent className="p-3 text-center">
                                  <div className="text-3xl">{animal?.emoji}</div>
                                  <div className="text-sm font-medium">{animal?.name}</div>
                                </CardContent>
                              </Card>
                              {index < currentChain.length - 1 && <div className="mx-2 text-2xl">→</div>}
                            </div>
                          )
                        })
                      )}
                    </div>
                    <div className="text-center text-sm text-gray-500 mt-2">
                      Click on animals to remove them from the chain
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center text-sm text-gray-600">
                  <Star className="w-4 h-4 inline mr-1" />
                  Complete chains under 60 seconds for bonus points!
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
