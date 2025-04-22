import { render, screen, fireEvent } from "../../test-utils"
import { QuickTransfer } from "@/components/dashboard/quick-transfer"

// Mock the useToast hook
jest.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

// Mock the useDashboard hook
jest.mock("@/context/dashboard-context", () => ({
  ...jest.requireActual("@/context/dashboard-context"),
  useDashboard: () => ({
    contacts: [
      {
        id: "contact1",
        name: "Livia Bator",
        role: "CEO",
        avatar: "/placeholder.svg?height=70&width=70",
      },
      {
        id: "contact2",
        name: "Randy Press",
        role: "Director",
        avatar: "/placeholder.svg?height=70&width=70",
      },
    ],
    isLoading: false,
  }),
}))

describe("QuickTransfer Component with Validation", () => {
  it("validates recipient selection", async () => {
    render(<QuickTransfer />)

    // Try to submit without selecting a recipient
    const sendButton = screen.getByRole("button", { name: /send/i })
    fireEvent.click(sendButton)

    // Check for validation message
    expect(screen.getByText("Please select a recipient")).toBeInTheDocument()
  })

  it("validates amount input", async () => {
    render(<QuickTransfer />)

    // Select a recipient
    const recipient = screen.getByText("Livia Bator").closest('[role="radio"]')
    if (recipient) {
      fireEvent.click(recipient)
    }

    // Enter invalid amount
    const amountInput = screen.getByLabelText(/transfer amount/i)
    fireEvent.change(amountInput, { target: { value: "-50" } })

    // Try to submit
    const sendButton = screen.getByRole("button", { name: /send/i })
    fireEvent.click(sendButton)

    // Check for validation message
    expect(screen.getByText("Amount must be greater than zero")).toBeInTheDocument()
  })

  it("enables the send button when form is valid", async () => {
    render(<QuickTransfer />)

    // Select a recipient
    const recipient = screen.getByText("Livia Bator").closest('[role="radio"]')
    if (recipient) {
      fireEvent.click(recipient)
    }

    // Enter valid amount
    const amountInput = screen.getByLabelText(/transfer amount/i)
    fireEvent.change(amountInput, { target: { value: "100" } })

    // Check that send button is enabled
    const sendButton = screen.getByRole("button", { name: /send/i })
    expect(sendButton).not.toBeDisabled()
  })
})
