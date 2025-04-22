import { render, screen, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { DashboardProvider, useDashboard } from "@/context/dashboard-context"

// Create a test component that uses the context
const TestComponent = () => {
  const { cards, transactions, isLoading } = useDashboard()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div data-testid="cards-count">{cards.length}</div>
      <div data-testid="transactions-count">{transactions.length}</div>
    </div>
  )
}

describe("DashboardContext", () => {
  it("provides loading state initially", () => {
    render(
      <DashboardProvider>
        <TestComponent />
      </DashboardProvider>,
    )

    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("provides data after loading", async () => {
    jest.useFakeTimers()

    render(
      <DashboardProvider>
        <TestComponent />
      </DashboardProvider>,
    )

    // Fast-forward time to complete loading
    jest.advanceTimersByTime(1100)

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    })

    expect(screen.getByTestId("cards-count")).toHaveTextContent("3")
    expect(screen.getByTestId("transactions-count")).toHaveTextContent("3")

    jest.useRealTimers()
  })

  it("throws an error when used outside of provider", () => {
    // Suppress console.error for this test
    const originalError = console.error
    console.error = jest.fn()

    expect(() => {
      render(<TestComponent />)
    }).toThrow("useDashboard must be used within a DashboardProvider")

    // Restore console.error
    console.error = originalError
  })
})
