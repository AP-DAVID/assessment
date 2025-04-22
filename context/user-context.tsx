"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Types for user data
export interface UserProfile {
  id: string
  name: string
  username: string
  email: string
  avatar: string | null
  dateOfBirth: string
  presentAddress: string
  permanentAddress: string
  city: string
  postalCode: string
  country: string
}

interface UserContextType {
  user: UserProfile | null
  isLoading: boolean
  updateUser: (data: Partial<UserProfile>) => Promise<void>
  updateAvatar: (file: File) => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// Mock initial user data
const initialUserData: UserProfile = {
  id: "user-1",
  name: "Charlene Reed",
  username: "charlene",
  email: "charlenereed@gmail.com",
  avatar: null,
  dateOfBirth: "1990-01-25",
  presentAddress: "San Jose, California, USA",
  permanentAddress: "San Jose, California, USA",
  city: "San Jose",
  postalCode: "45962",
  country: "usa",
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user data on initial render
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Check if we have user data in localStorage
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        } else {
          // Use initial data if no stored data
          setUser(initialUserData)
          localStorage.setItem("user", JSON.stringify(initialUserData))
        }
      } catch (error) {
        console.error("Failed to load user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  // Update user data
  const updateUser = async (data: Partial<UserProfile>) => {
    if (!user) return

    try {
      // In a real app, this would be an API call
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      const updatedUser = { ...user, ...data }
      setUser(updatedUser)

      // Save to localStorage for persistence
      localStorage.setItem("user", JSON.stringify(updatedUser))
    } catch (error) {
      console.error("Failed to update user data:", error)
      throw error
    }
  }

  // Update avatar
  const updateAvatar = async (file: File) => {
    if (!user) return

    try {
      // In a real app, this would upload to a server
      // Here we'll convert to base64 for demo purposes
      const base64 = await fileToBase64(file)

      const updatedUser = { ...user, avatar: base64 }
      setUser(updatedUser)

      // Save to localStorage for persistence
      localStorage.setItem("user", JSON.stringify(updatedUser))
    } catch (error) {
      console.error("Failed to update avatar:", error)
      throw error
    }
  }

  return <UserContext.Provider value={{ user, isLoading, updateUser, updateAvatar }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

// Helper function to convert File to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}
