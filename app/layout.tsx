import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import { I18nProvider } from "@/lib/i18n"
import { AuthProvider } from "@/lib/auth-context"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "LearnChamp - STEM Learning Platform",
  description: "Gamified STEM learning platform for rural schools with offline capability",
  generator: "v0.app",
  manifest: "/manifest.json",
  themeColor: "#059669",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} antialiased`}>
        <AuthProvider>
          <I18nProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
