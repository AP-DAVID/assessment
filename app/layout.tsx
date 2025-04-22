import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { BrowserCompatibility } from "@/components/browser-compatibility"
import { PerformanceMonitor } from "./performance-monitor"
import { UserProvider } from "@/context/user-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: "Soar Assessment task | Akintola Abiodun",
  description: "Akintola Abiodun Soar Assessment TASK",
  icons: {
    icon: "/dashboardAssets/soar.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <UserProvider>
            {children}
            <Toaster />
            <BrowserCompatibility />
            <PerformanceMonitor />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
