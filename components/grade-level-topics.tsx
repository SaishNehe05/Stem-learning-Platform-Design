"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Calculator, Microscope, Cpu, Wrench, ChevronRight, Star } from "lucide-react"

interface Topic {
  id: string
  title: string
  description: string
  subject: "math" | "science" | "technology" | "engineering"
  grade: 6 | 7 | 8
  difficulty: "beginner" | "intermediate" | "advanced"
  progress: number
  totalLessons: number
  completedLessons: number
  xpReward: number
  estimatedTime: number // in minutes
}

export function GradeLevelTopics() {
  const [selectedGrade, setSelectedGrade] = useState<6 | 7 | 8>(6)
  const [selectedSubject, setSelectedSubject] = useState<string>("all")

  const topics: Topic[] = [
    // Grade 6 Topics
    {
      id: "6m1",
      title: "Patterns in Mathematics",
      description: "Visualize number sequences, triangular numbers, cube numbers and shape patterns",
      subject: "math",
      grade: 6,
      difficulty: "beginner",
      progress: 0,
      totalLessons: 8,
      completedLessons: 0,
      xpReward: 120,
      estimatedTime: 40,
    },
    {
      id: "6m2",
      title: "Lines & Angles",
      description: "Learn about points, lines, rays, angles and their measurements",
      subject: "math",
      grade: 6,
      difficulty: "beginner",
      progress: 0,
      totalLessons: 10,
      completedLessons: 0,
      xpReward: 150,
      estimatedTime: 45,
    },
    {
      id: "6m3",
      title: "Number Play",
      description: "Explore palindromes, Kaprekar numbers, mental math and number patterns",
      subject: "math",
      grade: 6,
      difficulty: "beginner",
      progress: 0,
      totalLessons: 12,
      completedLessons: 0,
      xpReward: 140,
      estimatedTime: 50,
    },
    {
      id: "6m4",
      title: "Data Handling & Presentation",
      description: "Collect data, create pictographs and bar graphs",
      subject: "math",
      grade: 6,
      difficulty: "beginner",
      progress: 0,
      totalLessons: 8,
      completedLessons: 0,
      xpReward: 110,
      estimatedTime: 35,
    },
    {
      id: "6m5",
      title: "Prime Time",
      description: "Discover prime numbers, factors, multiples and divisibility tests",
      subject: "math",
      grade: 6,
      difficulty: "beginner",
      progress: 0,
      totalLessons: 10,
      completedLessons: 0,
      xpReward: 130,
      estimatedTime: 40,
    },
    {
      id: "6m6",
      title: "Perimeter and Area",
      description: "Calculate perimeter and area of rectangles, squares and triangles",
      subject: "math",
      grade: 6,
      difficulty: "beginner",
      progress: 0,
      totalLessons: 9,
      completedLessons: 0,
      xpReward: 140,
      estimatedTime: 45,
    },
    {
      id: "6m7",
      title: "Fractions",
      description: "Understand fractional units, equivalent fractions and operations",
      subject: "math",
      grade: 6,
      difficulty: "beginner",
      progress: 0,
      totalLessons: 14,
      completedLessons: 0,
      xpReward: 180,
      estimatedTime: 60,
    },
    {
      id: "6m8",
      title: "Playing with Constructions",
      description: "Construct squares, rectangles and explore geometric properties",
      subject: "math",
      grade: 6,
      difficulty: "beginner",
      progress: 0,
      totalLessons: 8,
      completedLessons: 0,
      xpReward: 120,
      estimatedTime: 40,
    },
    {
      id: "6m9",
      title: "Symmetry",
      description: "Identify line symmetry and rotational symmetry in shapes",
      subject: "math",
      grade: 6,
      difficulty: "beginner",
      progress: 0,
      totalLessons: 7,
      completedLessons: 0,
      xpReward: 100,
      estimatedTime: 35,
    },
    {
      id: "6m10",
      title: "The Other Side of Zero - Integers",
      description: "Work with positive and negative integers on number line",
      subject: "math",
      grade: 6,
      difficulty: "beginner",
      progress: 0,
      totalLessons: 10,
      completedLessons: 0,
      xpReward: 150,
      estimatedTime: 45,
    },

    // Science Topics - Based on Class VI syllabus
    {
      id: "6s1",
      title: "Components of Food",
      description: "Investigate plant and animal food sources, test for nutrients and balanced diet",
      subject: "science",
      grade: 6,
      difficulty: "beginner",
      progress: 0,
      totalLessons: 12,
      completedLessons: 0,
      xpReward: 160,
      estimatedTime: 50,
    },
    {
      id: "6s2",
      title: "Electricity and Circuits",
      description: "Learn about open/closed circuits, conductors and insulators",
      subject: "science",
      grade: 6,
      difficulty: "beginner",
      progress: 0,
      totalLessons: 10,
      completedLessons: 0,
      xpReward: 140,
      estimatedTime: 45,
    },
    {
      id: "6s3",
      title: "Fun with Magnets",
      description: "Explore magnetic materials, poles, properties and magnetic compass",
      subject: "science",
      grade: 6,
      difficulty: "beginner",
      progress: 0,
      totalLessons: 8,
      completedLessons: 0,
      xpReward: 120,
      estimatedTime: 40,
    },
    {
      id: "6s4",
      title: "Light, Shadows and Reflections",
      description: "Understand how light travels, transparent/opaque objects and shadows",
      subject: "science",
      grade: 6,
      difficulty: "beginner",
      progress: 0,
      totalLessons: 10,
      completedLessons: 0,
      xpReward: 140,
      estimatedTime: 45,
    },
    {
      id: "6s5",
      title: "Getting to Know Plants",
      description: "Classify plants, study roots, stems, leaves and flower parts",
      subject: "science",
      grade: 6,
      difficulty: "beginner",
      progress: 0,
      totalLessons: 12,
      completedLessons: 0,
      xpReward: 160,
      estimatedTime: 50,
    },
    {
      id: "6s6",
      title: "Living Organisms: Characteristics and Habitats",
      description: "Distinguish living/non-living, study habitats and adaptations",
      subject: "science",
      grade: 6,
      difficulty: "beginner",
      progress: 0,
      totalLessons: 14,
      completedLessons: 0,
      xpReward: 180,
      estimatedTime: 55,
    },
    {
      id: "6s7",
      title: "Air Around Us",
      description: "Learn about air composition, oxygen, air pollution and its properties",
      subject: "science",
      grade: 6,
      difficulty: "beginner",
      progress: 0,
      totalLessons: 10,
      completedLessons: 0,
      xpReward: 140,
      estimatedTime: 45,
    },

    // AI Topics - Based on Class VI AI Curriculum
    {
      id: "6ai1",
      title: "What is AI - How does AI work?",
      description: "Introduction to Human Intelligence, Artificial Intelligence vs Automation, AI applications",
      subject: "technology",
      grade: 6,
      difficulty: "beginner",
      progress: 0,
      totalLessons: 15,
      completedLessons: 0,
      xpReward: 200,
      estimatedTime: 60,
    },
    {
      id: "6ai2",
      title: "AI Domains & Computer Vision",
      description: "Learn about three domains of AI, Computer Vision applications and pattern recognition",
      subject: "technology",
      grade: 6,
      difficulty: "beginner",
      progress: 0,
      totalLessons: 18,
      completedLessons: 0,
      xpReward: 240,
      estimatedTime: 70,
    },

    // Grade 7 Topics remain unchanged for now
    {
      id: "7m1",
      title: "Integers and Rational Numbers",
      description: "Work with positive and negative numbers, operations, and number lines",
      subject: "math",
      grade: 7,
      difficulty: "intermediate",
      progress: 50,
      totalLessons: 14,
      completedLessons: 7,
      xpReward: 180,
      estimatedTime: 50,
    },
    {
      id: "7s1",
      title: "Life Science and Ecosystems",
      description: "Study living organisms, food chains, and environmental interactions",
      subject: "science",
      grade: 7,
      difficulty: "intermediate",
      progress: 30,
      totalLessons: 16,
      completedLessons: 5,
      xpReward: 220,
      estimatedTime: 65,
    },
    {
      id: "7t1",
      title: "Web Development Basics",
      description: "Create your first websites with HTML and CSS",
      subject: "technology",
      grade: 7,
      difficulty: "intermediate",
      progress: 20,
      totalLessons: 12,
      completedLessons: 2,
      xpReward: 160,
      estimatedTime: 45,
    },
    {
      id: "7e1",
      title: "Structures and Materials",
      description: "Design and test different structural designs and materials",
      subject: "engineering",
      grade: 7,
      difficulty: "intermediate",
      progress: 70,
      totalLessons: 10,
      completedLessons: 7,
      xpReward: 140,
      estimatedTime: 40,
    },

    // Grade 8 Topics remain unchanged for now
    {
      id: "8m1",
      title: "Algebra Fundamentals",
      description: "Solve equations, work with variables, and understand functions",
      subject: "math",
      grade: 8,
      difficulty: "advanced",
      progress: 25,
      totalLessons: 18,
      completedLessons: 4,
      xpReward: 250,
      estimatedTime: 70,
    },
    {
      id: "8s1",
      title: "Chemistry and Matter",
      description: "Explore atoms, molecules, chemical reactions, and the periodic table",
      subject: "science",
      grade: 8,
      difficulty: "advanced",
      progress: 15,
      totalLessons: 20,
      completedLessons: 3,
      xpReward: 280,
      estimatedTime: 80,
    },
    {
      id: "8t1",
      title: "Python Programming",
      description: "Learn text-based programming with Python and create projects",
      subject: "technology",
      grade: 8,
      difficulty: "advanced",
      progress: 10,
      totalLessons: 15,
      completedLessons: 1,
      xpReward: 200,
      estimatedTime: 60,
    },
    {
      id: "8e1",
      title: "Robotics and Automation",
      description: "Build and program robots to solve real-world problems",
      subject: "engineering",
      grade: 8,
      difficulty: "advanced",
      progress: 5,
      totalLessons: 12,
      completedLessons: 1,
      xpReward: 180,
      estimatedTime: 55,
    },
  ]

  const getSubjectIcon = (subject: string) => {
    const icons = {
      math: <Calculator className="w-4 h-4" />,
      science: <Microscope className="w-4 h-4" />,
      technology: <Cpu className="w-4 h-4" />,
      engineering: <Wrench className="w-4 h-4" />,
    }
    return icons[subject as keyof typeof icons] || icons.math
  }

  const getSubjectColor = (subject: string) => {
    const colors = {
      math: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      science: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      technology: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      engineering: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
    }
    return colors[subject as keyof typeof colors] || colors.math
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: "bg-green-500",
      intermediate: "bg-yellow-500",
      advanced: "bg-red-500",
    }
    return colors[difficulty as keyof typeof colors] || colors.beginner
  }

  const filteredTopics = topics.filter((topic) => {
    const gradeMatch = topic.grade === selectedGrade
    const subjectMatch = selectedSubject === "all" || topic.subject === selectedSubject
    return gradeMatch && subjectMatch
  })

  return (
    <div className="space-y-6">
      {/* Grade and Subject Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Study Topics by Grade Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Grade Selection */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Select Grade:</h4>
              <div className="flex gap-2">
                {[6, 7, 8].map((grade) => (
                  <Button
                    key={grade}
                    variant={selectedGrade === grade ? "default" : "outline"}
                    onClick={() => setSelectedGrade(grade as 6 | 7 | 8)}
                    className="flex-1"
                  >
                    Grade {grade}
                  </Button>
                ))}
              </div>
            </div>

            {/* Subject Filter */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Filter by Subject:</h4>
              <div className="flex flex-wrap gap-2">
                {["all", "math", "science", "technology"].map((subject) => (
                  <Badge
                    key={subject}
                    variant={selectedSubject === subject ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => setSelectedSubject(subject)}
                  >
                    {subject !== "all" && getSubjectIcon(subject)}
                    <span className={subject !== "all" ? "ml-1" : ""}>
                      {subject === "technology" ? "AI" : subject.charAt(0).toUpperCase() + subject.slice(1)}
                    </span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTopics.map((topic) => (
          <Card key={topic.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{topic.title}</h3>
                    <p className="text-sm text-muted-foreground">{topic.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getSubjectColor(topic.subject)}>
                    {getSubjectIcon(topic.subject)}
                    <span className="ml-1">{topic.subject.charAt(0).toUpperCase() + topic.subject.slice(1)}</span>
                  </Badge>
                  <div className={`w-2 h-2 rounded-full ${getDifficultyColor(topic.difficulty)}`} />
                  <span className="text-xs text-muted-foreground capitalize">{topic.difficulty}</span>
                  <Badge variant="outline" className="text-xs">
                    Grade {topic.grade}
                  </Badge>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {topic.completedLessons}/{topic.totalLessons} lessons
                    </span>
                    <span className="font-medium text-foreground">{topic.progress}%</span>
                  </div>
                  <Progress value={topic.progress} className="h-2" />
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-accent">
                      <Star className="w-3 h-3" />
                      {topic.xpReward} XP
                    </div>
                    <div className="text-muted-foreground">~{topic.estimatedTime}min</div>
                  </div>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    {topic.progress > 0 ? "Continue" : "Start"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
