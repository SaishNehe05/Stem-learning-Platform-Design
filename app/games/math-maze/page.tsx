"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Star,
  Timer,
  Home,
  Zap,
  Target,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  Flame,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { progressTracker } from "@/lib/progress-tracker"

interface Position {
  x: number
  y: number
}

interface Door {
  x: number
  y: number
  equation: string
  answer: number
  isOpen: boolean
}

interface MazeCell {
  type: "wall" | "path" | "door" | "start" | "finish" | "trap" | "powerup"
  doorId?: number
}

interface Creature {
  x: number
  y: number
  lastMove: number
  speed: number
  intelligence: number
  isChasing: boolean
  chaseDuration: number
  lastPlayerSeen: Position | null
  patrolPath: Position[]
  currentPatrolIndex: number
}

interface PowerUp {
  x: number
  y: number
  type: "freeze" | "speed" | "shield" | "time"
  collected: boolean
}

interface Trap {
  x: number
  y: number
  active: boolean
  activationTime: number
}

interface Dot {
  x: number
  y: number
  collected: boolean
}

export default function MathMazePage() {
  const [playerPos, setPlayerPos] = useState<Position>({ x: 1, y: 1 })
  const [creature, setCreature] = useState<Creature>({
    x: 13,
    y: 13,
    lastMove: 0,
    speed: 600,
    intelligence: 2,
    isChasing: false,
    chaseDuration: 0,
    lastPlayerSeen: null,
    patrolPath: [
      { x: 13, y: 13 },
      { x: 11, y: 13 },
      { x: 11, y: 11 },
      { x: 13, y: 11 },
    ],
    currentPatrolIndex: 0,
  })
  const [creatures, setCreatures] = useState<Creature[]>([])
  const [doors, setDoors] = useState<Door[]>([])
  const [currentDoor, setCurrentDoor] = useState<Door | null>(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300)
  const [equationTimeLeft, setEquationTimeLeft] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [showEquation, setShowEquation] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [lives, setLives] = useState(3)
  const [dots, setDots] = useState<Dot[]>([])

  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "nightmare">("easy")
  const [powerUps, setPowerUps] = useState<PowerUp[]>([])
  const [traps, setTraps] = useState<Trap[]>([])
  const [playerEffects, setPlayerEffects] = useState({
    frozen: false,
    speedBoost: false,
    shield: false,
    freezeTime: 0,
    speedTime: 0,
    shieldTime: 0,
  })
  const [level, setLevel] = useState(1)
  const [streak, setStreak] = useState(0)

  const [questions, setQuestions] = useState<any[]>([])
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(10)

  const getMazeLayout = (difficulty: string, level: number) => {
    const baseMaze = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 3, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 0, 0, 1, 1, 2, 1, 1, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 1, 0, 1, 1, 2, 1, 1, 0, 1, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 0, 0, 1, 1, 2, 1, 1, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 4, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]

    return baseMaze
  }

  const [mazeLayout, setMazeLayout] = useState(() => getMazeLayout(difficulty, level))

  const generateEquation = () => {
    const operations =
      difficulty === "easy"
        ? ["+", "-"]
        : difficulty === "medium"
          ? ["+", "-", "*"]
          : difficulty === "hard"
            ? ["+", "-", "*", "/"]
            : ["+", "-", "*", "/", "^", "sqrt"]

    const operation = operations[Math.floor(Math.random() * operations.length)]
    let num1, num2, answer, equation

    switch (operation) {
      case "+":
        num1 = Math.floor(Math.random() * (difficulty === "easy" ? 25 : difficulty === "medium" ? 50 : 100)) + 1
        num2 = Math.floor(Math.random() * (difficulty === "easy" ? 25 : difficulty === "medium" ? 50 : 100)) + 1
        answer = num1 + num2
        equation = `${num1} + ${num2}`
        break
      case "-":
        num1 = Math.floor(Math.random() * (difficulty === "easy" ? 50 : difficulty === "medium" ? 100 : 200)) + 25
        num2 = Math.floor(Math.random() * (difficulty === "easy" ? 25 : difficulty === "medium" ? 50 : 100)) + 1
        answer = num1 - num2
        equation = `${num1} - ${num2}`
        break
      case "*":
        num1 = Math.floor(Math.random() * (difficulty === "medium" ? 12 : difficulty === "hard" ? 15 : 20)) + 1
        num2 = Math.floor(Math.random() * (difficulty === "medium" ? 12 : difficulty === "hard" ? 15 : 20)) + 1
        answer = num1 * num2
        equation = `${num1} × ${num2}`
        break
      case "/":
        num2 = Math.floor(Math.random() * 12) + 2
        answer = Math.floor(Math.random() * 15) + 1
        num1 = num2 * answer
        equation = `${num1} ÷ ${num2}`
        break
      case "^":
        num1 = Math.floor(Math.random() * 10) + 2
        num2 = Math.floor(Math.random() * 3) + 2
        answer = Math.pow(num1, num2)
        equation = `${num1}^${num2}`
        break
      case "sqrt":
        answer = Math.floor(Math.random() * 12) + 1
        num1 = answer * answer
        equation = `√${num1}`
        break
      default:
        num1 = 5
        num2 = 3
        answer = 8
        equation = "5 + 3"
    }

    return { equation, answer }
  }

  const moveCreatures = useCallback(() => {
    if (!gameStarted || gameWon || gameOver || showEquation || playerEffects.frozen) return

    const creaturesToMove = difficulty === "easy" ? [creature] : creatures.length > 0 ? creatures : [creature]

    creaturesToMove.forEach((creatureToMove, index) => {
      const now = Date.now()
      if (now - creatureToMove.lastMove < creatureToMove.speed) return

      const distanceToPlayer = Math.abs(creatureToMove.x - playerPos.x) + Math.abs(creatureToMove.y - playerPos.y)
      const canSeePlayer = hasLineOfSight(creatureToMove, playerPos)

      // Enhanced chase logic with memory and persistence
      let isChasing = creatureToMove.isChasing
      let chaseDuration = creatureToMove.chaseDuration
      let lastPlayerSeen = creatureToMove.lastPlayerSeen

      if (canSeePlayer && distanceToPlayer <= 6) {
        isChasing = true
        chaseDuration = now + 5000 // Chase for 5 seconds after losing sight
        lastPlayerSeen = { ...playerPos }
      } else if (isChasing && now > chaseDuration) {
        isChasing = false
        lastPlayerSeen = null
      }

      const findPath = (start: Position, end: Position, intelligence: number) => {
        if (!isChasing && intelligence < 3) {
          // Patrol behavior when not chasing
          const patrol = creatureToMove.patrolPath
          const targetPatrol = patrol[creatureToMove.currentPatrolIndex]

          if (start.x === targetPatrol.x && start.y === targetPatrol.y) {
            // Move to next patrol point
            const nextIndex = (creatureToMove.currentPatrolIndex + 1) % patrol.length
            if (index === 0) {
              setCreature((prev) => ({ ...prev, currentPatrolIndex: nextIndex }))
            } else {
              setCreatures((prev) => prev.map((c, i) => (i === index ? { ...c, currentPatrolIndex: nextIndex } : c)))
            }
          }

          return moveTowards(start, targetPatrol)
        } else {
          // Aggressive pathfinding when chasing
          const target = isChasing ? lastPlayerSeen || end : end
          return smartPathfind(start, target, intelligence)
        }
      }

      const newPos = findPath(creatureToMove, playerPos, creatureToMove.intelligence)

      if (newPos.x !== creatureToMove.x || newPos.y !== creatureToMove.y) {
        const updatedCreature = {
          ...creatureToMove,
          x: newPos.x,
          y: newPos.y,
          lastMove: now,
          isChasing,
          chaseDuration,
          lastPlayerSeen,
        }

        if (index === 0) {
          setCreature(updatedCreature)
        } else {
          setCreatures((prev) => prev.map((c, i) => (i === index ? updatedCreature : c)))
        }
      }
    })
  }, [
    creature,
    creatures,
    playerPos,
    gameStarted,
    gameWon,
    gameOver,
    showEquation,
    playerEffects.frozen,
    difficulty,
    doors,
  ])

  const hasLineOfSight = (from: Position, to: Position): boolean => {
    const dx = Math.abs(to.x - from.x)
    const dy = Math.abs(to.y - from.y)
    const steps = Math.max(dx, dy)

    for (let i = 0; i <= steps; i++) {
      const x = Math.round(from.x + (to.x - from.x) * (i / steps))
      const y = Math.round(from.y + (to.y - from.y) * (i / steps))

      if (x >= 0 && x < 15 && y >= 0 && y < 13 && mazeLayout[y] && mazeLayout[y][x] === 0) {
        return false // Wall blocks line of sight
      }
    }
    return true
  }

  const smartPathfind = (start: Position, end: Position, intelligence: number): Position => {
    const directions = [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
    ]

    let bestMove = start
    let bestScore = Number.POSITIVE_INFINITY

    for (const dir of directions) {
      const newPos = { x: start.x + dir.x, y: start.y + dir.y }

      if (isValidMove(newPos)) {
        const distance = Math.abs(newPos.x - end.x) + Math.abs(newPos.y - end.y)
        const score = distance + Math.random() * (4 - intelligence) // Less randomness for smarter creatures

        if (score < bestScore) {
          bestScore = score
          bestMove = newPos
        }
      }
    }

    return bestMove
  }

  const moveTowards = (from: Position, to: Position): Position => {
    const dx = Math.sign(to.x - from.x)
    const dy = Math.sign(to.y - from.y)

    // Try horizontal movement first
    if (dx !== 0) {
      const newPos = { x: from.x + dx, y: from.y }
      if (isValidMove(newPos)) return newPos
    }

    // Try vertical movement
    if (dy !== 0) {
      const newPos = { x: from.x, y: from.y + dy }
      if (isValidMove(newPos)) return newPos
    }

    return from
  }

  const isValidMove = (pos: Position): boolean => {
    if (pos.x < 0 || pos.x >= 15 || pos.y < 0 || pos.y >= 13) return false
    if (!mazeLayout[pos.y] || mazeLayout[pos.y][pos.x] === undefined) return false

    const cell = mazeLayout[pos.y][pos.x]
    if (cell === 0) return false // Wall

    // Check for closed doors
    const door = doors.find((d) => d.x === pos.x && d.y === pos.y)
    if (door && !door.isOpen) return false

    return true
  }

  useEffect(() => {
    const allCreatures = difficulty === "easy" ? [creature] : creatures.length > 0 ? creatures : [creature]
    const collision = allCreatures.some((c) => c.x === playerPos.x && c.y === playerPos.y)

    if (collision && gameStarted && !gameWon && !playerEffects.shield) {
      setGameOver(true)
      setLives((prev) => prev - 1)
      if (lives === 1) {
        alert("Game Over! You have no more lives.")
      }
    }
  }, [creature, creatures, playerPos, gameStarted, gameWon, playerEffects.shield, difficulty, lives])

  useEffect(() => {
    if (difficulty !== "easy") {
      const newPowerUps: PowerUp[] = []
      const newTraps: Trap[] = []

      // Add power-ups
      const powerUpPositions = [
        { x: 2, y: 2 },
        { x: 12, y: 2 },
        { x: 2, y: 10 },
        { x: 12, y: 10 },
      ]

      powerUpPositions.forEach((pos, index) => {
        if (pos.y < 13 && mazeLayout[pos.y] && mazeLayout[pos.y][pos.x] === 1) {
          const types: PowerUp["type"][] = ["freeze", "speed", "shield", "time"]
          newPowerUps.push({
            x: pos.x,
            y: pos.y,
            type: types[index % types.length],
            collected: false,
          })
        }
      })

      // Add traps for hard and nightmare modes
      if (difficulty === "hard" || difficulty === "nightmare") {
        const trapPositions = [
          { x: 4, y: 6 },
          { x: 8, y: 4 },
          { x: 6, y: 10 },
          { x: 10, y: 8 },
        ]

        trapPositions.forEach((pos) => {
          if (pos.y < 13 && mazeLayout[pos.y] && mazeLayout[pos.y][pos.x] === 1) {
            newTraps.push({
              x: pos.x,
              y: pos.y,
              active: false,
              activationTime: Date.now() + Math.random() * 10000 + 5000,
            })
          }
        })
      }

      setPowerUps(newPowerUps)
      setTraps(newTraps)
    }
  }, [difficulty, mazeLayout])

  useEffect(() => {
    if (difficulty === "medium") {
      setCreatures([
        {
          x: 13,
          y: 13,
          lastMove: 0,
          speed: 800,
          intelligence: 2,
          isChasing: false,
          chaseDuration: 0,
          lastPlayerSeen: null,
          patrolPath: [
            { x: 13, y: 13 },
            { x: 11, y: 13 },
            { x: 11, y: 11 },
          ],
          currentPatrolIndex: 0,
        },
        {
          x: 1,
          y: 13,
          lastMove: 0,
          speed: 1000,
          intelligence: 2,
          isChasing: false,
          chaseDuration: 0,
          lastPlayerSeen: null,
          patrolPath: [
            { x: 1, y: 13 },
            { x: 3, y: 13 },
            { x: 3, y: 11 },
          ],
          currentPatrolIndex: 0,
        },
      ])
    } else if (difficulty === "hard") {
      setCreatures([
        {
          x: 13,
          y: 13,
          lastMove: 0,
          speed: 600,
          intelligence: 3,
          isChasing: false,
          chaseDuration: 0,
          lastPlayerSeen: null,
          patrolPath: [
            { x: 13, y: 13 },
            { x: 9, y: 13 },
            { x: 9, y: 9 },
            { x: 13, y: 9 },
          ],
          currentPatrolIndex: 0,
        },
        {
          x: 1,
          y: 13,
          lastMove: 0,
          speed: 700,
          intelligence: 3,
          isChasing: false,
          chaseDuration: 0,
          lastPlayerSeen: null,
          patrolPath: [
            { x: 1, y: 13 },
            { x: 5, y: 13 },
            { x: 5, y: 9 },
            { x: 1, y: 9 },
          ],
          currentPatrolIndex: 0,
        },
        {
          x: 13,
          y: 1,
          lastMove: 0,
          speed: 900,
          intelligence: 2,
          isChasing: false,
          chaseDuration: 0,
          lastPlayerSeen: null,
          patrolPath: [
            { x: 13, y: 1 },
            { x: 9, y: 1 },
            { x: 9, y: 5 },
          ],
          currentPatrolIndex: 0,
        },
      ])
    } else if (difficulty === "nightmare") {
      setCreatures([
        {
          x: 13,
          y: 13,
          lastMove: 0,
          speed: 400,
          intelligence: 4,
          isChasing: false,
          chaseDuration: 0,
          lastPlayerSeen: null,
          patrolPath: [
            { x: 13, y: 13 },
            { x: 7, y: 13 },
            { x: 7, y: 7 },
            { x: 13, y: 7 },
          ],
          currentPatrolIndex: 0,
        },
        {
          x: 1,
          y: 13,
          lastMove: 0,
          speed: 500,
          intelligence: 4,
          isChasing: false,
          chaseDuration: 0,
          lastPlayerSeen: null,
          patrolPath: [
            { x: 1, y: 13 },
            { x: 7, y: 13 },
            { x: 7, y: 7 },
            { x: 1, y: 7 },
          ],
          currentPatrolIndex: 0,
        },
        {
          x: 13,
          y: 1,
          lastMove: 0,
          speed: 600,
          intelligence: 3,
          isChasing: false,
          chaseDuration: 0,
          lastPlayerSeen: null,
          patrolPath: [
            { x: 13, y: 1 },
            { x: 7, y: 1 },
            { x: 7, y: 7 },
          ],
          currentPatrolIndex: 0,
        },
        {
          x: 7,
          y: 7,
          lastMove: 0,
          speed: 700,
          intelligence: 3,
          isChasing: false,
          chaseDuration: 0,
          lastPlayerSeen: null,
          patrolPath: [
            { x: 7, y: 7 },
            { x: 3, y: 7 },
            { x: 3, y: 3 },
            { x: 11, y: 3 },
          ],
          currentPatrolIndex: 0,
        },
      ])
    }
  }, [difficulty, mazeLayout])

  useEffect(() => {
    const doorPositions: Position[] = []
    mazeLayout.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 2) {
          doorPositions.push({ x, y })
        }
      })
    })

    const initialDoors = doorPositions.map((pos, index) => {
      const { equation, answer } = generateEquation()
      return {
        x: pos.x,
        y: pos.y,
        equation,
        answer,
        isOpen: false,
      }
    })

    setDoors(initialDoors)
  }, [mazeLayout])

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameWon && !gameOver) {
      const timer = setTimeout(() => {
        if (!playerEffects.frozen) {
          setTimeLeft(timeLeft - 1)
        }
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameStarted && !gameWon) {
      setGameOver(true)
    }
  }, [gameStarted, timeLeft, gameWon, gameOver, playerEffects.frozen])

  useEffect(() => {
    if (showEquation && equationTimeLeft > 0) {
      const timer = setTimeout(() => setEquationTimeLeft(equationTimeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (showEquation && equationTimeLeft === 0) {
      setGameOver(true)
      setShowEquation(false)
    }
  }, [showEquation, equationTimeLeft])

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerEffects((prev) => ({
        ...prev,
        freezeTime: Math.max(0, prev.freezeTime - 1),
        speedTime: Math.max(0, prev.speedTime - 1),
        shieldTime: Math.max(0, prev.shieldTime - 1),
        frozen: prev.freezeTime > 0,
        speedBoost: prev.speedTime > 0,
        shield: prev.shieldTime > 0,
      }))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTraps((prev) =>
        prev.map((trap) => ({
          ...trap,
          active: Date.now() > trap.activationTime,
        })),
      )
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(moveCreatures, 100)
    return () => clearInterval(interval)
  }, [moveCreatures])

  // Check if player reached finish
  useEffect(() => {
    if (mazeLayout[playerPos.y]?.[playerPos.x] === 4) {
      setGameWon(true)
      const finalScore = score + timeLeft * 2
      setScore(finalScore)

      const quizResult = {
        quizId: "math-maze-basic",
        subject: "math",
        score: Math.round((finalScore / 1000) * 100), // Convert to percentage
        totalQuestions: 10,
        correctAnswers: Math.round((finalScore / 1000) * 10),
        timeSpent: 300 - timeLeft,
        difficulty: (timeLeft < 240 ? "hard" : "medium") as "easy" | "medium" | "hard",
        timestamp: new Date().toISOString(),
        answers: [], // Simplified for maze game
      }

      progressTracker.recordQuizCompletion(quizResult)
    }
  }, [playerPos, score, timeLeft, mazeLayout])

  const movePlayer = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (!gameStarted || gameWon || gameOver || showEquation) return

      const newPos = { ...playerPos }
      const moveDistance = playerEffects.speedBoost ? 1 : 1

      switch (direction) {
        case "up":
          newPos.y -= moveDistance
          break
        case "down":
          newPos.y += moveDistance
          break
        case "left":
          newPos.x -= moveDistance
          break
        case "right":
          newPos.x += moveDistance
          break
      }

      // Check boundaries
      if (newPos.x < 0 || newPos.x >= 15 || newPos.y < 0 || newPos.y >= 13) return
      if (!mazeLayout[newPos.y] || mazeLayout[newPos.y][newPos.x] === undefined) return

      const targetCell = mazeLayout[newPos.y][newPos.x]

      // Block movement into walls
      if (targetCell === 0) return

      if (targetCell === 2) {
        const door = doors.find((d) => d.x === newPos.x && d.y === newPos.y)
        if (door && !door.isOpen) {
          // Show equation but don't allow movement
          setCurrentDoor(door)
          setShowEquation(true)
          const timeLimit = difficulty === "easy" ? 15 : difficulty === "medium" ? 12 : difficulty === "hard" ? 8 : 5
          setEquationTimeLeft(timeLimit)
          return // Block movement completely until door is solved
        }
      }

      // Check for traps
      const trap = traps.find((t) => t.x === newPos.x && t.y === newPos.y && t.active)
      if (trap && !playerEffects.shield) {
        setGameOver(true)
        return
      }

      // Check for power-ups
      const powerup = powerUps.find((p) => p.x === newPos.x && p.y === newPos.y && !p.collected)
      if (powerup) {
        setPowerUps((prev) => prev.map((p) => (p.x === powerup.x && p.y === powerup.y ? { ...p, collected: true } : p)))

        switch (powerup.type) {
          case "freeze":
            setPlayerEffects((prev) => ({ ...prev, freezeTime: 5 }))
            break
          case "speed":
            setPlayerEffects((prev) => ({ ...prev, speedTime: 8 }))
            break
          case "shield":
            setPlayerEffects((prev) => ({ ...prev, shieldTime: 10 }))
            break
          case "time":
            setTimeLeft((prev) => prev + 30)
            break
        }
        setScore((prev) => prev + 50)
      }

      // Collect dots
      const dotIndex = dots.findIndex((dot) => dot.x === newPos.x && dot.y === newPos.y && dot.collected === false)
      if (dotIndex !== -1) {
        setDots((prev) => prev.map((dot, index) => (index === dotIndex ? { ...dot, collected: true } : dot)))
        setScore((prev) => prev + 10)
      }

      // Allow movement
      setPlayerPos(newPos)

      // Check win condition
      if (targetCell === 4) {
        const allDoorsOpen = doors.every((door) => door.isOpen)
        const allDotsCollected = dots.every((dot) => dot.collected)

        if (allDoorsOpen && allDotsCollected) {
          setGameWon(true)
          const finalScore =
            score +
            timeLeft * 10 +
            (difficulty === "easy" ? 100 : difficulty === "medium" ? 200 : difficulty === "hard" ? 300 : 500)
          setScore(finalScore)

          const quizResult = {
            quizId: "math-maze-advanced",
            subject: "math",
            score: Math.round((correctAnswers / totalQuestions) * 100),
            totalQuestions: totalQuestions,
            correctAnswers: correctAnswers,
            timeSpent: 300 - timeLeft,
            difficulty: difficulty,
            timestamp: new Date().toISOString(),
            answers: questions.map((q, index) => ({
              questionId: index,
              selectedAnswer: userAnswers[index] || 0,
              correctAnswer: q.answer,
              isCorrect: userAnswers[index] === q.answer,
              timeSpent: 30, // Simplified
            })),
          }

          progressTracker.recordQuizCompletion(quizResult)
        }
      }
    },
    [
      playerPos,
      gameStarted,
      gameWon,
      gameOver,
      showEquation,
      playerEffects,
      mazeLayout,
      doors,
      traps,
      powerUps,
      dots,
      score,
      timeLeft,
      lives,
      difficulty,
      correctAnswers,
      totalQuestions,
      questions,
      userAnswers,
    ],
  )

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          movePlayer("up")
          break
        case "ArrowDown":
          movePlayer("down")
          break
        case "ArrowLeft":
          movePlayer("left")
          break
        case "ArrowRight":
          movePlayer("right")
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [movePlayer])

  const handleAnswerSubmit = () => {
    if (!currentDoor) return

    const answer = Number.parseInt(userAnswer)
    if (answer === currentDoor.answer) {
      setDoors((prev) =>
        prev.map((door) => (door.x === currentDoor.x && door.y === currentDoor.y ? { ...door, isOpen: true } : door)),
      )

      const basePoints = 25
      const timeBonus = equationTimeLeft * 2
      const streakBonus = streak * 5
      const difficultyMultiplier =
        difficulty === "easy" ? 1 : difficulty === "medium" ? 1.5 : difficulty === "hard" ? 2 : 3

      const totalPoints = Math.floor((basePoints + timeBonus + streakBonus) * difficultyMultiplier)
      setScore((prev) => prev + totalPoints)
      setStreak((prev) => prev + 1)

      setFeedback({ type: "success", message: `Correct! +${totalPoints} points! Streak: ${streak + 1}` })
      setPlayerPos({ x: currentDoor.x, y: currentDoor.y })

      setTimeout(() => {
        setShowEquation(false)
        setCurrentDoor(null)
        setUserAnswer("")
        setFeedback(null)
      }, 1500)
    } else {
      setStreak(0) // Reset streak on wrong answer
      setFeedback({ type: "error", message: `Wrong answer. Streak reset! The answer was ${currentDoor.answer}` })
      setTimeout(() => {
        setFeedback(null)
      }, 2000)
    }
  }

  const startGame = () => {
    setGameStarted(true)
    setPlayerPos({ x: 1, y: 1 })
    setCreature({
      x: 13,
      y: 13,
      lastMove: 0,
      speed: 600,
      intelligence: 2,
      isChasing: false,
      chaseDuration: 0,
      lastPlayerSeen: null,
      patrolPath: [
        { x: 13, y: 13 },
        { x: 11, y: 13 },
        { x: 11, y: 11 },
        { x: 13, y: 11 },
      ],
      currentPatrolIndex: 0,
    })
    setScore(0)
    setStreak(0)
    setLives(3)
    const timeLimit = difficulty === "easy" ? 300 : difficulty === "medium" ? 240 : difficulty === "hard" ? 180 : 120
    setTimeLeft(timeLimit)
    setGameWon(false)
    setGameOver(false)
    setMazeLayout(getMazeLayout(difficulty, level))
    setPlayerEffects({ frozen: false, speedBoost: false, shield: false, freezeTime: 0, speedTime: 0, shieldTime: 0 })

    // Initialize dots
    const dotPositions: Position[] = []

    // Only add a few strategic dots near doors for visual guidance
    const strategicDots = [
      { x: 6, y: 1 },
      { x: 8, y: 1 }, // Near first door
      { x: 6, y: 4 },
      { x: 8, y: 4 }, // Near second door
      { x: 6, y: 6 },
      { x: 8, y: 6 }, // Near third door
      { x: 6, y: 8 },
      { x: 8, y: 8 }, // Near fourth door
      { x: 6, y: 11 },
      { x: 8, y: 11 }, // Near final door
    ]

    const initialDots = strategicDots.map((pos) => ({
      x: pos.x,
      y: pos.y,
      collected: false,
    }))

    setDots(initialDots)
  }

  const resetGame = () => {
    setGameStarted(false)
    setGameWon(false)
    setGameOver(false) // Reset game over state
    setPlayerPos({ x: 1, y: 1 })
    setCreature({
      x: 13,
      y: 13,
      lastMove: 0,
      speed: 600,
      intelligence: 2,
      isChasing: false,
      chaseDuration: 0,
      lastPlayerSeen: null,
      patrolPath: [
        { x: 13, y: 13 },
        { x: 11, y: 13 },
        { x: 11, y: 11 },
        { x: 13, y: 11 },
      ],
      currentPatrolIndex: 0,
    }) // Reset creature
    setScore(0)
    setTimeLeft(300)
    setShowEquation(false)
    setCurrentDoor(null)
    setUserAnswer("")
    setFeedback(null)
    setEquationTimeLeft(0) // Reset equation timer
    setLives(3) // Reset lives

    // Reset doors
    setDoors((prev) => prev.map((door) => ({ ...door, isOpen: false })))

    // Reset dots
    setDots((prev) => prev.map((dot) => ({ ...dot, collected: false })))
  }

  const getCellContent = (x: number, y: number) => {
    if (y >= 13 || !mazeLayout[y] || mazeLayout[y][x] === undefined) {
      return null
    }

    const cell = mazeLayout[y][x]
    const isPlayer = playerPos.x === x && playerPos.y === y
    const allCreatures = difficulty === "easy" ? [creature] : creatures.length > 0 ? creatures : [creature]
    const isCreature = allCreatures.some((c) => c.x === x && c.y === y)
    const door = doors.find((d) => d.x === x && d.y === y)
    const powerUp = powerUps.find((p) => p.x === x && p.y === y && !p.collected)
    const trap = traps.find((t) => t.x === x && t.y === y)
    const dot = dots.find((d) => d.x === x && d.y === y && !d.collected)

    if (isPlayer && isCreature) {
      return <div className="w-6 h-6 bg-red-600 rounded-full border-2 border-white shadow-lg animate-bounce" />
    }

    if (isPlayer) {
      return (
        <div
          className={`w-6 h-6 rounded-full border-2 border-yellow-600 shadow-lg animate-pulse relative ${
            playerEffects.shield ? "bg-blue-400" : playerEffects.speedBoost ? "bg-green-400" : "bg-yellow-400"
          }`}
        >
          <div className="absolute inset-0 flex items-center justify-center text-xs">🟡</div>
        </div>
      )
    }

    if (isCreature) {
      const currentCreature = allCreatures.find((c) => c.x === x && c.y === y)
      const isChasing = currentCreature?.isChasing || false
      const distanceToPlayer = Math.abs(x - playerPos.x) + Math.abs(y - playerPos.y)

      return (
        <div
          className={`w-6 h-6 rounded-t-full border-2 shadow-lg flex items-center justify-center text-xs relative transition-all duration-200 ${
            isChasing
              ? "bg-red-600 border-red-800 animate-pulse scale-110"
              : distanceToPlayer <= 3
                ? "bg-red-500 border-red-700 animate-bounce"
                : "bg-red-400 border-red-600"
          }`}
        >
          <div className="absolute inset-0 flex items-center justify-center">{isChasing ? "👹" : "👻"}</div>
          {isChasing && (
            <div className="absolute -top-1 -left-1 w-8 h-8 border-2 border-red-500 rounded-full animate-ping opacity-75"></div>
          )}
          <div
            className={`absolute bottom-0 left-0 right-0 h-2 ${isChasing ? "bg-red-600" : "bg-red-500"}`}
            style={{
              clipPath: "polygon(0 0, 20% 100%, 40% 0, 60% 100%, 80% 0, 100% 100%, 100% 0)",
            }}
          ></div>
        </div>
      )
    }

    if (powerUp) {
      const powerUpIcons = {
        freeze: "🧊",
        speed: "⚡",
        shield: "🛡️",
        time: "⏰",
      }
      return (
        <div className="w-full h-full bg-blue-900 flex items-center justify-center text-xs animate-pulse rounded-full border border-blue-300">
          <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center text-xs">
            {powerUpIcons[powerUp.type]}
          </div>
        </div>
      )
    }

    if (trap && trap.active) {
      return <div className="w-full h-full bg-red-200 flex items-center justify-center text-xs animate-pulse">💥</div>
    }

    if (dot && !dot.collected) {
      return (
        <div className="w-full h-full bg-black flex items-center justify-center">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        </div>
      )
    }

    if (cell === 1) {
      return <div className="w-full h-full bg-black"></div>
    }

    if (cell === 2) {
      const door = doors.find((d) => d.x === x && d.y === y)
      return (
        <div
          className={`w-full h-full flex items-center justify-center text-xs font-bold border-2 ${
            door?.isOpen ? "bg-green-500 border-green-300" : "bg-red-500 border-red-300"
          }`}
        >
          {door?.isOpen ? "✓" : "🚪"}
        </div>
      )
    }

    if (cell === 3) {
      return <div className="w-full h-full bg-green-400 flex items-center justify-center text-xs">🏁</div>
    }

    if (cell === 4) {
      return <div className="w-full h-full bg-gold-400 flex items-center justify-center text-xs">🏆</div>
    }

    return <div className="w-full h-full bg-blue-600"></div>
  }

  const getDistanceToCreature = () => {
    const allCreatures = difficulty === "easy" ? [creature] : creatures.length > 0 ? creatures : [creature]
    return Math.min(...allCreatures.map((c) => Math.abs(playerPos.x - c.x) + Math.abs(playerPos.y - c.y)))
  }

  const getDangerLevel = () => {
    const distance = getDistanceToCreature()
    const allCreatures = difficulty === "easy" ? [creature] : creatures.length > 0 ? creatures : [creature]
    const anyChasing = allCreatures.some((c) => c.isChasing)

    if (anyChasing || distance <= 2) return "critical"
    if (distance <= 4) return "high"
    if (distance <= 7) return "medium"
    return "low"
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <Link href="/games" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <Home className="w-4 h-4" />
            Back to Games
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-center">🧩 Math Maze Escape</h1>
            {gameStarted && !gameWon && !gameOver && (
              <div
                className={`px-3 py-1 rounded-full text-sm font-bold animate-pulse ${
                  getDangerLevel() === "critical"
                    ? "bg-red-600 text-white"
                    : getDangerLevel() === "high"
                      ? "bg-red-500 text-white"
                      : getDangerLevel() === "medium"
                        ? "bg-yellow-500 text-black"
                        : "bg-green-500 text-white"
                }`}
              >
                {getDangerLevel() === "critical"
                  ? "🚨 DANGER!"
                  : getDangerLevel() === "high"
                    ? "⚠️ CLOSE"
                    : getDangerLevel() === "medium"
                      ? "👀 WATCH OUT"
                      : "✅ SAFE"}
              </div>
            )}
          </div>
          <div className="w-20" />
        </div>

        {!gameStarted && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Choose Difficulty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { level: "easy", label: "Easy", desc: "Simple math, 1 creature, 5 min", color: "bg-green-500" },
                  { level: "medium", label: "Medium", desc: "More math, 2 creatures, 4 min", color: "bg-yellow-500" },
                  { level: "hard", label: "Hard", desc: "Complex math, 3 creatures, 3 min", color: "bg-orange-500" },
                  {
                    level: "nightmare",
                    label: "Nightmare",
                    desc: "Expert math, 4 creatures, 2 min",
                    color: "bg-red-500",
                  },
                ].map(({ level, label, desc, color }) => (
                  <Button
                    key={level}
                    variant={difficulty === level ? "default" : "outline"}
                    className={`h-auto p-4 flex flex-col gap-2 ${difficulty === level ? color : ""}`}
                    onClick={() => setDifficulty(level as any)}
                  >
                    <div className="font-bold">{label}</div>
                    <div className="text-xs text-center">{desc}</div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-500" />
                    Escape the Maze - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {score} points
                    </Badge>
                    {streak > 0 && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {streak} streak
                      </Badge>
                    )}
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      {formatTime(timeLeft)}
                    </Badge>
                    {playerEffects.shield && (
                      <Badge variant="outline" className="flex items-center gap-1 bg-yellow-100">
                        <Shield className="w-3 h-3" />
                        {playerEffects.shieldTime}s
                      </Badge>
                    )}
                    {playerEffects.speedBoost && (
                      <Badge variant="outline" className="flex items-center gap-1 bg-green-100">
                        <Zap className="w-3 h-3" />
                        {playerEffects.speedTime}s
                      </Badge>
                    )}
                    {playerEffects.frozen && (
                      <Badge variant="outline" className="flex items-center gap-1 bg-blue-100">
                        <Clock className="w-3 h-3" />
                        {playerEffects.freezeTime}s
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!gameStarted ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🧩</div>
                    <h2 className="text-2xl font-bold mb-4">Math Maze Escape</h2>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Navigate through the maze while avoiding creatures! Solve math equations to unlock doors. Collect
                      power-ups and avoid traps in higher difficulties!
                    </p>
                    <Button onClick={startGame} size="lg" className="bg-green-500 hover:bg-green-600">
                      <Zap className="w-4 h-4 mr-2" />
                      Start {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Mode
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-15 gap-0 border-4 border-blue-800 mx-auto w-fit bg-blue-900 p-1 rounded-lg shadow-2xl">
                      {mazeLayout.map((row, y) =>
                        row.map((cell, x) => (
                          <div key={`${x}-${y}`} className="w-6 h-6 flex items-center justify-center relative">
                            {getCellContent(x, y)}
                          </div>
                        )),
                      )}
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex justify-center lg:hidden">
                      <div className="grid grid-cols-3 gap-2 w-32">
                        <div></div>
                        <Button variant="outline" size="sm" onClick={() => movePlayer("up")}>
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <div></div>
                        <Button variant="outline" size="sm" onClick={() => movePlayer("left")}>
                          <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div></div>
                        <Button variant="outline" size="sm" onClick={() => movePlayer("right")}>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                        <div></div>
                        <Button variant="outline" size="sm" onClick={() => movePlayer("down")}>
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                        <div></div>
                      </div>
                    </div>

                    {gameOver && (
                      <div className="text-center py-6 bg-red-50 rounded-lg border-2 border-red-200">
                        <div className="text-4xl mb-2">💀</div>
                        <h3 className="text-xl font-bold text-red-800 mb-2">Game Over!</h3>
                        <p className="text-red-600 mb-4">The creature caught you! Final Score: {score}</p>
                        <Button onClick={resetGame} className="bg-red-500 hover:bg-red-600">
                          Try Again
                        </Button>
                      </div>
                    )}

                    {gameWon && (
                      <div className="text-center py-6 bg-green-50 rounded-lg border-2 border-green-200">
                        <div className="text-4xl mb-2">🎉</div>
                        <h3 className="text-xl font-bold text-green-800 mb-2">Congratulations!</h3>
                        <p className="text-green-600 mb-4">You escaped the maze! Final Score: {score}</p>
                        <Button onClick={resetGame} className="bg-green-500 hover:bg-green-600">
                          Play Again
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📋 How to Play</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-900 rounded-full border border-blue-300"></div>
                  <span>You (yellow dot)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-t-full border-2 border-red-700 flex items-center justify-center text-xs relative">
                    <div
                      className="absolute bottom-0 left-0 right-0 h-2 bg-red-500"
                      style={{
                        clipPath: "polygon(0 0, 20% 100%, 40% 0, 60% 100%, 80% 0, 100% 100%, 100% 0)",
                      }}
                    ></div>
                    <span className="text-white text-xs">👹</span>
                  </div>
                  <span>
                    Creatures (
                    {difficulty === "easy" ? "1" : difficulty === "medium" ? "2" : difficulty === "hard" ? "3" : "4"})
                  </span>
                </div>
                {difficulty !== "easy" && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-900 flex items-center justify-center text-xs animate-pulse rounded-full border border-blue-300">
                        <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center text-xs">⚡</div>
                      </div>
                      <span>Power-ups (freeze, speed, shield, time)</span>
                    </div>
                    {(difficulty === "hard" || difficulty === "nightmare") && (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-200 flex items-center justify-center text-xs animate-pulse">
                          💥
                        </div>
                        <span>Traps (avoid these!)</span>
                      </div>
                    )}
                  </>
                )}
                <p className="text-muted-foreground mt-3">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  Equation time:{" "}
                  {difficulty === "easy"
                    ? "15s"
                    : difficulty === "medium"
                      ? "12s"
                      : difficulty === "hard"
                        ? "8s"
                        : "5s"}
                </p>
              </CardContent>
            </Card>

            {/* Progress */}
            {gameStarted && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Game Status</span>
                    <div className="flex gap-2">
                      {(difficulty === "easy" ? [creature] : creatures).map((c, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full ${c.isChasing ? "bg-red-500 animate-pulse" : "bg-gray-400"}`}
                          title={c.isChasing ? "Chasing!" : "Patrolling"}
                        />
                      ))}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Doors Unlocked</span>
                      <span>
                        {doors.filter((d) => d.isOpen).length}/{doors.length}
                      </span>
                    </div>
                    <Progress value={(doors.filter((d) => d.isOpen).length / doors.length) * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Time Remaining</span>
                      <span>{formatTime(timeLeft)}</span>
                    </div>
                    <Progress value={(timeLeft / 300) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {gameStarted && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🎮 Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    <div></div>
                    <Button variant="outline" size="sm" onClick={() => movePlayer("up")}>
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <div></div>
                    <Button variant="outline" size="sm" onClick={() => movePlayer("left")}>
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={resetGame}>
                      Reset
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => movePlayer("right")}>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <div></div>
                    <Button variant="outline" size="sm" onClick={() => movePlayer("down")}>
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <div></div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Math Equation Modal */}
        {showEquation && currentDoor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center gap-2">
                  🔐 Unlock the Door
                  <Badge variant="destructive" className="animate-pulse">
                    {equationTimeLeft}s
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{currentDoor.equation} = ?</div>
                  <p className="text-muted-foreground">Solve quickly! The creature is coming!</p>
                  <Progress value={(equationTimeLeft / 15) * 100} className="mt-2" />
                </div>

                <div className="space-y-3">
                  <Input
                    type="number"
                    placeholder="Enter your answer"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAnswerSubmit()}
                    className="text-center text-lg"
                    autoFocus
                  />

                  {feedback && (
                    <div
                      className={`flex items-center gap-2 p-3 rounded-lg ${
                        feedback.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {feedback.type === "success" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span className="text-sm">{feedback.message}</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button onClick={handleAnswerSubmit} className="flex-1">
                      Submit Answer
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowEquation(false)
                        setCurrentDoor(null)
                        setUserAnswer("")
                        setFeedback(null)
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
