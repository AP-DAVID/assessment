"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  fetchCards,
  fetchTransactions,
  fetchWeeklyActivity,
  fetchExpenseCategories,
  fetchContacts,
  fetchBalanceHistory,
} from "@/services/api"

// Types for our data
export interface Card {
  id: string
  balance: number
  cardHolder: string
  cardNumber: string
  validThru: string
  isDefault: boolean
}

export interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "transfer"
  amount: number
  description: string
  date: string
  icon: string
  iconBg: string
}

export interface WeeklyActivity {
  day: string
  deposit: number
  withdrawal: number
}

export interface ExpenseCategory {
  category: string
  percentage: number
  color: string
}

export interface Contact {
  id: string
  name: string
  role: string
  avatar: string
}

export interface BalanceHistory {
  month: string
  balance: number
}

interface DashboardContextType {
  cards: Card[]
  transactions: Transaction[]
  weeklyActivity: WeeklyActivity[]
  expenseCategories: ExpenseCategory[]
  contacts: Contact[]
  balanceHistory: BalanceHistory[]
  isLoading: boolean
  error: string | null
  refetchData: () => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for all data
  const [cards, setCards] = useState<Card[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivity[]>([])
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [balanceHistory, setBalanceHistory] = useState<BalanceHistory[]>([])

  // Function to fetch all data
  const fetchAllData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch all data in parallel
      const [cardsData, transactionsData, weeklyActivityData, expenseCategoriesData, contactsData, balanceHistoryData] =
        await Promise.all([
          fetchCards(),
          fetchTransactions(),
          fetchWeeklyActivity(),
          fetchExpenseCategories(),
          fetchContacts(),
          fetchBalanceHistory(),
        ])

      // Update state with fetched data
      setCards(cardsData)
      setTransactions(transactionsData)
      setWeeklyActivity(weeklyActivityData)
      setExpenseCategories(expenseCategoriesData)
      setContacts(contactsData)
      setBalanceHistory(balanceHistoryData)
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError("Failed to load dashboard data. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch data on initial load
  useEffect(() => {
    fetchAllData()
  }, [])

  const value = {
    cards,
    transactions,
    weeklyActivity,
    expenseCategories,
    contacts,
    balanceHistory,
    isLoading,
    error,
    refetchData: fetchAllData,
  }

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const context = useContext(DashboardContext)

  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }

  return context
}
