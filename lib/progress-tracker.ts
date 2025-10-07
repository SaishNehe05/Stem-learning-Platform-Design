export interface QuizResult {
  quizId: string
  subject: string
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number
  difficulty: "easy" | "medium" | "hard"
  timestamp: string
  answers: {
    questionId: number
    selectedAnswer: number
    correctAnswer: number
    isCorrect: boolean
    timeSpent: number
  }[]
}

export interface StudentProgress {
  studentId: string
  studentName: string
  grade: number
  totalXP: number
  level: number
  streak: number
  lastActive: string
  subjects: {
    [subject: string]: {
      totalQuizzes: number
      completedQuizzes: number
      averageScore: number
      totalXP: number
      bestStreak: number
      weakAreas: string[]
      strongAreas: string[]
    }
  }
  achievements: Achievement[]
  quizHistory: QuizResult[]
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: string
  category: "quiz" | "streak" | "subject" | "level"
}

export interface ClassAnalytics {
  classId: string
  totalStudents: number
  activeStudents: number
  averageScore: number
  totalQuizzes: number
  engagementRate: number
  subjectPerformance: {
    [subject: string]: {
      averageScore: number
      completionRate: number
      strugglingStudents: string[]
      topPerformers: string[]
    }
  }
  weeklyTrends: {
    date: string
    quizzesCompleted: number
    averageScore: number
    activeStudents: number
  }[]
}

export interface LeaderboardEntry {
  rank: number
  studentId: string
  studentName: string
  totalXP: number
  level: number
  streak: number
  recentAchievements: number
  weeklyXP: number
  monthlyXP: number
  avatar?: string
  lastActive: string
}

export interface ScoreUpdate {
  studentId: string
  quizId: string
  subject: string
  xpGained: number
  newTotalXP: number
  newLevel: number
  achievements: Achievement[]
  timestamp: string
}

import { offlineManager } from "./offline-manager"

class ProgressTracker {
  private static instance: ProgressTracker
  private syncQueue: QuizResult[] = []
  private isOnline = true

  static getInstance(): ProgressTracker {
    if (!ProgressTracker.instance) {
      ProgressTracker.instance = new ProgressTracker()
    }
    return ProgressTracker.instance
  }

  constructor() {
    if (typeof window !== "undefined") {
      this.initializeOfflineSync()
      this.loadSyncQueue()
    }
  }

  private initializeOfflineSync() {
    window.addEventListener("online", () => {
      this.isOnline = true
      this.syncOfflineData()
    })

    window.addEventListener("offline", () => {
      this.isOnline = false
    })

    this.isOnline = navigator.onLine
  }

  private loadSyncQueue() {
    const stored = localStorage.getItem("stemquest-sync-queue")
    if (stored) {
      this.syncQueue = JSON.parse(stored)
    }
  }

  private saveSyncQueue() {
    localStorage.setItem("stemquest-sync-queue", JSON.stringify(this.syncQueue))
  }

  // Record quiz completion
  recordQuizCompletion(result: QuizResult): void {
    // Store locally first
    this.storeQuizResultLocally(result)

    // Update student progress
    this.updateStudentProgress(result)

    // Check for new achievements
    this.checkAchievements(result)

    // Queue for sync instead of direct sync
    offlineManager.queueForSync("quiz", result)

    // Store analytics data offline
    this.recordAnalytics(result)
  }

  private recordAnalytics(result: QuizResult): void {
    const analyticsData = {
      event: "quiz_completed",
      studentId: result.quizId.split("-")[0] || "unknown",
      subject: result.subject,
      score: result.score,
      timeSpent: result.timeSpent,
      difficulty: result.difficulty,
      timestamp: result.timestamp,
      grade: this.getStudentProgress().grade,
    }

    // Queue analytics for sync
    offlineManager.queueForSync("analytics", analyticsData)
  }

  private storeQuizResultLocally(result: QuizResult): void {
    const key = `quiz-result-${result.quizId}-${result.timestamp}`
    localStorage.setItem(key, JSON.stringify(result))

    // Update quiz history
    const history = this.getQuizHistory()
    history.push(result)
    localStorage.setItem("stemquest-quiz-history", JSON.stringify(history))
  }

