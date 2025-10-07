"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Trophy,
  Zap,
  ChevronRight,
  Target,
  Brain,
  Atom,
  Calculator,
  Cpu,
  Gamepad2,
  Wifi,
  WifiOff,
  Clock,
  Medal,
  Crown,
  Palette,
} from "lucide-react"
import Link from "next/link"
import { progressTracker, type StudentProgress } from "@/lib/progress-tracker"
import { useTranslation } from "@/lib/i18n"
import { LanguageSelector } from "@/components/language-selector"
import { StreakTracker } from "@/components/streak-tracker"
import { DailyChallenges } from "@/components/daily-challenges"
import { AchievementsSystem } from "@/components/achievements-system"
import { GradeLevelTopics } from "@/components/grade-level-topics"
import { AvatarSystem } from "@/components/avatar-system"

interface Subject {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  progress: number
  totalQuizzes: number
  completedQuizzes: number
  description: string
  grade6Topics: string[]
  grade7Topics: string[]
  grade6Description: string
  grade7Description: string
  grade6Quizzes: number
  grade7Quizzes: number
}

export default function StudentDashboard() {
  const { t } = useTranslation()
  const [studentProgress, setStudentProgress] = useState<StudentProgress | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState<"dashboard" | "challenges" | "achievements" | "topics" | "avatar">(
    "dashboard",
  )
  const [studentData, setStudentData] = useState<any>(null)
  const [selectedAvatar, setSelectedAvatar] = useState<string>("default")
  const [selectedBackground, setSelectedBackground] = useState<string>("blue")

  useEffect(() => {
    const progress = progressTracker.getStudentProgress()
    setStudentProgress(progress)

    const storedStudentData = localStorage.getItem("studentData")
    if (storedStudentData) {
      setStudentData(JSON.parse(storedStudentData))
    }

    const savedAvatar = localStorage.getItem("selectedAvatar")
    const savedBackground = localStorage.getItem("selectedBackground")
    if (savedAvatar) setSelectedAvatar(savedAvatar)
    if (savedBackground) setSelectedBackground(savedBackground)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    setIsOnline(navigator.onLine)

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      clearInterval(timeInterval)
    }
  }, [])

  const getAvatarDisplay = () => {
    const avatarMap: { [key: string]: string } = {
      default: "👨‍🎓",
      scientist: "👨‍🔬",
      mathematician: "🧮",
      ninja: "🥷",
    }

    const backgroundMap: { [key: string]: string } = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      gold: "bg-yellow-500",
    }

    return {
      icon: avatarMap[selectedAvatar] || "👨‍🎓",
      background: backgroundMap[selectedBackground] || "bg-blue-500",
    }
  }

  const avatarDisplay = getAvatarDisplay()

  const subjects: Subject[] = [
    {
      id: "math",
      name: t("mathematics"),
      icon: <Calculator className="w-6 h-6" />,
      color: "bg-blue-500",
      progress: studentProgress?.subjects.math?.averageScore || 0,
      totalQuizzes: studentData?.grade === 6 ? 15 : 20,
      completedQuizzes: studentProgress?.subjects.math?.completedQuizzes || 0,
      description: studentData?.grade === 6 ? t("basicNumbersFractionsShapes") : t("advancedAlgebraGeometry"),
      grade6Description: t("learnFundamentalMath"),
      grade7Description: t("masterAdvancedMath"),
      grade6Quizzes: 15,
      grade7Quizzes: 20,
      grade6Topics: [
        t("numberSystemsPlaceValue"),
        t("fractionsDecimals"),
        t("ratioProportion"),
        t("basicGeometryShapes"),
        t("simpleDataGraphs"),
        t("measurementUnits"),
      ],
      grade7Topics: [
        t("integersRationalNumbers"),
        t("algebraicExpressions"),
        t("linearEquations"),
        t("linesAngles"),
        t("perimeterArea"),
        t("dataHandlingStatistics"),
      ],
    },
    {
      id: "science",
      name: t("science"),
      icon: <Atom className="w-6 h-6" />,
      color: "bg-green-500",
      progress: studentProgress?.subjects.science?.averageScore || 0,
      totalQuizzes: studentData?.grade === 6 ? 12 : 18,
      completedQuizzes: studentProgress?.subjects.science?.completedQuizzes || 0,
      description: studentData?.grade === 6 ? t("exploreWorldAroundUs") : t("diveDeeperScientific"),
      grade6Description: t("discoverBasicScience"),
      grade7Description: t("understandComplexScientific"),
      grade6Quizzes: 12,
      grade7Quizzes: 18,
      grade6Topics: [
        t("foodNutrition"),
        t("plantAnimalLife"),
        t("matterMaterials"),
        t("motionForces"),
        t("weatherClimate"),
        t("ourEnvironment"),
      ],
      grade7Topics: [
        t("ecosystemsBiodiversity"),
        t("heatTemperature"),
        t("lightReflection"),
        t("acidsBasesSalts"),
        t("electricCurrent"),
        t("soilWaterConservation"),
      ],
    },
    {
      id: "technology",
      name: t("technology"),
      icon: <Cpu className="w-6 h-6" />,
      color: "bg-purple-500",
      progress: studentProgress?.subjects.technology?.averageScore || 0,
      totalQuizzes: studentData?.grade === 6 ? 10 : 15,
      completedQuizzes: studentProgress?.subjects.technology?.completedQuizzes || 0,
      description: studentData?.grade === 6 ? t("introductionComputersDigital") : t("advancedComputingProgramming"),
      grade6Description: t("learnBasicComputerSkills"),
      grade7Description: t("exploreProgrammingWebDesign"),
      grade6Quizzes: 10,
      grade7Quizzes: 15,
      grade6Topics: [
        t("basicComputing"),
        t("internetSafety"),
        t("digitalTools"),
        t("simpleCoding"),
        t("keyboardMouseSkills"),
        t("fileManagement"),
      ],
      grade7Topics: [
        t("programmingBasics"),
        t("webTechnologies"),
        t("databaseConcepts"),
        t("digitalDesign"),
        t("roboticsIntroduction"),
        t("aiMachineLearningBasics"),
      ],
    },
    {
      id: "engineering",
      name: t("engineering"),
      icon: <Brain className="w-6 h-6" />,
      color: "bg-orange-500",
      progress: studentProgress?.subjects.engineering?.averageScore || 0,
      totalQuizzes: studentData?.grade === 6 ? 8 : 12,
      completedQuizzes: studentProgress?.subjects.engineering?.completedQuizzes || 0,
      description: studentData?.grade === 6 ? t("simpleDesignBuilding") : t("complexProblemSolving"),
      grade6Description: t("buildCreateHandsOn"),
      grade7Description: t("designSolutionsRealWorld"),
      grade6Quizzes: 8,
      grade7Quizzes: 12,
      grade6Topics: [
        t("designProcess"),
        t("simpleMachines"),
        t("materialsProperties"),
        t("buildingStructures"),
        t("problemIdentification"),
        t("teamworkCommunication"),
      ],
      grade7Topics: [
        t("advancedDesignThinking"),
        t("engineeringSystems"),
        t("innovationCreativity"),
        t("projectManagement"),
        t("sustainableDesign"),
        t("technologyIntegration"),
      ],
    },
  ]

  const getDailyChallenge = () => {
    const grade6Challenges = [
      {
        subject: "math",
        title: t("numberExplorer"),
        description: t("practiceBasicArithmetic"),
        xp: 30,
        time: t("fiveMin"),
      },
      {
        subject: "science",
        title: t("natureDetective"),
        description: t("identifyPlantsAnimals"),
        xp: 25,
        time: t("fourMin"),
      },
      {
        subject: "technology",
        title: t("digitalHelper"),
        description: t("learnBasicComputerOps"),
        xp: 35,
        time: t("sixMin"),
      },
      {
        subject: "engineering",
        title: t("builderChallenge"),
        description: t("designSimpleStructure"),
        xp: 40,
        time: t("eightMin"),
      },
    ]

    const grade7Challenges = [
      {
        subject: "math",
        title: t("algebraMaster"),
        description: t("solveAlgebraicEquations"),
        xp: 50,
        time: t("threeMin"),
      },
      {
        subject: "science",
        title: t("scienceInvestigator"),
        description: t("exploreAdvancedScientific"),
        xp: 45,
        time: t("fiveMin"),
      },
      {
        subject: "technology",
        title: t("codeCreator"),
        description: t("completeProgrammingChallenges"),
        xp: 60,
        time: t("fourMin"),
      },
      {
        subject: "engineering",
        title: t("innovationLab"),
        description: t("designSolutionsComplex"),
        xp: 55,
        time: t("sixMin"),
      },
    ]

    const challenges = studentData?.grade === 6 ? grade6Challenges : grade7Challenges
    const today = new Date().getDate()
    return challenges[today % challenges.length]
  }

  const getGradeSpecificWelcome = () => {
    if (studentData?.grade === 6) {
      return {
        title: t("welcomeBack", { name: studentProgress?.studentName || t("youngExplorer") }),
        subtitle: t("readyToDiscover"),
        levelTitle: t("stemExplorer"),
        encouragement: t("youreDoingGreat"),
      }
    } else {
      return {
        title: t("welcomeBack", { name: studentProgress?.studentName || t("stemChampion") }),
        subtitle: t("readyToMaster"),
        levelTitle: t("stemChampion"),
        encouragement: t("excellentProgress"),
      }
    }
  }

  const welcomeData = getGradeSpecificWelcome()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b border-border bg-gradient-to-r from-card via-card to-primary/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {t("learnChamp")}
                </span>
                <p className="text-sm text-muted-foreground font-medium">
                  {t("gradeDashboard", { grade: studentData?.grade || studentProgress?.grade || 6 })}
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-2 overflow-x-auto">
              <Button
                variant={activeTab === "dashboard" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("dashboard")}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Target className="w-4 h-4" />
                {t("dashboard")}
              </Button>
              <Button
                variant={activeTab === "challenges" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("challenges")}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Zap className="w-4 h-4" />
                {t("challenges")}
              </Button>
              <Button
                variant={activeTab === "achievements" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("achievements")}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Trophy className="w-4 h-4" />
                {t("achievements")}
              </Button>
              <Button
                variant={activeTab === "topics" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("topics")}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4" />
                {t("topics")}
              </Button>
              <Button
                variant={activeTab === "avatar" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("avatar")}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Palette className="w-4 h-4" />
                {t("avatar")}
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant={isOnline ? "default" : "destructive"}
                className={`flex items-center gap-2 px-3 py-1 text-xs font-medium ${
                  isOnline
                    ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400"
                    : ""
                }`}
              >
                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {isOnline ? t("online") : t("offline")}
              </Badge>
              <Link href="/games">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800 hover:from-purple-100 hover:to-indigo-100"
                >
                  <Gamepad2 className="w-4 h-4" />
                  {t("games")}
                </Button>
              </Link>
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-950/20 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
              >
                <Zap className="w-3 h-3" />
                {studentProgress?.totalXP || 0} XP
              </Badge>
              <LanguageSelector />
              <div
                className={`w-10 h-10 rounded-full ${avatarDisplay.background} flex items-center justify-center text-xl ring-2 ring-primary/20 shadow-lg`}
              >
                {avatarDisplay.icon}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {activeTab === "dashboard" && (
          <>
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-secondary/5 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                          <Crown className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            {welcomeData.title}
                          </CardTitle>
                          <CardDescription className="text-base">{welcomeData.subtitle}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-foreground">{studentProgress?.level || 1}</div>
                        <div className="text-sm text-muted-foreground">{welcomeData.levelTitle}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">{t("progressToNextLevel")}</span>
                          <span className="font-medium">{(studentProgress?.totalXP || 0) % 500}/500 XP</span>
                        </div>
                        <Progress value={(((studentProgress?.totalXP || 0) % 500) / 500) * 100} className="h-3" />
                      </div>
                      <div className="pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground italic">{welcomeData.encouragement}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-foreground">{studentProgress?.totalXP || 0}</div>
                          <div className="text-xs text-muted-foreground">{t("totalXP")}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-foreground">
                            {studentProgress?.achievements?.length || 0}
                          </div>
                          <div className="text-xs text-muted-foreground">{t("achievements")}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-foreground">{studentProgress?.streak || 0}</div>
                          <div className="text-xs text-muted-foreground">{t("dayStreak")}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <StreakTracker />
              </div>
            </div>

            <div className="mb-8">
              <Card className="border-2 border-accent/30 bg-gradient-to-r from-accent/5 to-primary/5 shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center shadow-md">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{t("todaysChallenge")}</CardTitle>
                        <CardDescription>{getDailyChallenge().title}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 font-bold">
                      +{getDailyChallenge().xp} XP
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <p className="text-sm text-muted-foreground">{getDailyChallenge().description}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {getDailyChallenge().time}
                      </div>
                    </div>
                    <Link href={`/student/quiz/${getDailyChallenge().subject}`}>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-accent to-primary hover:from-primary hover:to-accent shadow-md"
                      >
                        {t("startChallenge")}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  🎮 {t("quickGames")}
                </h2>
                <Link href="/games">
                  <Button variant="outline" size="sm" className="hover:bg-primary/10 bg-transparent">
                    {t("viewAllGames")}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <Link href="/games/math-puzzle">
                  <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105 border-2 hover:border-primary/30">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                          <Calculator className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{t("numberNinja")}</h4>
                          <p className="text-sm text-muted-foreground">{t("mathPuzzles")}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/games/science-lab">
                  <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105 border-2 hover:border-primary/30">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                          <Atom className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{t("virtualLab")}</h4>
                          <p className="text-sm text-muted-foreground">{t("scienceExperiments")}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/games/code-challenge">
                  <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105 border-2 hover:border-primary/30">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                          <Cpu className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{t("codeQuest")}</h4>
                          <p className="text-sm text-muted-foreground">{t("programmingChallenges")}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
                📚 {t("gradeSubjects", { grade: studentData?.grade || 6 })}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {subjects.map((subject) => (
                  <Link key={subject.id} href={`/student/quiz/${subject.id}`}>
                    <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105 border-2 hover:border-primary/30">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div
                            className={`w-14 h-14 ${subject.color} rounded-xl flex items-center justify-center text-white shadow-lg`}
                          >
                            {subject.icon}
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <CardTitle className="text-xl">{subject.name}</CardTitle>
                        <CardDescription className="text-base">
                          {studentData?.grade === 6 ? subject.grade6Description : subject.grade7Description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{t("progress")}</span>
                            <span className="font-bold text-foreground">{subject.progress}%</span>
                          </div>
                          <Progress value={subject.progress} className="h-3" />
                          <p className="text-sm text-muted-foreground">
                            {subject.completedQuizzes}/
                            {studentData?.grade === 6 ? subject.grade6Quizzes : subject.grade7Quizzes}{" "}
                            {t("quizzesCompleted")}
                          </p>

                          <div className="pt-3 border-t border-border">
                            <p className="text-sm font-medium text-foreground mb-2">
                              {t("gradeTopics", { grade: studentData?.grade || 6 })}:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {(studentData?.grade === 6 ? subject.grade6Topics : subject.grade7Topics)
                                .slice(0, 2)
                                .map((topic, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {topic}
                                  </Badge>
                                ))}
                              {(studentData?.grade === 6 ? subject.grade6Topics : subject.grade7Topics).length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{(studentData?.grade === 6 ? subject.grade6Topics : subject.grade7Topics).length - 2}{" "}
                                  {t("more")}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Medal className="w-6 h-6 text-accent" />
                  {t("recentAchievements")}
                </CardTitle>
                <CardDescription>{t("yourLatestAccomplishments")}</CardDescription>
              </CardHeader>
              <CardContent>
                {studentProgress?.achievements && studentProgress.achievements.length > 0 ? (
                  <div className="grid md:grid-cols-3 gap-4">
                    {studentProgress.achievements.slice(-3).map((achievement, index) => (
                      <div
                        key={achievement.id}
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-muted/50 to-primary/5 rounded-xl border border-primary/10"
                      >
                        <div className="text-3xl">{achievement.icon}</div>
                        <div>
                          <h4 className="font-semibold text-foreground">{achievement.name}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">{t("noAchievementsYet")}</h3>
                    <p className="text-muted-foreground mb-6">{t("completeFirstQuiz")}</p>
                    <Link href={`/student/quiz/${subjects[0].id}`}>
                      <Button className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary shadow-md">
                        {t("startYourFirstQuiz")}
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "challenges" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                {t("dailyChallenge")}
              </h1>
              <p className="text-lg text-muted-foreground">{t("completeChallengesEarnXP")}</p>
            </div>
            <DailyChallenges />
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                {t("achievements")}
              </h1>
              <p className="text-lg text-muted-foreground">{t("trackProgressUnlockRewards")}</p>
            </div>
            <AchievementsSystem />
          </div>
        )}

        {activeTab === "topics" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                {t("studyTopics")}
              </h1>
              <p className="text-lg text-muted-foreground">{t("exploreGradeAppropriate")}</p>
            </div>
            <GradeLevelTopics />
          </div>
        )}

        {activeTab === "avatar" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                {t("avatarCustomization")}
              </h1>
              <p className="text-lg text-muted-foreground">{t("personalizeProfileUnlockable")}</p>
            </div>
            <AvatarSystem />
          </div>
        )}
      </div>
    </div>
  )
}
