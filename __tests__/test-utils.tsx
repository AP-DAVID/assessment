import { render as rtlRender } from "@testing-library/react"
import { DashboardProvider } from "@/context/dashboard-context"
import { ThemeProvider } from "@/components/theme-provider"
import { ReactElement, ReactNode } from "react"
import { RenderOptions } from "@testing-library/react"

interface WrapperProps {
  children: ReactNode
}

interface CustomRenderOptions extends RenderOptions {}

function render(ui: ReactElement, { ...renderOptions }: CustomRenderOptions = {}) {
  function Wrapper({ children }: WrapperProps) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light">
        <DashboardProvider>{children}</DashboardProvider>
      </ThemeProvider>
    )
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

// re-export everything
export * from "@testing-library/react"

// override render method
export { render }
