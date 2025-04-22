import { render, screen } from "../../test-utils"
import { WeeklyActivity } from "@/components/dashboard/weekly-activity"

// Mock Chart.js
jest.mock("chart.js/auto", () => {
  return jest.fn().mockImplementation(() => {
    return {
      destroy: jest.fn(),
    }
  })
})

// Mock the useDashboard hook
jest.mock("@/context/dashboard-context", () => ({
  ...jest.requireActual("@/context/dashboard-context"),
  useDashboard: () => ({
    weeklyActivity: [
      { day: "Mon", deposit: 100, withdrawal: 50 },
      { day: "Tue", deposit: 150, withdrawal: 75 },
    ],
    isLoading: false,
  }),
}))

describe("WeeklyActivity Component", () => {
  it("renders the component with correct title", () => {
    render(<WeeklyActivity />)
    expect(screen.getByText("Weekly Activity")).toBeInTheDocument()
  })

  it("renders the canvas element when data is loaded", () => {
    render(<WeeklyActivity />)
    const canvas = document.querySelector("canvas")
    expect(canvas).toBeInTheDocument()
  })

  it("shows loading state when isLoading is true", () => {
    // Mock loading state
    jest.spyOn(require("@/context/dashboard-context"), "useDashboard").mockImplementation(() => ({
      weeklyActivity: [],
      isLoading: true,
    }))

    render(<WeeklyActivity />)

    // Check for loading indicator
    expect(screen.getByRole("status")).toBeInTheDocument()
  })
})
