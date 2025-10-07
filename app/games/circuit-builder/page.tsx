"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trophy, Lightbulb } from "lucide-react"
import Link from "next/link"

interface Component {
  id: string
  name: string
  emoji: string
  type: "battery" | "wire" | "bulb" | "switch"
}

const components: Component[] = [
  { id: "battery", name: "Battery", emoji: "🔋", type: "battery" },
  { id: "wire1", name: "Wire", emoji: "➖", type: "wire" },
  { id: "wire2", name: "Wire", emoji: "➖", type: "wire" },
  { id: "bulb", name: "Light Bulb", emoji: "💡", type: "bulb" },
  { id: "switch", name: "Switch", emoji: "🔘", type: "switch" },
]

interface CircuitSlot {
  id: string
  position: { x: number; y: number }
  accepts: string[]
  component?: Component
}

export default function CircuitBuilder() {
  const [circuitSlots, setCircuitSlots] = useState<CircuitSlot[]>([
    { id: "slot1", position: { x: 100, y: 200 }, accepts: ["battery"] },
    { id: "slot2", position: { x: 200, y: 200 }, accepts: ["wire"] },
    { id: "slot3", position: { x: 300, y: 200 }, accepts: ["switch"] },
    { id: "slot4", position: { x: 400, y: 200 }, accepts: ["wire"] },
    { id: "slot5", position: { x: 500, y: 200 }, accepts: ["bulb"] },
  ])

  const [availableComponents, setAvailableComponents] = useState<Component[]>(components)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [moves, setMoves] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [bulbGlowing, setBulbGlowing] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [draggedComponent, setDraggedComponent] = useState<Component | null>(null)

  const checkCircuit = () => {
    const hasAllComponents = circuitSlots.every((slot) => slot.component)
    const correctOrder = circuitSlots.every((slot) => {
      if (!slot.component) return false
      return slot.accepts.includes(slot.component.type)
    })

    if (hasAllComponents && correctOrder) {
      setBulbGlowing(true)
      setIsComplete(true)

      const basePoints = 50
      const moveBonus = Math.max(0, 20 - moves) * 5
      const totalPoints = basePoints + moveBonus

      setScore(score + totalPoints)
      setFeedback(`Circuit complete! The bulb is glowing! +${totalPoints} points!`)

      setTimeout(() => {
        resetCircuit()
        setLevel(level + 1)
      }, 3000)
    }
  }

  const resetCircuit = () => {
    setCircuitSlots((slots) => slots.map((slot) => ({ ...slot, component: undefined })))
    setAvailableComponents(components)
    setMoves(0)
    setIsComplete(false)
    setBulbGlowing(false)
    setFeedback("")
  }

  const handleDragStart = (component: Component) => {
    setDraggedComponent(component)
  }

  const handleDrop = (slotId: string) => {
    if (!draggedComponent) return

    const slot = circuitSlots.find((s) => s.id === slotId)
    if (!slot || slot.component || !slot.accepts.includes(draggedComponent.type)) {
      setFeedback("That component doesn't fit there! Check the connection points.")
      return
    }

    setCircuitSlots((slots) => slots.map((s) => (s.id === slotId ? { ...s, component: draggedComponent } : s)))

    setAvailableComponents((comps) => comps.filter((c) => c.id !== draggedComponent.id))

    setMoves(moves + 1)
    setDraggedComponent(null)

    setTimeout(checkCircuit, 100)
  }

  const removeComponent = (slotId: string) => {
    const slot = circuitSlots.find((s) => s.id === slotId)
    if (!slot?.component) return

    setAvailableComponents([...availableComponents, slot.component])
    setCircuitSlots((slots) => slots.map((s) => (s.id === slotId ? { ...s, component: undefined } : s)))
    setBulbGlowing(false)
    setIsComplete(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 p-4">
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
            <Badge variant="outline" className="text-lg px-3 py-1">
              Moves: {moves}
            </Badge>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-blue-700">⚡ Electric Circuit Builder 💡</CardTitle>
            <p className="text-center text-gray-600">Connect the components in the right order to light up the bulb!</p>
          </CardHeader>
          <CardContent>
            {feedback && (
              <div
                className={`text-center p-3 rounded-lg mb-4 ${
                  feedback.includes("complete") ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {feedback}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Circuit Board */}
              <Card className="border-2 border-dashed border-blue-300 bg-blue-50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-center">Circuit Board</h3>
                  <div className="relative h-64 bg-gray-100 rounded-lg border-2">
                    {/* Connection lines */}
                    <svg className="absolute inset-0 w-full h-full">
                      <line x1="120" y1="100" x2="220" y2="100" stroke="#666" strokeWidth="3" />
                      <line x1="220" y1="100" x2="320" y2="100" stroke="#666" strokeWidth="3" />
                      <line x1="320" y1="100" x2="420" y2="100" stroke="#666" strokeWidth="3" />
                      <line x1="420" y1="100" x2="520" y2="100" stroke="#666" strokeWidth="3" />
                    </svg>

                    {circuitSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`absolute w-16 h-16 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                          slot.component ? "border-green-500 bg-green-100" : "border-gray-400 bg-white hover:bg-gray-50"
                        }`}
                        style={{
                          left: slot.position.x - 32,
                          top: slot.position.y - 32,
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop(slot.id)}
                        onClick={() => slot.component && removeComponent(slot.id)}
                      >
                        {slot.component ? (
                          <div className="text-center">
                            <div
                              className={`text-2xl ${slot.component.type === "bulb" && bulbGlowing ? "animate-pulse" : ""}`}
                            >
                              {slot.component.type === "bulb" && bulbGlowing ? "💡" : slot.component.emoji}
                            </div>
                            <div className="text-xs">{slot.component.name}</div>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400 text-center">{slot.accepts.join("/")}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="text-center text-sm text-gray-500 mt-2">Drag components here • Click to remove</div>
                </CardContent>
              </Card>

              {/* Available Components */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-center">Available Components</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {availableComponents.map((component) => (
                      <Card
                        key={component.id}
                        className="cursor-grab active:cursor-grabbing transition-transform hover:scale-105 border-2"
                        draggable
                        onDragStart={() => handleDragStart(component)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="text-3xl mb-2">{component.emoji}</div>
                          <div className="font-semibold text-sm">{component.name}</div>
                          <div className="text-xs text-gray-500 mt-1 capitalize">{component.type}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {availableComponents.length === 0 && (
                    <div className="text-center text-gray-400 py-8">All components placed!</div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 text-center">
              <Button onClick={resetCircuit} variant="outline">
                Reset Circuit
              </Button>
              <div className="text-sm text-gray-600 mt-2 flex items-center justify-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Tip: Battery → Wire → Switch → Wire → Bulb
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