  private updateStudentProgress(result: QuizResult): void {
    const progress = this.getStudentProgress()

    // Update XP and level
    const xpGained = this.calculateXP(result)
    progress.totalXP += xpGained

    // Calculate new level (every 500 XP = 1 level)
    progress.level = Math.floor(progress.totalXP / 500) + 1

    // Update streak
    const today = new Date().toDateString()
    const lastActiveDate = new Date(progress.lastActive).toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    if (lastActiveDate === yesterday) {
      progress.streak += 1
    } else if (lastActiveDate !== today) {
      progress.streak = 1
    }

    progress.lastActive = new Date().toISOString()

    // Update subject-specific progress
    if (!progress.subjects[result.subject]) {
      progress.subjects[result.subject] = {
        totalQuizzes: 0,
        completedQuizzes: 0,
        averageScore: 0,
        totalXP: 0,
        bestStreak: 0,
        weakAreas: [],
        strongAreas: [],
      }
    }

    const subjectProgress = progress.subjects[result.subject]
    subjectProgress.completedQuizzes += 1
    subjectProgress.totalXP += xpGained

    // Recalculate average score
    const allScores = this.getSubjectScores(result.subject)
    subjectProgress.averageScore = allScores.reduce((sum, score) => sum + score, 0) / allScores.length

    // Update weak/strong areas based on performance
    this.updateLearningAreas(result, subjectProgress)

    localStorage.setItem("stemquest-student-progress", JSON.stringify(progress))
  }

  private calculateXP(result: QuizResult): number {
    const baseXP = result.correctAnswers * 10
    const difficultyMultiplier = result.difficulty === "easy" ? 1 : result.difficulty === "medium" ? 1.5 : 2
    const speedBonus = result.timeSpent < 300 ? 20 : result.timeSpent < 600 ? 10 : 0 // Bonus for completing under 5/10 minutes
    const perfectBonus = result.correctAnswers === result.totalQuestions ? 50 : 0

    const progress = this.getStudentProgress()
    const streakBonus = Math.min(progress.streak * 5, 100) // Max 100 XP bonus for streaks

    const accuracy = result.correctAnswers / result.totalQuestions
    const accuracyBonus = Math.round(accuracy * 30) // Up to 30 XP for perfect accuracy

    return Math.round(baseXP * difficultyMultiplier + speedBonus + perfectBonus + streakBonus + accuracyBonus)
  }

  private updateLearningAreas(result: QuizResult, subjectProgress: any): void {
    // Analyze incorrect answers to identify weak areas
    const incorrectAnswers = result.answers?.filter((answer) => !answer.isCorrect) || []

    // This is a simplified implementation - in a real app, you'd have more sophisticated topic mapping
    if (incorrectAnswers.length > result.totalQuestions * 0.5) {
      // If more than 50% wrong, mark as weak area
      const topic = this.getTopicFromQuiz(result.quizId)
      if (topic && !subjectProgress.weakAreas.includes(topic)) {
        subjectProgress.weakAreas.push(topic)
      }
    } else if (incorrectAnswers.length < result.totalQuestions * 0.2) {
      // If less than 20% wrong, mark as strong area
      const topic = this.getTopicFromQuiz(result.quizId)
      if (topic && !subjectProgress.strongAreas.includes(topic)) {
        subjectProgress.strongAreas.push(topic)
        // Remove from weak areas if present
        subjectProgress.weakAreas = subjectProgress.weakAreas.filter((area: string) => area !== topic)
      }
    }
  }

  private getTopicFromQuiz(quizId: string): string {
    // Map quiz IDs to topics - simplified implementation
    const topicMap: { [key: string]: string } = {
      "math-algebra": "Algebra",
      "math-geometry": "Geometry",
      "science-physics": "Physics",
      "science-chemistry": "Chemistry",
      "technology-programming": "Programming",
      "engineering-design": "Design Thinking",
    }
    return topicMap[quizId] || "General"
  }

  private checkAchievements(result: QuizResult): void {
    const progress = this.getStudentProgress()
    const newAchievements: Achievement[] = []

    // First quiz achievement
    if (progress.subjects[result.subject]?.completedQuizzes === 1) {
      newAchievements.push({
        id: `first-${result.subject}`,
        name: `${result.subject} Beginner`,
        description: `Completed your first ${result.subject} quiz`,
        icon: "🎯",
        unlockedAt: new Date().toISOString(),
        category: "quiz",
      })
    }

    // Perfect score achievement
    if (result.correctAnswers === result.totalQuestions) {
      newAchievements.push({
        id: `perfect-${Date.now()}`,
        name: "Perfect Score",
        description: "Got 100% on a quiz",
        icon: "🏆",
        unlockedAt: new Date().toISOString(),
        category: "quiz",
      })
    }

    // Streak achievements
    if (progress.streak === 7) {
      newAchievements.push({
        id: "week-streak",
        name: "Week Warrior",
        description: "7 days in a row",
        icon: "🔥",
        unlockedAt: new Date().toISOString(),
        category: "streak",
      })
    }

    // Level achievements
    if (progress.level === 5) {
      newAchievements.push({
        id: "level-5",
        name: "Rising Star",
        description: "Reached level 5",
        icon: "⭐",
        unlockedAt: new Date().toISOString(),
        category: "level",
      })
    }

    // Add new achievements to progress
    progress.achievements.push(...newAchievements)
    localStorage.setItem("stemquest-student-progress", JSON.stringify(progress))

    // Show achievement notifications
    newAchievements.forEach((achievement) => {
      this.showAchievementNotification(achievement)
    })
  }

