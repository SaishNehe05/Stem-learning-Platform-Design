"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Star, Lock, Palette, Shield, Trophy } from "lucide-react"

interface AvatarItem {
  id: string
  name: string
  type: "background" | "frame" | "accessory" | "character"
  rarity: "common" | "rare" | "epic" | "legendary"
  unlocked: boolean
  requirement: string
  image?: string
  color?: string
  icon?: string
}

export function AvatarSystem() {
  const [selectedAvatar, setSelectedAvatar] = useState<string>("default")
  const [selectedBackground, setSelectedBackground] = useState<string>("blue")
  const [selectedFrame, setSelectedFrame] = useState<string>("none")
  const [selectedAccessory, setSelectedAccessory] = useState<string>("none")

  const avatarItems: AvatarItem[] = [
    // Characters
    {
      id: "default",
      name: "Student",
      type: "character",
      rarity: "common",
      unlocked: true,
      requirement: "Default avatar",
      icon: "👨‍🎓",
    },
    {
      id: "scientist",
      name: "Scientist",
      type: "character",
      rarity: "rare",
      unlocked: true,
      requirement: "Complete 10 science experiments",
      icon: "👨‍🔬",
    },
    {
      id: "mathematician",
      name: "Mathematician",
      type: "character",
      rarity: "epic",
      unlocked: false,
      requirement: "Score 100% on 5 math quizzes",
      icon: "🧮",
    },
    {
      id: "ninja",
      name: "Math Ninja",
      type: "character",
      rarity: "legendary",
      unlocked: false,
      requirement: "Complete Number Ninja on Hard mode",
      icon: "🥷",
    },

    // Backgrounds
    {
      id: "blue",
      name: "Ocean Blue",
      type: "background",
      rarity: "common",
      unlocked: true,
      requirement: "Default background",
      color: "bg-blue-500",
    },
    {
      id: "green",
      name: "Forest Green",
      type: "background",
      rarity: "common",
      unlocked: true,
      requirement: "Complete first lesson",
      color: "bg-green-500",
    },
    {
      id: "purple",
      name: "Galaxy Purple",
      type: "background",
      rarity: "rare",
      unlocked: true,
      requirement: "Reach level 10",
      color: "bg-purple-500",
    },
    {
      id: "gold",
      name: "Golden Glory",
      type: "background",
      rarity: "epic",
      unlocked: false,
      requirement: "Win 50 games",
      color: "bg-yellow-500",
    },

    // Frames
    {
      id: "none",
      name: "No Frame",
      type: "frame",
      rarity: "common",
      unlocked: true,
      requirement: "Default",
      color: "border-transparent",
    },
    {
      id: "silver",
      name: "Silver Frame",
      type: "frame",
      rarity: "rare",
      unlocked: true,
      requirement: "Complete 25 lessons",
      color: "border-gray-400 border-4",
    },
    {
      id: "gold-frame",
      name: "Gold Frame",
      type: "frame",
      rarity: "epic",
      unlocked: false,
      requirement: "Maintain 30-day streak",
      color: "border-yellow-400 border-4",
    },
    {
      id: "diamond",
      name: "Diamond Frame",
      type: "frame",
      rarity: "legendary",
      unlocked: false,
      requirement: "Reach top 10 leaderboard",
      color: "border-cyan-400 border-4 shadow-lg shadow-cyan-400/50",
    },

    // Accessories
    {
      id: "none-acc",
      name: "No Accessory",
      type: "accessory",
      rarity: "common",
      unlocked: true,
      requirement: "Default",
      icon: "",
    },
    {
      id: "crown",
      name: "Crown",
      type: "accessory",
      rarity: "epic",
      unlocked: false,
      requirement: "Win weekly tournament",
      icon: "👑",
    },
    {
      id: "glasses",
      name: "Smart Glasses",
      type: "accessory",
      rarity: "rare",
      unlocked: true,
      requirement: "Answer 100 questions correctly",
      icon: "🤓",
    },
    {
      id: "shield",
      name: "Mirror Shield",
      type: "accessory",
      rarity: "epic",
      unlocked: true,
      requirement: "Complete Symmetry Maze",
      icon: "🛡️",
    },
  ]

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      rare: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      epic: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      legendary: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    }
    return colors[rarity as keyof typeof colors] || colors.common
  }

  const getSelectedItems = () => {
    const character = avatarItems.find((item) => item.id === selectedAvatar)
    const background = avatarItems.find((item) => item.id === selectedBackground)
    const frame = avatarItems.find((item) => item.id === selectedFrame)
    const accessory = avatarItems.find((item) => item.id === selectedAccessory)

    return { character, background, frame, accessory }
  }

  const { character, background, frame, accessory } = getSelectedItems()

  return (
    <div className="space-y-6">
      {/* Avatar Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-500" />
            Avatar Customization
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="relative inline-block mb-4">
            <div
              className={`w-24 h-24 rounded-full ${background?.color || "bg-blue-500"} ${frame?.color || ""} flex items-center justify-center text-4xl relative overflow-hidden`}
            >
              {character?.icon || "👨‍🎓"}
              {accessory?.icon && accessory.id !== "none-acc" && (
                <div className="absolute -top-2 -right-2 text-2xl">{accessory.icon}</div>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-foreground">{character?.name || "Student"}</div>
            <div className="text-sm text-muted-foreground">
              {background?.name} • {frame?.name} • {accessory?.name}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Avatar Items */}
      {["character", "background", "frame", "accessory"].map((type) => (
        <Card key={type}>
          <CardHeader>
            <CardTitle className="capitalize flex items-center gap-2">
              {type === "character" && <Crown className="w-4 h-4" />}
              {type === "background" && <Palette className="w-4 h-4" />}
              {type === "frame" && <Shield className="w-4 h-4" />}
              {type === "accessory" && <Star className="w-4 h-4" />}
              {type}s
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {avatarItems
                .filter((item) => item.type === type)
                .map((item) => (
                  <Card
                    key={item.id}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      (type === "character" && selectedAvatar === item.id) ||
                      (type === "background" && selectedBackground === item.id) ||
                      (type === "frame" && selectedFrame === item.id) ||
                      (type === "accessory" && selectedAccessory === item.id)
                        ? "ring-2 ring-primary"
                        : ""
                    } ${!item.unlocked ? "opacity-50" : ""}`}
                    onClick={() => {
                      if (!item.unlocked) return
                      if (type === "character") setSelectedAvatar(item.id)
                      if (type === "background") setSelectedBackground(item.id)
                      if (type === "frame") setSelectedFrame(item.id)
                      if (type === "accessory") setSelectedAccessory(item.id)
                    }}
                  >
                    <CardContent className="p-3 text-center">
                      <div className="relative mb-2">
                        {type === "character" && <div className="text-2xl">{item.icon}</div>}
                        {type === "background" && <div className={`w-8 h-8 rounded-full ${item.color} mx-auto`} />}
                        {type === "frame" && (
                          <div className={`w-8 h-8 rounded-full bg-gray-200 ${item.color} mx-auto`} />
                        )}
                        {type === "accessory" && <div className="text-2xl">{item.icon || "∅"}</div>}

                        {!item.unlocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded">
                            <Lock className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="font-medium text-xs text-foreground">{item.name}</div>
                        <Badge className={`text-xs ${getRarityColor(item.rarity)}`}>{item.rarity}</Badge>
                        <div className="text-xs text-muted-foreground">{item.requirement}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Save Button */}
      <Button className="w-full" size="lg">
        <Trophy className="w-4 h-4 mr-2" />
        Save Avatar
      </Button>
    </div>
  )
}
