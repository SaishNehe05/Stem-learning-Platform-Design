"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Users,
  TrendingUp,
  BookOpen,
  Award,
  Clock,
  Target,
  ArrowUp,
  Download,
  Filter,
  Search,
  Wifi,
  WifiOff,
  MessageSquare,
  Send,
  AlertTriangle,
  CheckCircle,
  Upload,
} from "lucide-react"
import Link from "next/link"
import { LanguageSelector } from "@/components/language-selector"
import { useTranslation } from "@/lib/i18n"

interface Student {
  id: string
  name: string
  grade: number
  totalXP: number
  level: number
  streak: number
  lastActive: string
  subjects: {
    math: number
    science: number
    technology: number
    engineering: number
  }
  weakAreas: string[]
  strongAreas: string[]
}

interface ClassStats {
  totalStudents: number
  activeToday: number
  averageScore: number
  totalQuizzes: number
  engagementRate: number
  lastSyncTime: string
}

export default function TeacherDashboard() {
  const { t } = useTranslation()
  const [selectedTimeframe, setSelectedTimeframe] = useState("week")
  const [selectedClass, setSelectedClass] = useState("all")
  const [isOnline, setIsOnline] = useState(true)
  const [syncQueue, setSyncQueue] = useState(0)

  useEffect(() => {
    // Handle online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    setIsOnline(navigator.onLine)

    // Simulate sync queue
    setSyncQueue(Math.floor(Math.random() * 5))

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const classStats: ClassStats = {
    totalStudents: 28,
    activeToday: 22,
    averageScore: 78,
    totalQuizzes: 156,
    engagementRate: 85,
    lastSyncTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  }

  const students: Student[] = [
    {
      id: "1",
      name: "Alice Johnson",
      grade: 6,
      totalXP: 2450,
      level: 6,
      streak: 12,
      lastActive: "2 hours ago",
      subjects: { math: 85, science: 92, technology: 78, engineering: 65 },
      weakAreas: ["Algebra", "Geometry"],
      strongAreas: ["Physics", "Chemistry"],
    },
    {
      id: "2",
      name: "Bob Smith",
      grade: 7,
      totalXP: 1890,
      level: 4,
      streak: 5,
      lastActive: "1 day ago",
      subjects: { math: 72, science: 68, technology: 85, engineering: 70 },
      weakAreas: ["Chemistry", "Basic Programming"],
      strongAreas: ["Math Operations"],
    },
    {
      id: "3",
      name: "Carol Davis",
      grade: 6,
      totalXP: 3120,
      level: 8,
      streak: 18,
      lastActive: "30 minutes ago",
      subjects: { math: 95, science: 88, technology: 92, engineering: 89 },
      weakAreas: [],
      strongAreas: ["All Topics"],
    },
    {
      id: "4",
      name: "David Wilson",
      grade: 7,
      totalXP: 1245,
      level: 3,
      streak: 2,
      lastActive: "3 hours ago",
      subjects: { math: 58, science: 62, technology: 45, engineering: 52 },
      weakAreas: ["Programming", "Physics", "Fractions"],
      strongAreas: ["Basic Math"],
    },
    {
      id: "5",
      name: "Emma Brown",
      grade: 6,
      totalXP: 2780,
      level: 7,
      streak: 9,
      lastActive: "1 hour ago",
      subjects: { math: 88, science: 85, technology: 82, engineering: 78 },
      weakAreas: ["Engineering Design"],
      strongAreas: ["Science", "Math"],
    },
  ]

  const weeklyProgress = [
    { day: "Mon", quizzes: 12, avgScore: 75 },
    { day: "Tue", quizzes: 18, avgScore: 82 },
    { day: "Wed", quizzes: 15, avgScore: 78 },
    { day: "Thu", quizzes: 22, avgScore: 85 },
    { day: "Fri", quizzes: 19, avgScore: 80 },
    { day: "Sat", quizzes: 8, avgScore: 72 },
    { day: "Sun", quizzes: 6, avgScore: 68 },
  ]

  const subjectPerformance = [
    { subject: "Math", average: 78, completed: 45 },
    { subject: "Science", average: 82, completed: 38 },
    { subject: "Technology", average: 75, completed: 32 },
    { subject: "Engineering", average: 71, completed: 28 },
  ]

  const difficultyDistribution = [
    { name: "Easy", value: 45, color: "#22c55e" },
    { name: "Medium", value: 35, color: "#f59e0b" },
    { name: "Hard", value: 20, color: "#ef4444" },
  ]

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getPerformanceBadge = (score: number) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  const getLastSyncTime = () => {
    const lastSync = new Date(classStats.lastSyncTime)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - lastSync.getTime()) / (1000 * 60))

    if (diffMinutes < 1) return "Just now"
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    const diffHours = Math.floor(diffMinutes / 60)
    return `${diffHours}h ago`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">{t("learnChamp")}</h1>
                <p className="text-sm text-muted-foreground">Teacher Dashboard</p>
              </div>
            </Link>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={isOnline ? "default" : "destructive"}
                  className={`flex items-center gap-2 px-2 sm:px-3 py-1 text-xs ${
                    isOnline ? "bg-green-100 text-green-800 border-green-200" : ""
                  }`}
                >
                  {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  <span className="hidden sm:inline">{isOnline ? t("online") : t("offline")}</span>
                </Badge>
                {syncQueue > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {syncQueue} pending sync
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">Last sync: {getLastSyncTime()}</span>
              <div className="flex items-center gap-2 flex-wrap">
                <Link href="/teacher/materials">
                  <Button variant="outline" size="sm" className="bg-transparent text-xs sm:text-sm px-2 sm:px-3">
                    <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Upload Materials</span>
                    <span className="sm:hidden">Upload</span>
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="bg-transparent text-xs sm:text-sm px-2 sm:px-3">
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Export Data</span>
                  <span className="sm:hidden">Export</span>
                </Button>
                <LanguageSelector />
                <Avatar>
                  <AvatarFallback className="bg-secondary text-secondary-foreground">TC</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        {/* Class Selector */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="grade6a">Grade 6 - Section A</SelectItem>
                <SelectItem value="grade7a">Grade 7 - Section A</SelectItem>
                <SelectItem value="grade6b">Grade 6 - Section B</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Announcement
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Students</CardTitle>
                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-secondary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-foreground">{classStats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">in your classes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium">Active Today</CardTitle>
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-foreground">{classStats.activeToday}</div>
              <div className="flex items-center gap-1 text-xs">
                <ArrowUp className="w-3 h-3 text-green-500" />
                <span className="text-green-600">+12%</span>
                <span className="text-muted-foreground hidden sm:inline">from yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium">Average Score</CardTitle>
                <Target className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-foreground">{classStats.averageScore}%</div>
              <div className="flex items-center gap-1 text-xs">
                <ArrowUp className="w-3 h-3 text-green-500" />
                <span className="text-green-600">+3%</span>
                <span className="text-muted-foreground hidden sm:inline">this week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium">Quizzes Taken</CardTitle>
                <Award className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-foreground">{classStats.totalQuizzes}</div>
              <p className="text-xs text-muted-foreground">this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium">Engagement</CardTitle>
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-foreground">{classStats.engagementRate}%</div>
              <Progress value={classStats.engagementRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-5 min-w-max">
              <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 sm:px-4">
                Overview
              </TabsTrigger>
              <TabsTrigger value="students" className="text-xs sm:text-sm px-2 sm:px-4">
                Students
              </TabsTrigger>
              <TabsTrigger value="subjects" className="text-xs sm:text-sm px-2 sm:px-4">
                Subjects
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs sm:text-sm px-2 sm:px-4">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="interventions" className="text-xs sm:text-sm px-2 sm:px-4">
                Interventions
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Weekly Progress Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Weekly Activity</CardTitle>
                  <CardDescription className="text-sm">Quiz completion and average scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={weeklyProgress}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="quizzes" fill="hsl(var(--chart-1))" name="Quizzes Completed" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Difficulty Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Question Difficulty</CardTitle>
                  <CardDescription className="text-sm">
                    Distribution of completed questions by difficulty
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={difficultyDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {difficultyDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4">
                    {difficultyDistribution.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {item.name} ({item.value}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Student Performance</CardTitle>
                    <CardDescription>Individual student progress and achievements</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50">
                      <Avatar>
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground">{student.name}</h4>
                          <Badge variant="outline">Grade {student.grade}</Badge>
                          <Badge variant="secondary">Level {student.level}</Badge>
                          {student.weakAreas.length > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Needs Help
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{student.totalXP.toLocaleString()} XP</span>
                          <span>{student.streak} day streak</span>
                          <span>Last active: {student.lastActive}</span>
                        </div>
                        {student.weakAreas.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-red-600 font-medium">
                              Weak areas: {student.weakAreas.join(", ")}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        {Object.entries(student.subjects).map(([subject, score]) => (
                          <div key={subject} className="text-xs">
                            <div className={`font-medium ${getPerformanceColor(score)}`}>{score}%</div>
                            <div className="text-muted-foreground capitalize">{subject}</div>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" size="sm">
                        <Send className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>Average scores and completion rates by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {subjectPerformance.map((subject) => (
                    <div key={subject.subject} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{subject.subject}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={getPerformanceBadge(subject.average)}>{subject.average}% avg</Badge>
                          <span className="text-sm text-muted-foreground">{subject.completed} completed</span>
                        </div>
                      </div>
                      <Progress value={subject.average} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Score Trends</CardTitle>
                <CardDescription>Average quiz scores over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="avgScore"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      name="Average Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interventions" className="space-y-4 sm:space-y-6">
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Students Needing Help
                  </CardTitle>
                  <CardDescription>Students with weak areas or low performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {students
                      .filter((s) => s.weakAreas.length > 0)
                      .map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-sm">{student.name}</p>
                            <p className="text-xs text-muted-foreground">Weak in: {student.weakAreas.join(", ")}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            Assign Practice
                          </Button>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Top Performers
                  </CardTitle>
                  <CardDescription>Students excelling across subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {students
                      .filter((s) => s.totalXP > 2500)
                      .sort((a, b) => b.totalXP - a.totalXP)
                      .map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-sm">{student.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {student.totalXP.toLocaleString()} XP • Level {student.level}
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            Send Praise
                          </Button>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common intervention tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                    <MessageSquare className="w-6 h-6" />
                    <span className="font-medium">Send Announcement</span>
                    <span className="text-xs text-muted-foreground">To entire class</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                    <BookOpen className="w-6 h-6" />
                    <span className="font-medium">Assign Practice</span>
                    <span className="text-xs text-muted-foreground">Targeted exercises</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                    <Download className="w-6 h-6" />
                    <span className="font-medium">Export Reports</span>
                    <span className="text-xs text-muted-foreground">CSV/PDF format</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
