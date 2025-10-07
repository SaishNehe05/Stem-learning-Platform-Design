"use client"

export interface SignUpData {
  email: string
  password: string
  displayName: string
  userType: "student" | "teacher"
  grade?: number
  school?: string
  subjects?: string[]
  facultyId?: string
  phone?: string
}

interface StoredUser {
  uid: string
  email: string
  password: string // stored in plain text for demo purposes only
  displayName: string
  userType: "student" | "teacher"
}

interface AppUser {
  uid: string
  email: string
  displayName: string
  userType: "student" | "teacher"
}

interface AppUserProfile {
  uid: string
  email: string
  displayName: string
  userType: "student" | "teacher"
  grade?: number
  school?: string
  subjects?: string[]
  facultyId?: string
  phone?: string
  createdAt: string
}

const USERS_KEY = "users" // map keyed by email
const CURRENT_USER_KEY = "currentUser"

function getUsers(): Record<string, StoredUser> {
  const raw = localStorage.getItem(USERS_KEY)
  return raw ? (JSON.parse(raw) as Record<string, StoredUser>) : {}
}

function setUsers(users: Record<string, StoredUser>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function toAppUser(u: StoredUser): AppUser {
  return { uid: u.uid, email: u.email, displayName: u.displayName, userType: u.userType }
}

function dispatchAuthChange(user: AppUser | null, userProfile: AppUserProfile | null) {
  window.dispatchEvent(new CustomEvent("auth-change", { detail: { user, userProfile } }))
}

export async function signUpWithEmail(data: SignUpData) {
  try {
    const users = getUsers()
    const existing = users[data.email.toLowerCase()]
    if (existing) {
      const error: any = new Error("Email already in use")
      error.code = "auth/email-already-in-use"
      throw error
    }

    const uid = crypto.randomUUID()
    const stored: StoredUser = {
      uid,
      email: data.email.toLowerCase(),
      password: data.password,
      displayName: data.displayName,
      userType: data.userType,
    }
    users[stored.email] = stored
    setUsers(users)

    const appUser = toAppUser(stored)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(appUser))

    const userProfile: AppUserProfile = {
      uid,
      email: stored.email,
      displayName: data.displayName,
      userType: data.userType,
      grade: data.grade,
      school: data.school,
      subjects: data.subjects,
      facultyId: data.facultyId,
      phone: data.phone,
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem(`userProfile_${uid}`, JSON.stringify(userProfile))

    // Notify context
    dispatchAuthChange(appUser, userProfile)

    return { user: appUser, userProfile }
  } catch (error) {
    console.error("[v0] Error signing up:", error)
    throw error
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const users = getUsers()
    const record = users[email.toLowerCase()]
    if (!record) {
      const error: any = new Error("User not found")
      error.code = "auth/user-not-found"
      throw error
    }
    if (record.password !== password) {
      const error: any = new Error("Wrong password")
      error.code = "auth/wrong-password"
      throw error
    }

    const appUser = toAppUser(record)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(appUser))

    const profileRaw = localStorage.getItem(`userProfile_${record.uid}`)
    const userProfile: AppUserProfile | null = profileRaw ? JSON.parse(profileRaw) : null

    // Notify context
    dispatchAuthChange(appUser, userProfile)

    return appUser
  } catch (error) {
    console.error("[v0] Error signing in:", error)
    throw error
  }
}

export function getAuthErrorMessage(error: any): string {
  switch (error?.code) {
    case "auth/user-not-found":
      return "No account found with this email address."
    case "auth/wrong-password":
      return "Incorrect password."
    case "auth/email-already-in-use":
      return "An account with this email already exists."
    case "auth/weak-password":
      return "Password should be at least 6 characters."
    case "auth/invalid-email":
      return "Please enter a valid email address."
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later."
    default:
      return "An error occurred. Please try again."
  }
}
