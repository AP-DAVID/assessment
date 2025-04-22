import { render, screen } from "../../test-utils"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"

// Mock the useDashboard hook
jest.mock("@/context/dashboard-context", () => ({
  ...jest.requireActual("@/context/dashboard-context"),
  useDashboard: () => ({
    transactions: [
      {
        id: "tx1",
        type: "withdrawal",
        amount: 850,
        description: "Deposit from my Card",
        date: "28 January 2021",
        icon: "card",
        iconBg: "bg-amber-100",
      },
      {
        id: "tx2",
        type: "deposit",
        amount: 2500,
        description: "Deposit Paypal",
        date: "25 January 2021",
        icon: "paypal",
        iconBg: "bg-blue-100",
      },
    ],
  }),
}))

describe("RecentTransactions Component", () => {
  it("renders the component with correct title", () => {
    render(<RecentTransactions />)
    expect(screen.getByText("Recent Transaction")).toBeInTheDocument()
  })

  it("displays the correct number of transactions", () => {
    render(<RecentTransactions />)
    expect(screen.getByText("Deposit from my Card")).toBeInTheDocument()
    expect(screen.getByText("Deposit Paypal")).toBeInTheDocument()
  })

  it("displays transaction details correctly", () => {
    render(<RecentTransactions />)
    expect(screen.getByText("28 January 2021")).toBeInTheDocument()
    expect(screen.getByText("25 January 2021")).toBeInTheDocument()

    // Check for transaction amounts with correct formatting
    expect(screen.getByText("-$850")).toBeInTheDocument()
    expect(screen.getByText("+$2500")).toBeInTheDocument()
  })
})