  private showAchievementNotification(achievement: Achievement): void {
    // In a real app, this would show a toast notification
    console.log(`🎉 Achievement unlocked: ${achievement.name} - ${achievement.description}`)
  }

  private async syncToServer(result: QuizResult): Promise<void> {
    try {
      // In a real app, this would make an API call to your backend
      console.log("Syncing quiz result to server:", result)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Remove from sync queue if it was queued
      this.syncQueue = this.syncQueue.filter((item) => item.timestamp !== result.timestamp)
      this.saveSyncQueue()
    } catch (error) {
      console.error("Failed to sync to server:", error)
      // Add back to sync queue if not already there
      if (!this.syncQueue.find((item) => item.timestamp === result.timestamp)) {
        this.syncQueue.push(result)
        this.saveSyncQueue()
      }
    }
  }

  private async syncOfflineData(): Promise<void> {
    await offlineManager.syncPendingData()
  }

  // Public methods for accessing data
  getStudentProgress(): StudentProgress {
    const stored = localStorage.getItem("stemquest-student-progress")
    if (stored) {
      return JSON.parse(stored)
    }

    // Return default progress for new student
    return {
      studentId: "student-1",
      studentName: "Student",
      grade: 8,
      totalXP: 0,
      level: 1,
      streak: 0,
      lastActive: new Date().toISOString(),
      subjects: {},
      achievements: [],
      quizHistory: [],
    }
  }

  getQuizHistory(): QuizResult[] {
    const stored = localStorage.getItem("stemquest-quiz-history")
    return stored ? JSON.parse(stored) : []
  }

  getSubjectScores(subject: string): number[] {
    const history = this.getQuizHistory()
    return history.filter((result) => result.subject === subject).map((result) => result.score)
  }

  getClassAnalytics(): ClassAnalytics {
    // In a real app, this would fetch from your backend
    // For demo purposes, return mock data based on stored progress
    const progress = this.getStudentProgress()

    return {
      classId: "class-1",
      totalStudents: 28,
      activeStudents: 22,
      averageScore: 78,
      totalQuizzes: 156,
      engagementRate: 85,
      subjectPerformance: {
        math: {
          averageScore: progress.subjects.math?.averageScore || 0,
          completionRate: 75,
          strugglingStudents: [],
          topPerformers: [],
        },
        science: {
          averageScore: progress.subjects.science?.averageScore || 0,
          completionRate: 68,
          strugglingStudents: [],
          topPerformers: [],
        },
      },
      weeklyTrends: [
        { date: "2024-01-01", quizzesCompleted: 12, averageScore: 75, activeStudents: 20 },
        { date: "2024-01-02", quizzesCompleted: 18, averageScore: 82, activeStudents: 24 },
        { date: "2024-01-03", quizzesCompleted: 15, averageScore: 78, activeStudents: 22 },
      ],
    }
  }

