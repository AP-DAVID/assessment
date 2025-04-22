import { render, screen } from "../../test-utils"
import { MyCards } from "@/components/dashboard/my-cards"

// Mock the useDashboard hook
jest.mock("@/context/dashboard-context", () => ({
  ...jest.requireActual("@/context/dashboard-context"),
  useDashboard: () => ({
    cards: [
      {
        id: "card1",
        balance: 5756,
        cardHolder: "Eddy Cusuma",
        cardNumber: "3778 **** **** 1234",
        validThru: "12/22",
        isDefault: true,
      },
      {
        id: "card2",
        balance: 5756,
        cardHolder: "Eddy Cusuma",
        cardNumber: "3778 **** **** 1234",
        validThru: "12/22",
        isDefault: false,
      },
    ],
  }),
}))

describe("MyCards Component", () => {
  it("renders the component with correct title", () => {
    render(<MyCards />)
    expect(screen.getByText("My Cards")).toBeInTheDocument()
  })

  it('displays the "See All" link', () => {
    render(<MyCards />)
    expect(screen.getByText("See All")).toBeInTheDocument()
  })

  it("renders the correct number of cards", () => {
    render(<MyCards />)
    // Check for card holder name which appears on each card
    const cardHolderElements = screen.getAllByText("Eddy Cusuma")
    expect(cardHolderElements).toHaveLength(2)
  })

  it("displays card details correctly", () => {
    render(<MyCards />)
    expect(screen.getAllByText("$5,756")).toHaveLength(2)
    expect(screen.getAllByText("VALID THRU")).toHaveLength(2)
    expect(screen.getAllByText("12/22")).toHaveLength(2)
    expect(screen.getAllByText("CARD HOLDER")).toHaveLength(2)
    expect(screen.getAllByText("3778 **** **** 1234")).toHaveLength(2)
  })
})
