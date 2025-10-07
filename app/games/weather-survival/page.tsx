"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trophy, Thermometer, CloudRain, Sun, Snowflake } from "lucide-react"
import Link from "next/link"

interface Climate {
  id: string
  name: string
  emoji: string
  background: string
  temperature: string
  description: string
}

interface Adaptation {
  id: string
  name: string
  emoji: string
  climates: string[]
  description: string
}

const climates: Climate[] = [
  {
    id: "arctic",
    name: "Arctic Tundra",
    emoji: "🏔️",
    background: "from-blue-200 to-white",
    temperature: "-40°C",
    description: "Extremely cold with snow and ice",
  },
  {
    id: "desert",
    name: "Hot Desert",
    emoji: "🏜️",
    background: "from-yellow-200 to-orange-200",
    temperature: "45°C",
    description: "Very hot and dry with little water",
  },
  {
    id: "rainforest",
    name: "Tropical Rainforest",
    emoji: "🌴",
    background: "from-green-200 to-green-300",
    temperature: "28°C",
    description: "Hot and humid with lots of rain",
  },
  {
    id: "mountain",
    name: "High Mountains",
    emoji: "⛰️",
    background: "from-gray-200 to-blue-200",
    temperature: "5°C",
    description: "Cold and windy with thin air",
  },
]

const adaptations: Adaptation[] = [
  {
    id: "thick_fur",
    name: "Thick Fur Coat",
    emoji: "🧥",
    climates: ["arctic", "mountain"],
    description: "Keeps body warm in cold weather",
  },
  {
    id: "light_clothes",
    name: "Light Clothing",
    emoji: "👕",
    climates: ["desert", "rainforest"],
    description: "Stays cool in hot weather",
  },
  {
    id: "burrow",
    name: "Underground Burrow",
    emoji: "🕳️",
    climates: ["desert", "arctic"],
    description: "Shelter from extreme temperatures",
  },
  {
    id: "water_storage",
    name: "Water Container",
    emoji: "💧",
    climates: ["desert"],
    description: "Store water for dry conditions",
  },
  {
    id: "waterproof",
    name: "Waterproof Gear",
    emoji: "☂️",
    climates: ["rainforest"],
    description: "Stay dry in wet conditions",
  },
  {
    id: "oxygen_mask",
    name: "Oxygen Mask",
    emoji: "😷",
    climates: ["mountain"],
    description: "Help breathe in thin air",
  },
  {
    id: "snow_shoes",
    name: "Snow Shoes",
    emoji: "👟",
    climates: ["arctic", "mountain"],
    description: "Walk on snow and ice",
  },
  { id: "sun_hat", name: "Sun Hat", emoji: "👒", climates: ["desert"], description: "Protection from strong sun" },
]

export default function WeatherSurvival() {
  const [currentClimate, setCurrentClimate] = useState<Climate | null>(null)
  const [selectedAdaptations, setSelectedAdaptations] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [streak, setStreak] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [gameActive, setGameActive] = useState(false)
  const [character, setCharacter] = useState("🧑")

  const startNewChallenge = () => {
    const randomClimate = climates[Math.floor(Math.random() * climates.length)]
    setCurrentClimate(randomClimate)
    setSelectedAdaptations([])
    setFeedback("")
    setGameActive(true)
    setCharacter("🧑")
  }

  const toggleAdaptation = (adaptationId: string) => {
    if (selectedAdaptations.includes(adaptationId)) {
      setSelectedAdaptations(selectedAdaptations.filter((id) => id !== adaptationId))
    } else {
      setSelectedAdaptations([...selectedAdaptations, adaptationId])
    }
  }

  const checkSurvival = () => {
    if (!currentClimate) return

    const correctAdaptations = adaptations.filter((adaptation) => adaptation.climates.includes(currentClimate.id))

    const selectedCorrect = selectedAdaptations.filter((id) => correctAdaptations.some((correct) => correct.id === id))

    const selectedIncorrect = selectedAdaptations.filter(
      (id) => !correctAdaptations.some((correct) => correct.id === id),
    )

    const survivalRate = (selectedCorrect.length / correctAdaptations.length) * 100
    const penalty = selectedIncorrect.length * 10

    if (survivalRate >= 70 && selectedIncorrect.length === 0) {
      const basePoints = 10
      const streakBonus = streak * 2
      const perfectBonus = survivalRate === 100 ? 5 : 0
      const totalPoints = basePoints + streakBonus + perfectBonus

      setScore(score + totalPoints)
      setStreak(streak + 1)
      setCharacter("😊")
      setFeedback(`Excellent survival! +${totalPoints} points! ${perfectBonus > 0 ? "Perfect adaptation!" : ""}`)

      setTimeout(() => {
        setLevel(level + 1)
        startNewChallenge()
      }, 2500)
    } else {
      setStreak(0)
      setCharacter("😵")
      setFeedback(`Survival failed! You need better adaptations for ${currentClimate.name}. Try again!`)

      setTimeout(() => {
        setSelectedAdaptations([])
        setFeedback("")
        setCharacter("🧑")
      }, 2000)
    }
  }

  const getClimateIcon = (climateId: string) => {
    switch (climateId) {
      case "arctic":
        return <Snowflake className="w-6 h-6" />
      case "desert":
        return <Sun className="w-6 h-6" />
      case "rainforest":
        return <CloudRain className="w-6 h-6" />
      case "mountain":
        return <Thermometer className="w-6 h-6" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
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
            {streak > 0 && <Badge className="bg-orange-500 text-white">🔥 {streak}x Streak</Badge>}
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-blue-700">🌍 Weather Survival Challenge ⛈️</CardTitle>
            <p className="text-center text-gray-600">
              Help your character survive by choosing the right adaptations for each climate!
            </p>
          </CardHeader>
          <CardContent>
            {!gameActive ? (
              <div className="text-center">
                <Button onClick={startNewChallenge} size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Start Survival Challenge
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {feedback && (
                  <div
                    className={`text-center p-3 rounded-lg ${
                      feedback.includes("Excellent") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {feedback}
                  </div>
                )}

                {currentClimate && (
                  <Card className={`bg-gradient-to-r ${currentClimate.background} border-2`}>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="text-6xl mb-4">{currentClimate.emoji}</div>
                        <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                          {getClimateIcon(currentClimate.id)}
                          {currentClimate.name}
                        </h3>
                        <p className="text-lg mb-2">{currentClimate.description}</p>
                        <Badge variant="outline" className="text-lg px-3 py-1">
                          <Thermometer className="w-4 h-4 mr-1" />
                          {currentClimate.temperature}
                        </Badge>

                        <div className="mt-6">
                          <div className="text-8xl mb-4 animate-bounce">{character}</div>
                          <p className="text-gray-600">Your character needs your help to survive!</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-center">Choose Survival Adaptations</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {adaptations.map((adaptation) => (
                        <Card
                          key={adaptation.id}
                          className={`cursor-pointer transition-all hover:scale-105 ${
                            selectedAdaptations.includes(adaptation.id)
                              ? "ring-2 ring-blue-500 bg-blue-50"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => toggleAdaptation(adaptation.id)}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="text-3xl mb-2">{adaptation.emoji}</div>
                            <div className="font-semibold text-sm mb-1">{adaptation.name}</div>
                            <div className="text-xs text-gray-500">{adaptation.description}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="text-center">
                      <Button
                        onClick={checkSurvival}
                        disabled={selectedAdaptations.length === 0}
                        size="lg"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Test Survival ({selectedAdaptations.length} adaptations)
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center text-sm text-gray-600">
                  💡 Tip: Choose adaptations that match the climate conditions!
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