  getLeaderboard(limit = 10): LeaderboardEntry[] {
    // In a real app, this would fetch from backend
    // For now, we'll create a dynamic leaderboard with the current student
    const currentProgress = this.getStudentProgress()
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Calculate weekly and monthly XP for current student
    const recentQuizzes = currentProgress.quizHistory.filter((quiz) => new Date(quiz.timestamp) >= weekAgo)
    const monthlyQuizzes = currentProgress.quizHistory.filter((quiz) => new Date(quiz.timestamp) >= monthAgo)

    const weeklyXP = recentQuizzes.reduce((sum, quiz) => {
      return sum + this.calculateXP(quiz)
    }, 0)

    const monthlyXP = monthlyQuizzes.reduce((sum, quiz) => {
      return sum + this.calculateXP(quiz)
    }, 0)

    // Mock leaderboard data with enhanced information
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        rank: 1,
        studentId: "student-carol",
        studentName: "Carol Davis",
        totalXP: 3120,
        level: 8,
        streak: 18,
        recentAchievements: 5,
        weeklyXP: 450,
        monthlyXP: 1200,
        lastActive: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        rank: 2,
        studentId: "student-emma",
        studentName: "Emma Brown",
        totalXP: 2780,
        level: 7,
        streak: 9,
        recentAchievements: 3,
        weeklyXP: 320,
        monthlyXP: 890,
        lastActive: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      },
      {
        rank: 3,
        studentId: "student-alice",
        studentName: "Alice Johnson",
        totalXP: 2450,
        level: 6,
        streak: 12,
        recentAchievements: 4,
        weeklyXP: 280,
        monthlyXP: 750,
        lastActive: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
      },
      {
        rank: 4,
        studentId: "student-bob",
        studentName: "Bob Smith",
        totalXP: 1890,
        level: 4,
        streak: 5,
        recentAchievements: 2,
        weeklyXP: 150,
        monthlyXP: 420,
        lastActive: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      },
      {
        rank: 5,
        studentId: "student-david",
        studentName: "David Wilson",
        totalXP: 1245,
        level: 3,
        streak: 2,
        recentAchievements: 1,
        weeklyXP: 90,
        monthlyXP: 245,
        lastActive: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      },
    ]

    // Add current student to leaderboard
    const currentStudent: LeaderboardEntry = {
      rank: 0, // Will be calculated
      studentId: currentProgress.studentId,
      studentName: currentProgress.studentName,
      totalXP: currentProgress.totalXP,
      level: currentProgress.level,
      streak: currentProgress.streak,
      recentAchievements: currentProgress.achievements.length,
      weeklyXP,
      monthlyXP,
      lastActive: currentProgress.lastActive,
    }

    // Merge and sort leaderboard
    const allEntries = [...mockLeaderboard, currentStudent]
    const sortedEntries = allEntries
      .sort((a, b) => b.totalXP - a.totalXP)
      .map((entry, index) => ({ ...entry, rank: index + 1 }))
      .slice(0, limit)

    return sortedEntries
  }

  recordScoreUpdate(result: QuizResult): ScoreUpdate {
    const xpGained = this.calculateXP(result)
    const progress = this.getStudentProgress()
    const newTotalXP = progress.totalXP + xpGained
    const newLevel = Math.floor(newTotalXP / 500) + 1

    // Get any new achievements from this quiz
    const achievementsBefore = progress.achievements.length
    this.recordQuizCompletion(result)
    const progressAfter = this.getStudentProgress()
    const newAchievements = progressAfter.achievements.slice(achievementsBefore)

    const scoreUpdate: ScoreUpdate = {
      studentId: progress.studentId,
      quizId: result.quizId,
      subject: result.subject,
      xpGained,
      newTotalXP,
      newLevel,
      achievements: newAchievements,
      timestamp: new Date().toISOString(),
    }

    // Store score update for potential real-time sync
    this.storeScoreUpdate(scoreUpdate)

    return scoreUpdate
  }

  private storeScoreUpdate(update: ScoreUpdate): void {
    const updates = this.getStoredScoreUpdates()
    updates.push(update)

    // Keep only last 50 updates to prevent storage bloat
    const recentUpdates = updates.slice(-50)
    localStorage.setItem("stemquest-score-updates", JSON.stringify(recentUpdates))
  }

  getStoredScoreUpdates(): ScoreUpdate[] {
    const stored = localStorage.getItem("stemquest-score-updates")
    return stored ? JSON.parse(stored) : []
  }

  getSubjectLeaderboard(subject: string, limit = 10): LeaderboardEntry[] {
    const allEntries = this.getLeaderboard(50) // Get more entries to filter

    // Calculate subject-specific XP for each student
    const subjectEntries = allEntries
      .map((entry) => {
        const progress = entry.studentId === this.getStudentProgress().studentId ? this.getStudentProgress() : null // In real app, would fetch other students' progress

        const subjectXP = progress?.subjects[subject]?.totalXP || 0

        return {
          ...entry,
          totalXP: subjectXP,
          level: Math.floor(subjectXP / 500) + 1,
        }
      })
      .filter((entry) => entry.totalXP > 0) // Only show students who have XP in this subject
      .sort((a, b) => b.totalXP - a.totalXP)
      .map((entry, index) => ({ ...entry, rank: index + 1 }))
      .slice(0, limit)

    return subjectEntries
  }

  getWeeklyLeaderboard(limit = 10): LeaderboardEntry[] {
    return this.getLeaderboard(limit)
      .sort((a, b) => b.weeklyXP - a.weeklyXP)
      .map((entry, index) => ({ ...entry, rank: index + 1 }))
  }

  // Clear all data (for testing/reset)
  clearAllData(): void {
    localStorage.removeItem("stemquest-student-progress")
    localStorage.removeItem("stemquest-quiz-history")
    localStorage.removeItem("stemquest-sync-queue")
    localStorage.removeItem("stemquest-score-updates")
    this.syncQueue = []
  }
}

export const progressTracker = ProgressTracker.getInstance()
