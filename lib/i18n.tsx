"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Language = "en" | "hi" | "mr"

export interface LanguageData {
  code: Language
  name: string
  nativeName: string
  flag: string
}

export const availableLanguages: LanguageData[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
]

const translations = {
  en: {
    // App Info
    appName: "STEM Learning Hub",
    ruralLearning: "Rural Learning Platform",
    appDescription: "Interactive STEM education designed for rural students with offline support and engaging games.",
    learnChamp: "LearnChamp",
    stemGamesOffline: "STEM games — offline & local languages",

    // Navigation & Status
    online: "Online",
    offline: "Offline",
    offlineMode: "Offline Mode",
    syncing: "Syncing...",
    synced: "Synced",
    pendingSync: "Pending sync ({count} items)",
    neverSynced: "Never synced",
    lastSyncDays: "Last sync {days} days ago",
    lastSyncHours: "Last sync {hours} hours ago",
    lastSyncMinutes: "Last sync {minutes} minutes ago",
    justSynced: "Just synced",

    dashboard: "Dashboard",
    challenges: "Challenges",
    achievements: "Achievements",
    topics: "Topics",
    avatar: "Avatar",
    games: "Games",

    quickGames: "Quick Games",
    recentAchievements: "Recent Achievements",
    dailyChallenge: "Daily Challenge",
    todaysChallenge: "Today's Challenge",
    studyTopics: "Study Topics",
    avatarCustomization: "Avatar Customization",

    gradeSubjects: "Grade {grade} Subjects",
    gradeDashboard: "Grade {grade} Dashboard",
    gradeTopics: "Grade {grade} Topics",

    welcomeBack: "Welcome back, {name}!",
    youngExplorer: "Young Explorer",
    stemChampion: "STEM Champion",
    stemExplorer: "STEM Explorer",
    readyToDiscover: "Ready to discover amazing STEM concepts?",
    readyToMaster: "Ready to master advanced STEM challenges?",

    progressToNextLevel: "Progress to next level",
    totalXP: "Total XP",
    dayStreak: "Day Streak",
    level: "Level",

    mathematics: "Mathematics",
    science: "Science",
    technology: "Technology",
    engineering: "Engineering",

    numberNinja: "Number Ninja",
    virtualLab: "Virtual Lab",
    codeQuest: "Code Quest",
    mathPuzzles: "Math puzzles & challenges",
    scienceExperiments: "Science experiments",
    programmingChallenges: "Programming challenges",

    startChallenge: "Start Challenge",
    viewAllGames: "View All Games",
    startYourFirstQuiz: "Start Your First Quiz",

    noAchievementsYet: "No achievements yet",
    completeFirstQuiz: "Complete your first quiz to unlock achievements!",
    quizzesCompleted: "quizzes completed",
    progress: "Progress",

    // Offline Messages
    youreOffline: "You're Offline",
    noConnection: "No internet connection detected",
    continueOffline: "Continue Learning Offline",
    tryAgain: "Try Again",

    // Common Actions
    back: "Back",

    // Authentication & Login
    studentLogin: "Student Login",
    facultyLogin: "Faculty Login",
    studentSignIn: "Student Sign In",
    studentSignUp: "Student Sign Up",
    facultySignIn: "Faculty Sign In",
    facultySignUp: "Faculty Sign Up",
    tryAsGuest: "Try as Guest",
    installApp: "Install App",

    // Home Page
    learnStemThrough: "Learn STEM through",
    funGames: "Fun Games",
    makingLearningFun: "Making Learning Fun",

    // Games
    memoryMaster: "Memory Master",
    scienceMemoryGame: "Science Memory Game",
    timeLimit: "Time Limit",
    goal: "Goal",
    challenge: "Challenge",
    xpReward: "XP Reward",
    congratulations: "Congratulations!",
    timesUp: "Time's Up!",
    matchesFound: "Matches Found",
    totalMoves: "Total Moves",
    xpEarned: "XP Earned",
    playAgain: "Play Again",
    backToGames: "Back to Games",
    startGame: "Start Game",
    matches: "matches",
    score: "Score",

    // Code Challenge
    codeChallenge: "Code Challenge",
    programmingChallenge: "Programming Challenge",
    language: "Language",
    points: "Points",
    codingComplete: "Coding Complete!",
    variablesInPython: "Variables in Python",
    forLoop: "For Loop",
    ifStatement: "If Statement",
    functionCall: "Function Call",
    listOperations: "List Operations",
    startCoding: "Start Coding",
    correct: "Correct!",
    incorrect: "Incorrect",

    // Brain Teaser
    brainBuster: "Brain Buster",
    engineeringLogicPuzzles: "Engineering Logic Puzzles",
    puzzles: "Puzzles",
    brainTeasers: "brain teasers",
    startThinking: "Start Thinking",
    engineeringChallenge: "Engineering Challenge",
    greatThinking: "Great thinking!",
    notQuiteRight: "Not quite right",
    brainPowerComplete: "Brain Power Complete!",

    // Quiz System
    quizComplete: "Quiz Complete!",
    finalScore: "Final Score",
    experiencePointsEarned: "Experience Points Earned",
    nextQuestion: "Next Question",
    completeQuiz: "Complete Quiz",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",

    // Score Display
    totalXpLabel: "Total XP",
    levelLabel: "Level",
    dayStreakLabel: "Day Streak",
    progressToLevel: "Progress to Level {level}",
    xpNeeded: "{xp} XP needed",
    achievementsCount: "{count} Achievements",
    rising: "Rising",

    // Daily Challenges
    dailyChallenges: "Daily Challenges",
    timeLeft: "{time} left",
    fractionMaster: "Fraction Master",
    circuitDetective: "Circuit Detective",
    codeNinja: "Code Ninja",
    solveFractionProblems: "Solve 10 fraction problems correctly",
    buildWorkingCircuits: "Build 3 working circuits in the lab",
    completePythonChallenges: "Complete 5 Python challenges",
    minLimit: "{min}min limit",

    // Achievements System
    achievementsTitle: "Achievements",
    unlocked: "Unlocked",
    total: "Total",
    firstSteps: "First Steps",
    streakMaster: "Streak Master",
    mathWizard: "Math Wizard",
    scienceExplorer: "Science Explorer",
    stemLegend: "STEM Legend",
    completeFirstGame: "Complete your first game",
    maintainLearningStreak: "Maintain a 7-day learning streak",
    scorePerfectMathGames: "Score 100% on 10 math games",
    completeAllLabExperiments: "Complete all virtual lab experiments",
    solveProgrammingChallenges: "Solve 50 programming challenges",
    reachLevel50AllSubjects: "Reach level 50 in all subjects",
    common: "Common",
    rare: "Rare",
    epic: "Epic",
    legendary: "Legendary",
    unlockedOn: "Unlocked on {date}",
    all: "All",

    // Material Upload
    uploadLearningMaterials: "Upload Learning Materials",
    subject: "Subject",
    gradeLevel: "Grade Level",
    materialTitle: "Material Title",
    description: "Description",
    selectFiles: "Select Files",
    uploading: "Uploading...",
    uploadMaterials: "Upload Materials",
    uploadedMaterials: "Uploaded Materials",
    selectSubject: "Select subject",
    selectGrade: "Select grade",
    enterDescriptiveTitle: "Enter a descriptive title",
    describeLearningMaterial: "Describe the learning material and how it should be used",
    dragDropFiles: "Drag and drop files here, or click to select",
    selectedFiles: "Selected Files",
    uploaded: "Uploaded",
    grade6: "Grade 6",
    grade7: "Grade 7",
    bothGrades: "Both Grades",

    // File Types and Sizes
    bytes: "Bytes",
    kb: "KB",
    mb: "MB",
    gb: "GB",

    // Game Specific Terms
    memoryMatchPairs: "8 pairs to match",
    fewerMovesHigherScore: "Fewer moves = higher score",
    upTo150XP: "Up to 150 XP",
    upTo100XP: "Up to 100 XP",
    upTo110XP: "Up to 110 XP",
    pythonBasics: "Python basics",
    codeProblems: "5 code problems",
    perCorrect: "20 per correct",
    perCorrectRange: "15-25 per correct",
    minutes: "minutes",

    // Time Formats
    hoursMinutes: "{hours}h {minutes}m",
    minutesSeconds: "{minutes}:{seconds}",

    // Common UI Elements
    continue: "Continue",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    close: "Close",
    open: "Open",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Info",
  },

  hi: {
    // App Info
    appName: "STEM शिक्षा केंद्र",
    ruralLearning: "ग्रामीण शिक्षा मंच",
    appDescription: "ग्रामीण छात्रों के लिए ऑफलाइन सहायता और आकर्षक खेलों के साथ इंटरैक्टिव STEM शिक्षा।",
    learnChamp: "लर्नचैंप",
    stemGamesOffline: "STEM खेल — ऑफलाइन और स्थानीय भाषाएं",

    // Navigation & Status
    online: "ऑनलाइन",
    offline: "ऑफलाइन",
    offlineMode: "ऑफलाइन मोड",
    syncing: "सिंक हो रहा है...",
    synced: "सिंक हो गया",
    pendingSync: "सिंक बाकी है ({count} आइटम)",
    neverSynced: "कभी सिंक नहीं हुआ",
    lastSyncDays: "अंतिम सिंक {days} दिन पहले",
    lastSyncHours: "अंतिम सिंक {hours} घंटे पहले",
    lastSyncMinutes: "अंतिम सिंक {minutes} मिनट पहले",
    justSynced: "अभी सिंक हुआ",

    dashboard: "डैशबोर्ड",
    challenges: "चुनौतियां",
    achievements: "उपलब्धियां",
    topics: "विषय",
    avatar: "अवतार",
    games: "खेल",

    quickGames: "त्वरित खेल",
    recentAchievements: "हाल की उपलब्धियां",
    dailyChallenge: "दैनिक चुनौती",
    todaysChallenge: "आज की चुनौती",
    studyTopics: "अध्ययन विषय",
    avatarCustomization: "अवतार अनुकूलन",

    gradeSubjects: "कक्षा {grade} विषय",
    gradeDashboard: "कक्षा {grade} डैशबोर्ड",
    gradeTopics: "कक्षा {grade} विषय",

    welcomeBack: "वापसी पर स्वागत, {name}!",
    youngExplorer: "युवा खोजकर्ता",
    stemChampion: "STEM चैंपियन",
    stemExplorer: "STEM खोजकर्ता",
    readyToDiscover: "अद्भुत STEM अवधारणाओं की खोज के लिए तैयार हैं?",
    readyToMaster: "उन्नत STEM चुनौतियों में महारत हासिल करने के लिए तैयार हैं?",

    progressToNextLevel: "अगले स्तर की प्रगति",
    totalXP: "कुल XP",
    dayStreak: "दिन की लकीर",
    level: "स्तर",

    mathematics: "गणित",
    science: "विज्ञान",
    technology: "प्रौद्योगिकी",
    engineering: "इंजीनियरिंग",

    numberNinja: "संख्या निंजा",
    virtualLab: "आभासी प्रयोगशाला",
    codeQuest: "कोड खोज",
    mathPuzzles: "गणित पहेलियां और चुनौतियां",
    scienceExperiments: "विज्ञान प्रयोग",
    programmingChallenges: "प्रोग्रामिंग चुनौतियां",

    startChallenge: "चुनौती शुरू करें",
    viewAllGames: "सभी खेल देखें",
    startYourFirstQuiz: "अपनी पहली प्रश्नोत्तरी शुरू करें",

    noAchievementsYet: "अभी तक कोई उपलब्धि नहीं",
    completeFirstQuiz: "उपलब्धियों को अनलॉक करने के लिए अपनी पहली प्रश्नोत्तरी पूरी करें!",
    quizzesCompleted: "प्रश्नोत्तरी पूर्ण",
    progress: "प्रगति",

    // Offline Messages
    youreOffline: "आप ऑफलाइन हैं",
    noConnection: "कोई इंटरनेट कनेक्शन नहीं मिला",
    continueOffline: "ऑफलाइन सीखना जारी रखें",
    tryAgain: "फिर कोशिश करें",

    // Common Actions
    back: "वापस",

    // Authentication & Login
    studentLogin: "छात्र लॉगिन",
    facultyLogin: "संकाय लॉगिन",
    studentSignIn: "छात्र साइन इन",
    studentSignUp: "छात्र साइन अप",
    facultySignIn: "संकाय साइन इन",
    facultySignUp: "संकाय साइन अप",
    tryAsGuest: "अतिथि के रूप में आज़माएं",
    installApp: "ऐप इंस्टॉल करें",

    // Home Page
    learnStemThrough: "STEM सीखें",
    funGames: "मज़ेदार खेलों के माध्यम से",
    makingLearningFun: "सीखने को मज़ेदार बनाना",

    // Games
    memoryMaster: "मेमोरी मास्टर",
    scienceMemoryGame: "विज्ञान मेमोरी गेम",
    timeLimit: "समय सीमा",
    goal: "लक्ष्य",
    challenge: "चुनौती",
    xpReward: "XP पुरस्कार",
    congratulations: "बधाई हो!",
    timesUp: "समय समाप्त!",
    matchesFound: "मैच मिले",
    totalMoves: "कुल चालें",
    xpEarned: "XP अर्जित",
    playAgain: "फिर खेलें",
    backToGames: "खेलों पर वापस",
    startGame: "खेल शुरू करें",
    matches: "मैच",
    score: "स्कोर",

    // Code Challenge
    codeChallenge: "कोड चुनौती",
    programmingChallenge: "प्रोग्रामिंग चुनौती",
    language: "भाषा",
    points: "अंक",
    codingComplete: "कोडिंग पूर्ण!",
    variablesInPython: "Python में वेरिएबल्स",
    forLoop: "For लूप",
    ifStatement: "If स्टेटमेंट",
    functionCall: "फंक्शन कॉल",
    listOperations: "लिस्ट ऑपरेशन्स",
    startCoding: "कोडिंग शुरू करें",
    correct: "सही!",
    incorrect: "गलत",

    // Brain Teaser
    brainBuster: "ब्रेन बस्टर",
    engineeringLogicPuzzles: "इंजीनियरिंग लॉजिक पहेलियां",
    puzzles: "पहेलियां",
    brainTeasers: "ब्रेन टीज़र",
    startThinking: "सोचना शुरू करें",
    engineeringChallenge: "इंजीनियरिंग चुनौती",
    greatThinking: "बेहतरीन सोच!",
    notQuiteRight: "बिल्कुल सही नहीं",
    brainPowerComplete: "ब्रेन पावर पूर्ण!",

    // Quiz System
    quizComplete: "प्रश्नोत्तरी पूर्ण!",
    finalScore: "अंतिम स्कोर",
    experiencePointsEarned: "अनुभव अंक अर्जित",
    nextQuestion: "अगला प्रश्न",
    completeQuiz: "प्रश्नोत्तरी पूर्ण करें",
    easy: "आसान",
    medium: "मध्यम",
    hard: "कठिन",

    // Score Display
    totalXpLabel: "कुल XP",
    levelLabel: "स्तर",
    dayStreakLabel: "दिन की लकीर",
    progressToLevel: "स्तर {level} की प्रगति",
    xpNeeded: "{xp} XP चाहिए",
    achievementsCount: "{count} उपलब्धियां",
    rising: "बढ़ रहा है",

    // Daily Challenges
    dailyChallenges: "दैनिक चुनौतियां",
    timeLeft: "{time} बचा है",
    fractionMaster: "भिन्न मास्टर",
    circuitDetective: "सर्किट डिटेक्टिव",
    codeNinja: "कोड निंजा",
    solveFractionProblems: "10 भिन्न समस्याओं को सही तरीके से हल करें",
    buildWorkingCircuits: "प्रयोगशाला में 3 काम करने वाले सर्किट बनाएं",
    completePythonChallenges: "5 Python चुनौतियां पूरी करें",
    minLimit: "{min}मिनट सीमा",

    // Achievements System
    achievementsTitle: "उपलब्धियां",
    unlocked: "अनलॉक किया गया",
    total: "कुल",
    firstSteps: "पहले कदम",
    streakMaster: "स्ट्रीक मास्टर",
    mathWizard: "गणित जादूगर",
    scienceExplorer: "विज्ञान खोजकर्ता",
    stemLegend: "STEM किंवदंती",
    completeFirstGame: "अपना पहला खेल पूरा करें",
    maintainLearningStreak: "7-दिन की सीखने की लकीर बनाए रखें",
    scorePerfectMathGames: "10 गणित खेलों में 100% स्कोर करें",
    completeAllLabExperiments: "सभी आभासी प्रयोगशाला प्रयोग पूरे करें",
    solveProgrammingChallenges: "50 प्रोग्रामिंग चुनौतियां हल करें",
    reachLevel50AllSubjects: "सभी विषयों में स्तर 50 तक पहुंचें",
    common: "सामान्य",
    rare: "दुर्लभ",
    epic: "महाकाव्य",
    legendary: "पौराणिक",
    unlockedOn: "{date} को अनलॉक किया गया",
    all: "सभी",

    // Material Upload
    uploadLearningMaterials: "शिक्षण सामग्री अपलोड करें",
    subject: "विषय",
    gradeLevel: "कक्षा स्तर",
    materialTitle: "सामग्री शीर्षक",
    description: "विवरण",
    selectFiles: "फाइलें चुनें",
    uploading: "अपलोड हो रहा है...",
    uploadMaterials: "सामग्री अपलोड करें",
    uploadedMaterials: "अपलोड की गई सामग्री",
    selectSubject: "विषय चुनें",
    selectGrade: "कक्षा चुनें",
    enterDescriptiveTitle: "एक वर्णनात्मक शीर्षक दर्ज करें",
    describeLearningMaterial: "शिक्षण सामग्री का वर्णन करें और इसका उपयोग कैसे किया जाना चाहिए",
    dragDropFiles: "फाइलों को यहां खींचें और छोड़ें, या चुनने के लिए क्लिक करें",
    selectedFiles: "चयनित फाइलें",
    uploaded: "अपलोड किया गया",
    grade6: "कक्षा 6",
    grade7: "कक्षा 7",
    bothGrades: "दोनों कक्षाएं",

    // File Types and Sizes
    bytes: "बाइट्स",
    kb: "KB",
    mb: "MB",
    gb: "GB",

    // Game Specific Terms
    memoryMatchPairs: "8 जोड़े मैच करने के लिए",
    fewerMovesHigherScore: "कम चालें = अधिक स्कोर",
    upTo150XP: "150 XP तक",
    upTo100XP: "100 XP तक",
    upTo110XP: "110 XP तक",
    pythonBasics: "Python मूल बातें",
    codeProblems: "5 कोड समस्याएं",
    perCorrect: "प्रति सही 20",
    perCorrectRange: "प्रति सही 15-25",
    minutes: "मिनट",

    // Time Formats
    hoursMinutes: "{hours}घं {minutes}मि",
    minutesSeconds: "{minutes}:{seconds}",

    // Common UI Elements
    continue: "जारी रखें",
    cancel: "रद्द करें",
    save: "सेव करें",
    delete: "हटाएं",
    edit: "संपादित करें",
    close: "बंद करें",
    open: "खोलें",
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    success: "सफलता",
    warning: "चेतावनी",
    info: "जानकारी",
  },

  mr: {
    // App Info
    appName: "STEM शिक्षण केंद्र",
    ruralLearning: "ग्रामीण शिक्षण व्यासपीठ",
    appDescription: "ग्रामीण विद्यार्थ्यांसाठी ऑफलाइन सहाय्य आणि आकर्षक खेळांसह परस्परसंवादी STEM शिक्षण।",
    learnChamp: "लर्नचॅम्प",
    stemGamesOffline: "STEM खेळ — ऑफलाइन आणि स्थानिक भाषा",

    // Navigation & Status
    online: "ऑनलाइन",
    offline: "ऑफलाइन",
    offlineMode: "ऑफलाइन मोड",
    syncing: "सिंक होत आहे...",
    synced: "सिंक झाले",
    pendingSync: "सिंक बाकी आहे ({count} आयटम)",
    neverSynced: "कधीच सिंक झाले नाही",
    lastSyncDays: "शेवटचे सिंक {days} दिवसांपूर्वी",
    lastSyncHours: "शेवटचे सिंक {hours} तासांपूर्वी",
    lastSyncMinutes: "शेवटचे सिंक {minutes} मिनिटांपूर्वी",
    justSynced: "आत्ताच सिंक झाले",

    dashboard: "डॅशबोर्ड",
    challenges: "आव्हाने",
    achievements: "यश",
    topics: "विषय",
    avatar: "अवतार",
    games: "खेळ",

    quickGames: "त्वरित खेळ",
    recentAchievements: "अलीकडील यश",
    dailyChallenge: "दैनंदिन आव्हान",
    todaysChallenge: "आजचे आव्हान",
    studyTopics: "अभ्यास विषय",
    avatarCustomization: "अवतार सानुकूलन",

    gradeSubjects: "इयत्ता {grade} विषय",
    gradeDashboard: "इयत्ता {grade} डॅशबोर्ड",
    gradeTopics: "इयत्ता {grade} विषय",

    welcomeBack: "परत स्वागत, {name}!",
    youngExplorer: "तरुण शोधक",
    stemChampion: "STEM चॅम्पियन",
    stemExplorer: "STEM शोधक",
    readyToDiscover: "आश्चर्यकारक STEM संकल्पना शोधण्यासाठी तयार आहात?",
    readyToMaster: "प्रगत STEM आव्हानांमध्ये प्रभुत्व मिळवण्यासाठी तयार आहात?",

    progressToNextLevel: "पुढील स्तरावरील प्रगती",
    totalXP: "एकूण XP",
    dayStreak: "दिवसांची पट्टी",
    level: "स्तर",

    mathematics: "गणित",
    science: "विज्ञान",
    technology: "तंत्रज्ञान",
    engineering: "अभियांत्रिकी",

    numberNinja: "संख्या निन्जा",
    virtualLab: "आभासी प्रयोगशाळा",
    codeQuest: "कोड शोध",
    mathPuzzles: "गणित कोडी आणि आव्हाने",
    scienceExperiments: "विज्ञान प्रयोग",
    programmingChallenges: "प्रोग्रामिंग आव्हाने",

    startChallenge: "आव्हान सुरू करा",
    viewAllGames: "सर्व खेळ पहा",
    startYourFirstQuiz: "तुमची पहिली प्रश्नमंजुषा सुरू करा",

    noAchievementsYet: "अजून कोणतेही यश नाही",
    completeFirstQuiz: "यश अनलॉक करण्यासाठी तुमची पहिली प्रश्नमंजुषा पूर्ण करा!",
    quizzesCompleted: "प्रश्नमंजुषा पूर्ण",
    progress: "प्रगती",

    // Offline Messages
    youreOffline: "तुम्ही ऑफलाइन आहात",
    noConnection: "कोणतेही इंटरनेट कनेक्शन आढळले नाही",
    continueOffline: "ऑफलाइन शिकणे सुरू ठेवा",
    tryAgain: "पुन्हा प्रयत्न करा",

    // Common Actions
    back: "मागे",

    // Authentication & Login
    studentLogin: "विद्यार्थी लॉगिन",
    facultyLogin: "प्राध्यापक लॉगिन",
    studentSignIn: "विद्यार्थी साइन इन",
    studentSignUp: "विद्यार्थी साइन अप",
    facultySignIn: "प्राध्यापक साइन इन",
    facultySignUp: "प्राध्यापक साइन अप",
    tryAsGuest: "पाहुणे म्हणून प्रयत्न करा",
    installApp: "अॅप इन्स्टॉल करा",

    // Home Page
    learnStemThrough: "STEM शिका",
    funGames: "मजेदार खेळांद्वारे",
    makingLearningFun: "शिकणे मजेदार बनवणे",

    // Games
    memoryMaster: "मेमरी मास्टर",
    scienceMemoryGame: "विज्ञान मेमरी गेम",
    timeLimit: "वेळ मर्यादा",
    goal: "ध्येय",
    challenge: "आव्हान",
    xpReward: "XP बक्षीस",
    congratulations: "अभिनंदन!",
    timesUp: "वेळ संपली!",
    matchesFound: "जुळणी सापडली",
    totalMoves: "एकूण हालचाली",
    xpEarned: "XP मिळवले",
    playAgain: "पुन्हा खेळा",
    backToGames: "खेळांकडे परत",
    startGame: "खेळ सुरू करा",
    matches: "जुळणी",
    score: "स्कोअर",

    // Code Challenge
    codeChallenge: "कोड आव्हान",
    programmingChallenge: "प्रोग्रामिंग आव्हान",
    language: "भाषा",
    points: "गुण",
    codingComplete: "कोडिंग पूर्ण!",
    variablesInPython: "Python मध्ये व्हेरिएबल्स",
    forLoop: "For लूप",
    ifStatement: "If स्टेटमेंट",
    functionCall: "फंक्शन कॉल",
    listOperations: "लिस्ट ऑपरेशन्स",
    startCoding: "कोडिंग सुरू करा",
    correct: "बरोबर!",
    incorrect: "चुकीचे",

    // Brain Teaser
    brainBuster: "ब्रेन बस्टर",
    engineeringLogicPuzzles: "अभियांत्रिकी तर्क कोडी",
    puzzles: "कोडी",
    brainTeasers: "ब्रेन टीझर",
    startThinking: "विचार सुरू करा",
    engineeringChallenge: "अभियांत्रिकी आव्हान",
    greatThinking: "उत्तम विचार!",
    notQuiteRight: "अगदी बरोबर नाही",
    brainPowerComplete: "ब्रेन पावर पूर्ण!",

    // Quiz System
    quizComplete: "प्रश्नमंजुषा पूर्ण!",
    finalScore: "अंतिम स्कोअर",
    experiencePointsEarned: "अनुभव गुण मिळवले",
    nextQuestion: "पुढील प्रश्न",
    completeQuiz: "प्रश्नमंजुषा पूर्ण करा",
    easy: "सोपे",
    medium: "मध्यम",
    hard: "कठीण",

    // Score Display
    totalXpLabel: "एकूण XP",
    levelLabel: "स्तर",
    dayStreakLabel: "दिवसांची पट्टी",
    progressToLevel: "स्तर {level} ची प्रगती",
    xpNeeded: "{xp} XP हवे",
    achievementsCount: "{count} यश",
    rising: "वाढत आहे",

    // Daily Challenges
    dailyChallenges: "दैनंदिन आव्हाने",
    timeLeft: "{time} बाकी",
    fractionMaster: "अपूर्णांक मास्टर",
    circuitDetective: "सर्किट डिटेक्टिव्ह",
    codeNinja: "कोड निन्जा",
    solveFractionProblems: "10 अपूर्णांक समस्या योग्यरित्या सोडवा",
    buildWorkingCircuits: "प्रयोगशाळेत 3 कार्यरत सर्किट बनवा",
    completePythonChallenges: "5 Python आव्हाने पूर्ण करा",
    minLimit: "{min}मिनिट मर्यादा",

    // Achievements System
    achievementsTitle: "यश",
    unlocked: "अनलॉक केले",
    total: "एकूण",
    firstSteps: "पहिली पावले",
    streakMaster: "स्ट्रीक मास्टर",
    mathWizard: "गणित जादूगार",
    scienceExplorer: "विज्ञान शोधक",
    stemLegend: "STEM दंतकथा",
    completeFirstGame: "तुमचा पहिला खेळ पूर्ण करा",
    maintainLearningStreak: "7-दिवसांची शिकण्याची पट्टी राखा",
    scorePerfectMathGames: "10 गणित खेळांमध्ये 100% स्कोअर करा",
    completeAllLabExperiments: "सर्व आभासी प्रयोगशाळा प्रयोग पूर्ण करा",
    solveProgrammingChallenges: "50 प्रोग्रामिंग आव्हाने सोडवा",
    reachLevel50AllSubjects: "सर्व विषयांमध्ये स्तर 50 गाठा",
    common: "सामान्य",
    rare: "दुर्मिळ",
    epic: "महाकाव्य",
    legendary: "पौराणिक",
    unlockedOn: "{date} रोजी अनलॉक केले",
    all: "सर्व",

    // Material Upload
    uploadLearningMaterials: "शिक्षण साहित्य अपलोड करा",
    subject: "विषय",
    gradeLevel: "इयत्ता स्तर",
    materialTitle: "साहित्य शीर्षक",
    description: "वर्णन",
    selectFiles: "फाइल्स निवडा",
    uploading: "अपलोड होत आहे...",
    uploadMaterials: "साहित्य अपलोड करा",
    uploadedMaterials: "अपलोड केलेले साहित्य",
    selectSubject: "विषय निवडा",
    selectGrade: "इयत्ता निवडा",
    enterDescriptiveTitle: "वर्णनात्मक शीर्षक प्रविष्ट करा",
    describeLearningMaterial: "शिक्षण साहित्याचे वर्णन करा आणि त्याचा वापर कसा करावा",
    dragDropFiles: "फाइल्स येथे ड्रॅग आणि ड्रॉप करा, किंवा निवडण्यासाठी क्लिक करा",
    selectedFiles: "निवडलेल्या फाइल्स",
    uploaded: "अपलोड केले",
    grade6: "इयत्ता 6",
    grade7: "इयत्ता 7",
    bothGrades: "दोन्ही इयत्ता",

    // File Types and Sizes
    bytes: "बाइट्स",
    kb: "KB",
    mb: "MB",
    gb: "GB",

    // Game Specific Terms
    memoryMatchPairs: "8 जोड्या जुळवण्यासाठी",
    fewerMovesHigherScore: "कमी हालचाली = जास्त स्कोअर",
    upTo150XP: "150 XP पर्यंत",
    upTo100XP: "100 XP पर्यंत",
    upTo110XP: "110 XP पर्यंत",
    pythonBasics: "Python मूलभूत गोष्टी",
    codeProblems: "5 कोड समस्या",
    perCorrect: "प्रति बरोबर 20",
    perCorrectRange: "प्रति बरोबर 15-25",
    minutes: "मिनिटे",

    // Time Formats
    hoursMinutes: "{hours}ता {minutes}मि",
    minutesSeconds: "{minutes}:{seconds}",

    // Common UI Elements
    continue: "सुरू ठेवा",
    cancel: "रद्द करा",
    save: "जतन करा",
    delete: "हटवा",
    edit: "संपादित करा",
    close: "बंद करा",
    open: "उघडा",
    loading: "लोड होत आहे...",
    error: "त्रुटी",
    success: "यश",
    warning: "चेतावणी",
    info: "माहिती",
  },
}

interface I18nContextType {
  currentLanguage: Language
  setLanguage: (language: Language) => void
  t: (key: string, params?: Record<string, any>) => string
  availableLanguages: LanguageData[]
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && availableLanguages.find((lang) => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language)
    if (isClient) {
      localStorage.setItem("language", language)
    }
  }

  const t = (key: string, params?: Record<string, any>): string => {
    const translation =
      translations[currentLanguage]?.[key as keyof (typeof translations)[typeof currentLanguage]] ||
      translations.en[key as keyof typeof translations.en] ||
      key

    if (params && typeof translation === "string") {
      return translation.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match
      })
    }

    return translation as string
  }

  return (
    <I18nContext.Provider value={{ currentLanguage, setLanguage, t, availableLanguages }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within an I18nProvider")
  }
  return context
}
