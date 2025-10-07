"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Atom, Star, Trophy, ArrowLeft, RotateCcw, Beaker, Zap } from "lucide-react"
import Link from "next/link"
import { progressTracker } from "@/lib/progress-tracker"

interface LabItem {
  id: string
  name: string
  icon: string
  placed: boolean
}

interface Experiment {
  id: string
  name: string
  description: string
  items: LabItem[]
  targetOrder: string[]
  result: string
  xp: number
}

export default function ScienceLabGame() {
  const [currentExperiment, setCurrentExperiment] = useState<Experiment | null>(null)
  const [score, setScore] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [experimentsCompleted, setExperimentsCompleted] = useState(0)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [placedItems, setPlacedItems] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)

  const experiments: Experiment[] = [
    {
      id: "circuit",
      name: "Electric Circuit Builder",
      description: "Connect components to light up the bulb",
      items: [
        { id: "battery", name: "Battery", icon: "🔋", placed: false },
        { id: "wire1", name: "Wire", icon: "🔌", placed: false },
        { id: "bulb", name: "Light Bulb", icon: "💡", placed: false },
        { id: "wire2", name: "Wire", icon: "🔌", placed: false },
      ],
      targetOrder: ["battery", "wire1", "bulb", "wire2"],
      result: "Success! The circuit is complete and the bulb lights up! ✨",
      xp: 30,
    },
    {
      id: "density",
      name: "Density Tower",
      description: "Layer liquids by density from heaviest to lightest",
      items: [
        { id: "honey", name: "Honey", icon: "🍯", placed: false },
        { id: "syrup", name: "Corn Syrup", icon: "🥤", placed: false },
        { id: "water", name: "Colored Water", icon: "💧", placed: false },
        { id: "oil", name: "Vegetable Oil", icon: "🫒", placed: false },
      ],
      targetOrder: ["honey", "syrup", "water", "oil"],
      result: "Perfect density tower! Liquids separate by their density. 🌈",
      xp: 25,
    },
    {
      id: "volcano",
      name: "Volcano Eruption",
      description: "Add ingredients in the right order for eruption",
      items: [
        { id: "volcano", name: "Volcano Base", icon: "🌋", placed: false },
        { id: "baking-soda", name: "Baking Soda", icon: "🧂", placed: false },
        { id: "coloring", name: "Red Coloring", icon: "🔴", placed: false },
        { id: "vinegar", name: "Vinegar", icon: "🍶", placed: false },
      ],
      targetOrder: ["volcano", "baking-soda", "coloring", "vinegar"],
      result: "ERUPTION! The acid-base reaction creates CO2 gas! 🌋💥",
      xp: 35,
    },
  ]

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedItem || !currentExperiment) return

    const newPlacedItems = [...placedItems, draggedItem]
    setPlacedItems(newPlacedItems)
    setDraggedItem(null)

    // Check if experiment is complete
    if (newPlacedItems.length === currentExperiment.items.length) {
      checkExperimentComplete(newPlacedItems)
    }
  }

  const checkExperimentComplete = (items: string[]) => {
    if (!currentExperiment) return

    const isCorrect = items.every((item, index) => item === currentExperiment.targetOrder[index])

    if (isCorrect) {
      setScore((prev) => prev + currentExperiment.xp)
      setShowResult(true)

      setTimeout(() => {
        setExperimentsCompleted((prev) => prev + 1)
        if (experimentsCompleted >= 2) {
          endGame()
        } else {
          // Move to next experiment
          const nextExp = experiments[experimentsCompleted + 1]
          setCurrentExperiment(nextExp)
          setPlacedItems([])
          setShowResult(false)
        }
      }, 3000)
    } else {
      // Reset if wrong order
      setTimeout(() => {
        setPlacedItems([])
      }, 1000)
    }
  }

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setExperimentsCompleted(0)
    setGameComplete(false)
    setPlacedItems([])
    setShowResult(false)
    setCurrentExperiment(experiments[0])
  }

  const endGame = () => {
    setGameActive(false)
    setGameComplete(true)

    progressTracker.recordQuizCompletion({
      quizId: "science-lab",
      subject: "science",
      score: (score / 90) * 100,
      totalQuestions: 3,
      correctAnswers: experimentsCompleted,
      timeSpent: 0,
      difficulty: "medium",
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
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white">
                <Atom className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-foreground">Virtual Lab</span>
                <p className="text-sm text-muted-foreground">Drag & Drop Experiments</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              {gameActive && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {score} XP
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {!gameActive && !gameComplete && (
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Beaker className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">🧪 Virtual Science Lab</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-muted-foreground">
                <p className="mb-4">Drag and drop components to conduct experiments!</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">🧪 Experiments</div>
                    <div>3 interactive labs</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">🎯 Goal</div>
                    <div>Correct order matters</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">🧠 Learn</div>
                    <div>Scientific concepts</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">🏆 XP Reward</div>
                    <div>Up to 90 XP</div>
                  </div>
                </div>
              </div>
              <Button onClick={startGame} size="lg" className="w-full">
                <Beaker className="w-5 h-5 mr-2" />
                Start Experiments
              </Button>
            </CardContent>
          </Card>
        )}

        {gameActive && currentExperiment && (
          <div className="space-y-6">
            {/* Progress */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Experiment {experimentsCompleted + 1}/3: {currentExperiment.name}
                  </span>
                  <span className="text-sm font-medium">{score} XP</span>
                </div>
                <Progress value={(placedItems.length / currentExperiment.items.length) * 100} />
              </CardContent>
            </Card>

            {/* Experiment Area */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Items to Drag */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Available Items</CardTitle>
                  <p className="text-sm text-muted-foreground">Drag items to the experiment area</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {currentExperiment.items
                      .filter((item) => !placedItems.includes(item.id))
                      .map((item) => (
                        <div
                          key={item.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, item.id)}
                          className="p-4 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-move hover:border-primary hover:bg-muted/50 transition-colors text-center"
                        >
                          <div className="text-2xl mb-1">{item.icon}</div>
                          <div className="text-sm font-medium">{item.name}</div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Drop Zone */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{currentExperiment.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{currentExperiment.description}</p>
                </CardHeader>
                <CardContent>
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="min-h-[200px] border-2 border-dashed border-primary/30 rounded-lg p-4 bg-muted/20"
                  >
                    {placedItems.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        Drop items here in the correct order
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {placedItems.map((itemId, index) => {
                          const item = currentExperiment.items.find((i) => i.id === itemId)
                          return (
                            <div key={index} className="flex items-center gap-3 p-2 bg-background rounded border">
                              <span className="text-lg">{item?.icon}</span>
                              <span className="font-medium">{item?.name}</span>
                              <span className="text-sm text-muted-foreground ml-auto">Step {index + 1}</span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {showResult && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-800">Result:</span>
                      </div>
                      <p className="text-green-700">{currentExperiment.result}</p>
                    </div>
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
              <CardTitle className="text-2xl">🎉 Lab Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{experimentsCompleted}</div>
                  <div className="text-sm text-muted-foreground">Experiments Done</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{score}</div>
                  <div className="text-sm text-muted-foreground">XP Earned</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={startGame} className="flex-1">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
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
