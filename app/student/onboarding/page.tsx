"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Trophy, Wifi, WifiOff, Star, ChevronRight, ChevronLeft, Languages, Gamepad2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { LanguageSelector } from "@/components/language-selector"

export default function StudentOnboarding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)

  const onboardingSteps = [
    {
      title: "Welcome to LearnChamp!",
      description: "Your journey to STEM mastery starts here",
      icon: <BookOpen className="w-16 h-16 text-primary" />,
      content: (
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">
            Learn Science, Technology, Engineering, and Mathematics through fun, interactive games designed just for
            you!
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-primary/10 rounded-lg">
              <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold text-sm">Earn XP & Levels</h4>
              <p className="text-xs text-muted-foreground">Complete quizzes to gain experience</p>
            </div>
            <div className="p-4 bg-secondary/10 rounded-lg">
              <Star className="w-8 h-8 text-secondary mx-auto mb-2" />
              <h4 className="font-semibold text-sm">Unlock Achievements</h4>
              <p className="text-xs text-muted-foreground">Collect badges as you learn</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Choose Your Language",
      description: "Switch between languages anytime",
      icon: <Languages className="w-16 h-16 text-secondary" />,
      content: (
        <div className="text-center space-y-6">
          <p className="text-lg text-muted-foreground">
            LearnChamp supports multiple languages. You can change this anytime from the top menu.
          </p>
          <div className="flex justify-center">
            <LanguageSelector />
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Tip:</strong> When you change the language, the entire app switches instantly - including games,
              quizzes, and instructions!
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Works Offline Too!",
      description: "Learn even without internet",
      icon: <WifiOff className="w-16 h-16 text-accent" />,
      content: (
        <div className="text-center space-y-6">
          <p className="text-lg text-muted-foreground">
            No internet? No problem! LearnChamp works offline so you can keep learning anywhere.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Wifi className="w-6 h-6 text-green-500" />
              <div className="text-left">
                <p className="font-medium text-sm">When Online</p>
                <p className="text-xs text-muted-foreground">Your progress syncs automatically</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <WifiOff className="w-6 h-6 text-orange-500" />
              <div className="text-left">
                <p className="font-medium text-sm">When Offline</p>
                <p className="text-xs text-muted-foreground">Keep playing, sync when connected</p>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            Your offline status is shown in the top bar
          </Badge>
        </div>
      ),
    },
    {
      title: "Ready to Start Learning?",
      description: "Let's explore your dashboard",
      icon: <Gamepad2 className="w-16 h-16 text-primary" />,
      content: (
        <div className="text-center space-y-6">
          <p className="text-lg text-muted-foreground">
            You're all set! Your dashboard has everything you need to start your STEM journey.
          </p>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">Subject Quizzes</p>
                <p className="text-xs text-muted-foreground">Math, Science, Technology & Engineering</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Gamepad2 className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">Fun Games</p>
                <p className="text-xs text-muted-foreground">Interactive learning through play</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">Leaderboards</p>
                <p className="text-xs text-muted-foreground">Compete with your classmates</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding and go to dashboard
      localStorage.setItem("onboardingCompleted", "true")
      router.push("/student")
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    localStorage.setItem("onboardingCompleted", "true")
    router.push("/student")
  }

  const currentStepData = onboardingSteps[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-card flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {onboardingSteps.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip
            </Button>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main content card */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">{currentStepData.icon}</div>
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
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary"
          >
            {currentStep === onboardingSteps.length - 1 ? "Start Learning!" : "Next"}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* App branding */}
        <div className="text-center mt-8">
          <div className="flex justify-center items-center gap-2 text-muted-foreground">
            <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <BookOpen className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium">LearnChamp</span>
          </div>
        </div>
      </div>
    </div>
  )
}
