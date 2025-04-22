import { render, screen, fireEvent, waitFor } from "../../test-utils"
import { SettingsForm } from "@/components/settings/settings-form"
import { UserProvider } from "@/context/user-context"
import { ReactNode, ReactPortal, ReactElement, JSXElementConstructor, JSX } from "react"

// Mock the useToast hook
jest.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

// Wrap the component with UserProvider for testing
const renderWithUserProvider = (ui: string | number | bigint | boolean | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | JSX.Element | null | undefined) => {
  return render(<UserProvider>{ui}</UserProvider>)
}

describe("SettingsForm Component", () => {
  it("renders the component with correct tabs", async () => {
    renderWithUserProvider(<SettingsForm />)

    // Wait for user data to load
    await waitFor(() => {
      expect(screen.getByRole("tab", { name: "Edit Profile" })).toBeInTheDocument()
    })

    expect(screen.getByRole("tab", { name: "Preferences" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Security" })).toBeInTheDocument()
  })

  it("displays the profile form fields", async () => {
    renderWithUserProvider(<SettingsForm />)

    // Wait for user data to load
    await waitFor(() => {
      expect(screen.getByLabelText("Your Name")).toBeInTheDocument()
    })

    expect(screen.getByLabelText("User Name")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByLabelText("Date of Birth")).toBeInTheDocument()
    expect(screen.getByLabelText("Present Address")).toBeInTheDocument()
    expect(screen.getByLabelText("Permanent Address")).toBeInTheDocument()
    expect(screen.getByLabelText("City")).toBeInTheDocument()
    expect(screen.getByLabelText("Postal Code")).toBeInTheDocument()
    expect(screen.getByLabelText("Country")).toBeInTheDocument()
  })

  it("allows editing form fields", async () => {
    renderWithUserProvider(<SettingsForm />)

    // Wait for user data to load
    await waitFor(() => {
      expect(screen.getByLabelText("Your Name")).toBeInTheDocument()
    })

    const nameInput = screen.getByLabelText("Your Name")
    fireEvent.change(nameInput, { target: { value: "John Doe" } })
    expect(nameInput).toHaveValue("John Doe")

    const emailInput = screen.getByLabelText("Email")
    fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } })
    expect(emailInput).toHaveValue("john.doe@example.com")
  })

  it("displays the save button", async () => {
    renderWithUserProvider(<SettingsForm />)

    // Wait for user data to load
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
    })
  })
})
