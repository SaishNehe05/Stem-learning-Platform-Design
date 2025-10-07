"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { BookOpen, Users, Plus, ChevronRight, ChevronLeft, School, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { LanguageSelector } from "@/components/language-selector"

export default function TeacherSetup() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [classes, setClasses] = useState<Array<{ id: string; name: string; grade: number; section: string }>>([])
  const [newClassName, setNewClassName] = useState("")
  const [newClassGrade, setNewClassGrade] = useState("")
  const [newClassSection, setNewClassSection] = useState("")
  const [subjects, setSubjects] = useState<string[]>([])

  const setupSteps = [
    {
      title: "Welcome to LearnChamp Teacher Portal",
      description: "Set up your classes and start tracking student progress",
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto">
            <School className="w-10 h-10 text-white" />
          </div>
          <p className="text-lg text-muted-foreground">
            As a teacher, you'll have access to powerful analytics, class management tools, and student progress
            tracking.
          </p>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">Class Management</p>
                <p className="text-xs text-muted-foreground">Create classes and invite students</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">Progress Analytics</p>
                <p className="text-xs text-muted-foreground">Track student performance and engagement</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Select Your Subjects",
      description: "Choose the subjects you teach",
      content: (
        <div className="space-y-6">
          <p className="text-muted-foreground">Select all subjects you teach. You can modify this later.</p>
          <div className="grid grid-cols-2 gap-4">
            {["Mathematics", "Science", "Technology", "Engineering"].map((subject) => (
              <div key={subject} className="flex items-center space-x-2">
                <Checkbox
                  id={subject}
                  checked={subjects.includes(subject)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSubjects([...subjects, subject])
                    } else {
                      setSubjects(subjects.filter((s) => s !== subject))
                    }
                  }}
                />
                <Label htmlFor={subject} className="text-sm font-medium">
                  {subject}
                </Label>
              </div>
            ))}
          </div>
          {subjects.length > 0 && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2">Selected subjects:</p>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <Badge key={subject} variant="secondary">
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Create Your Classes",
      description: "Set up classes to organize your students",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="class-name">Class Name</Label>
                <Input
                  id="class-name"
                  placeholder="e.g., Morning Class"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class-grade">Grade</Label>
                <Input
                  id="class-grade"
                  placeholder="e.g., 6"
                  value={newClassGrade}
                  onChange={(e) => setNewClassGrade(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class-section">Section</Label>
                <Input
                  id="class-section"
                  placeholder="e.g., A"
                  value={newClassSection}
                  onChange={(e) => setNewClassSection(e.target.value)}
                />
              </div>
            </div>
            <Button
              onClick={() => {
                if (newClassName && newClassGrade) {
                  const newClass = {
                    id: `class-${Date.now()}`,
                    name: newClassName,
                    grade: Number.parseInt(newClassGrade),
                    section: newClassSection || "A",
                  }
                  setClasses([...classes, newClass])
                  setNewClassName("")
                  setNewClassGrade("")
                  setNewClassSection("")
                }
              }}
              className="w-full"
              disabled={!newClassName || !newClassGrade}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Class
            </Button>
          </div>

          {classes.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Your Classes:</h4>
              {classes.map((cls) => (
                <div key={cls.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{cls.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Grade {cls.grade} - Section {cls.section}
                    </p>
                  </div>
                  <Badge variant="outline">0 students</Badge>
                </div>
              ))}
            </div>
          )}

          {classes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No classes created yet. Add your first class above.</p>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "You're All Set!",
      description: "Start managing your classes and tracking student progress",
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto">
            <UserPlus className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">Your teacher account is ready! You can now:</p>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">1</span>
                </div>
                <span className="text-sm">Invite students to your classes using class codes</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">2</span>
                </div>
                <span className="text-sm">Monitor student progress and engagement</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">3</span>
                </div>
                <span className="text-sm">Assign targeted practice and send messages</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const handleNext = () => {
    if (currentStep < setupSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete setup and go to dashboard
      localStorage.setItem("teacherSetupCompleted", "true")
      localStorage.setItem("teacherClasses", JSON.stringify(classes))
      localStorage.setItem("teacherSubjects", JSON.stringify(subjects))
      router.push("/teacher")
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return subjects.length > 0
      case 2:
        return classes.length > 0
      default:
        return true
    }
  }

  const currentStepData = setupSteps[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-card flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {setupSteps.length}
            </span>
            <LanguageSelector />
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / setupSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main content card */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl text-balance">{currentStepData.title}</CardTitle>
            <CardDescription className="text-lg">{currentStepData.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">{currentStepData.content}</CardContent>
        </Card>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2 bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary"
          >
            {currentStep === setupSteps.length - 1 ? "Go to Dashboard" : "Next"}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* App branding */}
        <div className="text-center mt-8">
          <div className="flex justify-center items-center gap-2 text-muted-foreground">
            <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <BookOpen className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium">LearnChamp Teacher Portal</span>
          </div>
        </div>
      </div>
    </div>
  )
}
